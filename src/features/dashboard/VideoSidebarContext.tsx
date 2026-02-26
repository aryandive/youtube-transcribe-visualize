import { VideoData } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, Clock, FileText } from 'lucide-react';
import { useState } from 'react';
import { ConversionModal } from '@/features/auth/ConversionModal';

interface VideoSidebarContextProps {
    videoData: VideoData | null;
}

export function VideoSidebarContext({ videoData }: VideoSidebarContextProps) {
    const [showModal, setShowModal] = useState(false);

    if (!videoData) return null;

    const isGuestLimited = videoData.durationInSeconds > 600; // 10 minutes limit
    const maxGuestTime = 600;
    const processedPercentage = isGuestLimited
        ? (maxGuestTime / videoData.durationInSeconds) * 100
        : 100;

    return (
        <>
            <div className="flex flex-col h-full gap-6">
                {/* Video Card */}
                <div className="rounded-xl overflow-hidden border bg-card shadow-sm">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                        <img
                            src={videoData.thumbnailUrl}
                            alt={videoData.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                        <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
                            {videoData.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                            {videoData.channelName}
                        </p>
                    </div>
                </div>

                {/* Compute Meter (The 10-Min Wall Tease) */}
                <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card/50">
                    <div className="flex justify-between items-center whitespace-nowrap">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Compute Meter
                        </h4>
                        {isGuestLimited && <Lock className="w-3.5 h-3.5 text-orange-500" />}
                    </div>

                    <Progress value={processedPercentage} className="h-2" />

                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{Math.min(10, Math.round(videoData.durationInSeconds / 60))}m Processed</span>
                        <span>{Math.round(videoData.durationInSeconds / 60)}m Total</span>
                    </div>

                    {isGuestLimited && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full mt-2 text-xs bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                            onClick={() => setShowModal(true)}
                        >
                            Unlock Full Video
                        </Button>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card/50">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Output Stats
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Transcript</span>
                        <span className="font-medium">~{Math.min(10, Math.round(videoData.durationInSeconds / 60)) * 150} Words</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Summary</span>
                        <span className="font-medium">~2 Min Read</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t">
                    <Button
                        className="w-full font-medium"
                        variant="default"
                        onClick={() => setShowModal(true)}
                    >
                        Create Free Account
                    </Button>
                    <p className="text-[11px] text-center text-muted-foreground mt-3">
                        Save visualizations, export PDFs, and unlock full videos.
                    </p>
                </div>
            </div>

            <ConversionModal
                open={showModal}
                onOpenChange={setShowModal}
                triggerType="compute"
            />
        </>
    );
}
