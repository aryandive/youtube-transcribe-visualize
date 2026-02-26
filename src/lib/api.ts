import { VideoData, TranscriptItem } from '@/types';
import { supabase } from '@/lib/supabase';

export const api = {
  fetchTranscript: async (url: string): Promise<{ videoData: VideoData; transcript: TranscriptItem[] }> => {
    const response = await fetch(`/api/transcript?url=${encodeURIComponent(url)}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to fetch transcript from the server.");
    }

    return await response.json();
  },

  generateAnalysis: async (transcript: TranscriptItem[], formatType: 'summary' | 'mindmap' | 'flowchart'): Promise<string> => {
    // 1. Get the current Supabase session token
    const { data: { session } } = await supabase.auth.getSession();

    // 2. We allow guest requests (token will be undefined), the python backend will mock the credit check or reject.
    // In production, guest generation should probably be blocked entirely or handled via a server cookie.
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    // 3. Fire the request
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        transcript,
        format_type: formatType
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to generate ${formatType}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse.generated_content;
  },

  generateSummary: async (transcript: TranscriptItem[], format: string): Promise<string> => {
    return await api.generateAnalysis(transcript, 'summary');
  },

  generateMindMap: async (transcript: TranscriptItem[]): Promise<string> => {
    return await api.generateAnalysis(transcript, 'mindmap');
  },

  generateFlowChart: async (transcript: TranscriptItem[]): Promise<string> => {
    return await api.generateAnalysis(transcript, 'flowchart');
  }
};
