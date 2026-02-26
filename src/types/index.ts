export interface TranscriptItem {
    id: string;
    timestamp: string;
    text: string;
}

export interface DiagramNode {
    id: string;
    label: string;
    parent?: string;
    connections?: string[];
}

export interface VideoData {
    videoId: string;
    title: string;
    channelName: string;
    thumbnailUrl: string;
    durationInSeconds: number;
}

export interface WorkspaceState {
    guestSessionId: string | null;
    videoData: VideoData | null;
    transcript: TranscriptItem[];
    summary: string | null;
    mindMapSyntax: string | null;
    flowChartSyntax: string | null;
    isProcessing: boolean;
    processingStage: string | null;

    // Actions
    setVideoUrl: (url: string) => Promise<void>;
    clearWorkspace: () => void;
    setProcessingState: (isProcessing: boolean, stage?: string) => void;
}
