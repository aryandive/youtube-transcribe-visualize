import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ConversionModal } from '@/components/ConversionModal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DownloadCloud, FileText, FileCode } from 'lucide-react';

export function TranscriptTab() {
    const { transcript, videoData, isGuest } = useWorkspaceStore();
    const [showModal, setShowModal] = useState(false);
    const [showTimestamps, setShowTimestamps] = useState(true);

    if (!transcript || transcript.length === 0) return null;

    const isGuestLimited = isGuest && videoData && videoData.durationInSeconds > 600;

    // If guest limited, we mock showing only 40% of the transcript
    const visibleItems = isGuestLimited ? transcript.slice(0, Math.floor(transcript.length * 0.4)) : transcript;

    const handleExportTxt = () => {
        alert("Exported as .txt (Free Action)");
    };

    const handleExportMd = () => {
        alert("Exported as .md (Free Action)");
    };

    const handleExportPdf = () => {
        if (isGuest) {
            setShowModal(true);
        } else {
            alert("Exported as .pdf (Premium Action)");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 md:px-8 relative h-full flex flex-col">

            {/* Controls Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-background/50 p-4 border rounded-xl backdrop-blur-sm relative z-20">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="timestamps"
                        checked={showTimestamps}
                        onCheckedChange={setShowTimestamps}
                    />
                    <Label htmlFor="timestamps" className="cursor-pointer font-medium">Show Timestamps</Label>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportTxt} className="h-9">
                        <FileText className="w-4 h-4 mr-2" /> TXT
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportMd} className="h-9">
                        <FileCode className="w-4 h-4 mr-2" /> MD
                    </Button>
                    <Button
                        variant={isGuest ? "secondary" : "default"}
                        size="sm"
                        onClick={handleExportPdf}
                        className={`h-9 ${isGuest ? 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-700' : ''}`}
                    >
                        <DownloadCloud className="w-4 h-4 mr-2" /> PDF {isGuest && "(Pro)"}
                    </Button>
                </div>
            </div>

            <div className="space-y-6 pb-32 flex-1 relative z-10">
                {visibleItems.map((item) => (
                    <div key={item.id} className="flex gap-4 group hover:bg-muted/30 p-2 rounded-lg transition-colors">
                        {showTimestamps && (
                            <div className="w-16 shrink-0 text-xs font-mono text-muted-foreground pt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                {item.timestamp}
                            </div>
                        )}
                        <p className="text-base leading-relaxed text-foreground/90 font-medium">
                            {item.text}
                        </p>
                    </div>
                ))}

                {isGuestLimited && (
                    <div className="relative h-72 -mt-36">
                        {/* The Gradient Blur Wall */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />

                        <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center gap-5 z-20">
                            <div className="bg-muted/80 backdrop-blur-md text-foreground px-5 py-2 rounded-full text-sm font-semibold border shadow-sm">
                                You've reached the 10-minute preview limit
                            </div>
                            <Button
                                size="lg"
                                className="shadow-xl shadow-primary/20 transition-transform active:scale-95 text-md px-8 h-12"
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
                triggerType="utility"
            />
        </div>
    );
}
