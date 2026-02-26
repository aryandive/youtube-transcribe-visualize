import { ReactNode } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { VideoSidebarContext } from './VideoSidebarContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile'; // Usually created by shadcn or easily mocked
import { ChevronLeft } from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
    activeTab: ReactNode; // A place to injected the Tabs component row if desired
}

export function DashboardLayout({ children, activeTab }: DashboardLayoutProps) {
    const { videoData } = useWorkspaceStore();
    const isMobile = window.innerWidth <= 768; // simple fallback if hook isn't robust

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Mobile Top Header */}
            <div className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b px-4 py-3 flex items-center gap-3 shadow-sm">
                <Button variant="ghost" size="icon" asChild className="shrink-0 -ml-2">
                    <Link to="/">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </Button>
                {videoData && (
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                        <img src={videoData.thumbnailUrl} className="w-8 h-8 rounded shrink-0 object-cover" />
                        <h1 className="text-sm font-semibold truncate">{videoData.title}</h1>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative h-[calc(100vh_-_57px)] md:h-screen">

                {/* Desktop Sidebar (25%) */}
                <aside className="hidden md:flex flex-col w-[320px] lg:w-[380px] shrink-0 border-r bg-muted/20 relative z-10 pt-6">
                    <div className="px-6 mb-6 flex justify-between items-center">
                        <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                            <Link to="/">
                                <ChevronLeft className="w-4 h-4 mr-1" /> New Link
                            </Link>
                        </Button>
                        <div className="font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Visualizer AI
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
                        <VideoSidebarContext videoData={videoData} />
                    </div>
                </aside>

                {/* Main Action Canvas (75%) */}
                <main className="flex-1 flex flex-col h-full bg-background min-w-0">

                    {/* Tab Row Container */}
                    <div className="px-4 md:px-8 pt-4 md:pt-6 pb-0 border-b relative z-10 bg-background/50 backdrop-blur-md">
                        {activeTab}
                    </div>

                    {/* Content Container */}
                    <div className="flex-1 overflow-y-auto relative bg-dot-pattern">
                        {children}
                    </div>

                </main>
            </div>
        </div>
    );
}
