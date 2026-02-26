import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConversionModal } from '@/features/auth/ConversionModal';

export function TranscriptTab() {
    const { transcript, videoData } = useWorkspaceStore();
    const [showModal, setShowModal] = useState(false);

    if (!transcript || transcript.length === 0) return null;

    const isGuestLimited = videoData ? videoData.durationInSeconds > 600 : false;

    // Assuming each transcript item corresponds roughly to 1 minute to mock the fade out point
    // For a real app, this would be based on the actual timestamp
    const visibleItems = isGuestLimited ? transcript.slice(0, Math.floor(transcript.length * 0.4)) : transcript;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 md:px-8 relative">
            <div className="space-y-6 pb-32">
                {visibleItems.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                        <div className="w-16 shrink-0 text-xs font-mono text-muted-foreground pt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                            {item.timestamp}
                        </div>
                        <p className="text-base leading-relaxed text-foreground/90">
                            {item.text}
                        </p>
                    </div>
                ))}

                {isGuestLimited && (
                    <div className="relative h-64 -mt-32">
                        {/* The Gradient Blur Wall */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

                        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center gap-4 z-10">
                            <div className="bg-muted text-muted-foreground px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm">
                                You've reached the 10-minute preview limit
                            </div>
                            <Button
                                size="lg"
                                className="shadow-lg shadow-blue-500/20"
                                onClick={() => setShowModal(true)}
                            >
                                Unlock the Full Transcript
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ConversionModal
                open={showModal}
                onOpenChange={setShowModal}
                triggerType="compute"
            />
        </div>
    );
}
