import { DashboardLayout } from '@/features/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TranscriptTab } from '@/features/dashboard/tabs/TranscriptTab';
import { SummaryTab } from '@/features/dashboard/tabs/SummaryTab';
import { VisualizationTab } from '@/features/dashboard/tabs/VisualizationTab';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Loader2, Lock } from 'lucide-react';

export default function Dashboard() {
    const { isProcessing, processingStage } = useWorkspaceStore();

    const renderTabsList = (
        <TabsList className="w-full justify-start h-12 bg-transparent overflow-x-auto rounded-none border-b-0 space-x-2">
            <TabsTrigger
                value="transcript"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary"
            >
                Transcript
            </TabsTrigger>
            <TabsTrigger
                value="summary"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary"
            >
                Executive Summary
            </TabsTrigger>
            <TabsTrigger
                value="mindmap"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary gap-2"
            >
                Mind Map <Lock className="w-3 h-3 text-muted-foreground" />
            </TabsTrigger>
            <TabsTrigger
                value="flowchart"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary gap-2"
            >
                Flow Chart <Lock className="w-3 h-3 text-muted-foreground" />
            </TabsTrigger>
        </TabsList>
    );

    return (
        <Tabs defaultValue="summary" className="w-full h-full flex flex-col">
            <DashboardLayout activeTab={renderTabsList}>

                {isProcessing ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Analyzing Video</h2>
                        <p className="text-muted-foreground animate-pulse">{processingStage}</p>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <TabsContent value="transcript" className="h-full m-0 data-[state=inactive]:hidden">
                            <TranscriptTab />
                        </TabsContent>

                        <TabsContent value="summary" className="h-full m-0 data-[state=inactive]:hidden">
                            <SummaryTab />
                        </TabsContent>

                        <TabsContent value="mindmap" className="h-full m-0 data-[state=inactive]:hidden">
                            <VisualizationTab type="mindmap" />
                        </TabsContent>

                        <TabsContent value="flowchart" className="h-full m-0 data-[state=inactive]:hidden">
                            <VisualizationTab type="flowchart" />
                        </TabsContent>
                    </div>
                )}
            </DashboardLayout>
        </Tabs>
    );
}
