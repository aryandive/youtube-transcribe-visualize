import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { VideoData } from '../types';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface TranscriptItem {
  id: string;
  timestamp: string;
  text: string;
}

interface WorkspaceState {
  // Session States
  isGuest: boolean;
  authUser: AuthUser | null;
  guestSessionId: string | null;
  credits: number;
  guestTransferReady: boolean;

  // Payload Data
  videoData: VideoData | null;
  transcript: TranscriptItem[];
  summary: string | null;
  mindMapSyntax: string | null;
  flowChartSyntax: string | null;

  // App Processing States
  isProcessingTranscript: boolean;
  isProcessingSummary: boolean;
  isProcessingVisual: boolean;
  transcriptError: string | null;

  // Actions
  initializeAuthListener: () => void;
  setGuestMode: (isGuest: boolean, user?: AuthUser | null) => void;
  spendCredit: (amount: number) => Promise<boolean>;

  // On-Demand Generators
  fetchVideoAndTranscript: (url: string) => Promise<void>;
  generateSummary: (format: string) => Promise<void>;
  generateMindMap: () => Promise<void>;
  generateFlowChart: () => Promise<void>;

  clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      isGuest: true,
      authUser: null,
      guestSessionId: null,
      credits: 3, // Guests start with 3 credits
      guestTransferReady: false,

      videoData: null,
      transcript: [],
      summary: null,
      mindMapSyntax: null,
      flowChartSyntax: null,

      isProcessingTranscript: false,
      isProcessingSummary: false,
      isProcessingVisual: false,
      transcriptError: null,

      initializeAuthListener: () => {
        let authInitialized = false;

        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            // First time this session becomes active (e.g. after OAuth redirect or login)
            if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && !authInitialized)) {
              authInitialized = true;

              // 1. Fetch credits securely from DB
              const { data } = await supabase.from('users').select('credits, tier').eq('id', session.user.id).single();

              const currentStore = get();
              // 2. Perform Guest Data Migration if they had unsaved work in Session Storage
              if (currentStore.guestTransferReady && currentStore.videoData && currentStore.transcript.length > 0) {
                console.log("Migrating local guest workspace to Supabase...");

                // Upsert Video globally
                await supabase.from('videos').upsert({
                  id: currentStore.videoData.videoId,
                  title: currentStore.videoData.title,
                  channel_name: currentStore.videoData.channelName,
                  thumbnail_url: currentStore.videoData.thumbnailUrl,
                  duration_in_seconds: currentStore.videoData.durationInSeconds
                });

                // Insert Transcript tied to real User Profile
                await supabase.from('transcripts').upsert({
                  video_id: currentStore.videoData.videoId,
                  user_id: session.user.id,
                  transcript_data: currentStore.transcript,
                  summary_data: currentStore.summary,
                  mindmap_syntax: currentStore.mindMapSyntax,
                  flowchart_syntax: currentStore.flowChartSyntax
                }, { onConflict: 'video_id,user_id' });

                // Clear the guest transfer flag
                set({ guestTransferReady: false });
              }

              // 3. Hydrate state
              set({
                isGuest: false,
                authUser: {
                  id: session.user.id,
                  name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                  email: session.user.email || '',
                  avatarUrl: session.user.user_metadata?.avatar_url
                },
                credits: data?.credits ?? 3
              });
            }
          } else {
            set({ isGuest: true, authUser: null, credits: 3 });
          }
        });
      },

      setGuestMode: (isGuest: boolean, user: AuthUser | null = null) => {
        // If they auth, give them more mock credits
        set({ isGuest, authUser: user, credits: isGuest ? get().credits : 100 });
      },

      spendCredit: async (amount: number) => {
        const { credits, isGuest } = get();

        // Handle guest local deduction
        if (isGuest) {
          if (credits >= amount) {
            set({ credits: credits - amount });
            return true;
          }
          return false;
        }

        // Handle authenticated server-authoritative deduction
        try {
          const { data, error } = await supabase.rpc('decrement_credit', { deduct_amount: amount });

          if (error || !data) {
            console.error("Failed to deduct credits server-side:", error);
            return false;
          }

          // Fetch the new truth from the database to ensure sync
          const { data: userData } = await supabase.from('users').select('credits').eq('id', get().authUser!.id).single();
          if (userData) {
            set({ credits: userData.credits });
          }
          return true;

        } catch (err) {
          console.error("RPC Error:", err);
          return false;
        }
      },

      fetchVideoAndTranscript: async (url: string) => {
        const sessionId = get().guestSessionId || crypto.randomUUID();
        set({
          isProcessingTranscript: true,
          transcriptError: null,
          guestSessionId: sessionId,
          videoData: null,
          transcript: [],
          summary: null,
          mindMapSyntax: null,
          flowChartSyntax: null,
        });

        const success = await get().spendCredit(1);
        if (!success) {
          set({ isProcessingTranscript: false, transcriptError: "Insufficient credits. Please upgrade." });
          return;
        }

        try {
          const { videoData, transcript } = await api.fetchTranscript(url);
          set({
            isProcessingTranscript: false,
            videoData,
            transcript,
            guestTransferReady: get().isGuest
          });
        } catch (error) {
          set({
            isProcessingTranscript: false,
            transcriptError: error instanceof Error ? error.message : "Failed to fetch video data.",
            credits: get().credits + 1 // Refund the credit on failure
          });
        }
      },

      generateSummary: async (format: string) => {
        const { transcript, spendCredit } = get();
        if (transcript.length === 0) return;

        const success = await spendCredit(1);
        if (!success) {
          // In a real app we'd trigger a modal here
          alert("Insufficient credits to generate summary.");
          return;
        }

        set({ isProcessingSummary: true });
        try {
          const summary = await api.generateSummary(transcript, format);
          set({ summary, isProcessingSummary: false });
        } catch (error) {
          set({ isProcessingSummary: false });
        }
      },

      generateMindMap: async () => {
        const { transcript, spendCredit } = get();
        if (transcript.length === 0) return;

        const success = await spendCredit(1);
        if (!success) {
          alert("Insufficient credits to generate Mind Map.");
          return;
        }

        set({ isProcessingVisual: true });
        try {
          const mindMapSyntax = await api.generateMindMap(transcript);
          set({ mindMapSyntax, isProcessingVisual: false });
        } catch (error) {
          set({ isProcessingVisual: false });
        }
      },

      generateFlowChart: async () => {
        const { transcript, spendCredit } = get();
        if (transcript.length === 0) return;

        const success = await spendCredit(1);
        if (!success) {
          alert("Insufficient credits to generate Flow Chart.");
          return;
        }

        set({ isProcessingVisual: true });
        try {
          const flowChartSyntax = await api.generateFlowChart(transcript);
          set({ flowChartSyntax, isProcessingVisual: false });
        } catch (error) {
          set({ isProcessingVisual: false });
        }
      },

      clearWorkspace: () => {
        set({
          videoData: null,
          transcript: [],
          summary: null,
          mindMapSyntax: null,
          flowChartSyntax: null,
          isProcessingTranscript: false,
          isProcessingSummary: false,
          isProcessingVisual: false,
          transcriptError: null
        });
      },

    }),
    {
      name: 'youtube-visualizer-workspace-v3',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
