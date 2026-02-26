import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TranscriptTab } from '@/components/TranscriptTab';
import { SummaryTab } from '@/features/dashboard/tabs/SummaryTab'; // Using previously built tab for summary 
import { VisualizationTab } from '@/features/dashboard/tabs/VisualizationTab'; // We'll wrap this with InteractiveMap next
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Loader2, Lock } from 'lucide-react';

export function DashboardContent() {
    const { isProcessingTranscript, isGuest } = useWorkspaceStore();

    const renderTabsList = () => (
        <div className="px-4 md:px-8 pt-4 md:pt-6 pb-0 border-b relative z-10 bg-background/50 backdrop-blur-md">
            <TabsList className="w-full justify-start h-12 bg-transparent overflow-x-auto rounded-none border-b-0 space-x-2 scrollbar-hide">
                <TabsTrigger
                    value="transcript"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all"
                >
                    Transcript
                </TabsTrigger>
                <TabsTrigger
                    value="summary"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary transition-all"
                >
                    Executive Summary
                </TabsTrigger>
                <TabsTrigger
                    value="mindmap"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary gap-2 transition-all"
                >
                    Mind Map {isGuest && <Lock className="w-3 h-3 text-muted-foreground" />}
                </TabsTrigger>
                <TabsTrigger
                    value="flowchart"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary gap-2 transition-all"
                >
                    Flow Chart {isGuest && <Lock className="w-3 h-3 text-muted-foreground" />}
                </TabsTrigger>
            </TabsList>
        </div>
    );

    return (
        <Tabs defaultValue="summary" className="w-full h-full flex flex-col">
            {renderTabsList()}

            {isProcessingTranscript ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background/50 backdrop-blur-sm">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">Analyzing Video Matrix</h2>
                    <p className="text-muted-foreground font-medium animate-pulse">Extracting audio stream...</p>
                </div>
            ) : (
                <div className="flex-1 relative overflow-y-auto w-full h-full p-0">
                    <TabsContent value="transcript" className="h-full m-0 data-[state=inactive]:hidden focus-visible:outline-none">
                        <TranscriptTab />
                    </TabsContent>

                    <TabsContent value="summary" className="h-full m-0 p-4 md:p-8 data-[state=inactive]:hidden focus-visible:outline-none">
                        <SummaryTab />
                    </TabsContent>

                    <TabsContent value="mindmap" className="h-full m-0 p-4 md:p-8 data-[state=inactive]:hidden focus-visible:outline-none">
                        {/* The wrapper that will use interactive map via the visualization tab refactoring */}
                        <VisualizationTab type="mindmap" />
                    </TabsContent>

                    <TabsContent value="flowchart" className="h-full m-0 p-4 md:p-8 data-[state=inactive]:hidden focus-visible:outline-none">
                        <VisualizationTab type="flowchart" />
                    </TabsContent>
                </div>
            )}
        </Tabs>
    );
}
