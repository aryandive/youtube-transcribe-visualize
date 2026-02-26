import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Progress } from '@/components/ui/progress';
import { Lock, Clock, FileText, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ConversionModal } from '@/components/ConversionModal';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { videoData, isGuest } = useWorkspaceStore();
    const [showConversionModal, setShowConversionModal] = useState(false);

    // If the user visits dashboard directly without data
    if (!videoData) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold mb-3">No Video Selected</h2>
                        <p className="text-muted-foreground mb-6">You need to paste a YouTube URL to generate insights.</p>
                        <Button asChild>
                            <Link to="/">Go back home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const isGuestLimited = isGuest && videoData.durationInSeconds > 600; // >10 mins
    const processedPercentage = isGuestLimited
        ? (600 / videoData.durationInSeconds) * 100
        : 100;

    return (
        <div className="min-h-screen bg-background flex flex-col overflow-hidden">
            <Header />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative h-[calc(100vh_-_64px)]">

                {/* Desktop Sidebar (Video Context) */}
                <aside className="hidden md:flex flex-col w-[320px] lg:w-[380px] shrink-0 border-r bg-muted/20 relative z-10">
                    <div className="px-6 py-4 flex justify-between items-center border-b">
                        <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground hover:text-foreground">
                            <Link to="/">
                                <ChevronLeft className="w-4 h-4 mr-1" /> New Link
                            </Link>
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6">

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

                        {/* Compute Meter */}
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
                                    className="w-full mt-2 text-xs bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                                    onClick={() => setShowConversionModal(true)}
                                >
                                    Unlock Full Video
                                </Button>
                            )}
                        </div>

                        {/* Output Stats */}
                        <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card/50">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" /> Output Stats
                            </h4>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Words Extracted</span>
                                <span className="font-medium">~{Math.min(10, Math.round(videoData.durationInSeconds / 60)) * 150}</span>
                            </div>
                        </div>

                        {isGuest && (
                            <div className="mt-8 pt-4 border-t">
                                <Button
                                    className="w-full font-medium shadow-sm transition-transform active:scale-95"
                                    onClick={() => setShowConversionModal(true)}
                                >
                                    Create Free Account
                                </Button>
                                <p className="text-[11px] text-center text-muted-foreground mt-3 px-2 leading-relaxed">
                                    Sign up to save visualizations, export to PDF/Notion, and unlock full videos.
                                </p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Workspace Area */}
                <main className="flex-1 flex flex-col h-full min-w-0 bg-dot-pattern">
                    {children}
                </main>
            </div>

            <ConversionModal
                open={showConversionModal}
                onOpenChange={setShowConversionModal}
                triggerType="compute"
            />
        </div>
    );
}
