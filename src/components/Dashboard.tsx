import { ExtractResponse, AnalyzeResponse } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import VideoContext from "./VideoContext";
import TranscriptViewer from "./TranscriptViewer";
import SummaryViewer from "./SummaryViewer";
import MermaidDiagram from "./MermaidDiagram";
import { FileText, ListChecks, GitBranch, Network } from "lucide-react";

interface DashboardProps {
  extractData: ExtractResponse;
  analyzeData: AnalyzeResponse | null;
  isAnalyzing: boolean;
}

const Dashboard = ({ extractData, analyzeData, isAnalyzing }: DashboardProps) => {
  return (
    <div className="container py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* Sidebar — Video Info */}
      <aside className="space-y-4">
        <VideoContext video={extractData.video} />
      </aside>

      {/* Main Content — Tabbed Workspace */}
      <main>
        <Tabs defaultValue="transcript" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="transcript" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Transcript
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-1.5">
              <ListChecks className="h-3.5 w-3.5" /> Summary
            </TabsTrigger>
            <TabsTrigger value="mindmap" className="gap-1.5">
              <Network className="h-3.5 w-3.5" /> Mind Map
            </TabsTrigger>
            <TabsTrigger value="flowchart" className="gap-1.5">
              <GitBranch className="h-3.5 w-3.5" /> Flow Chart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transcript">
            <TranscriptViewer transcript={extractData.transcript} />
          </TabsContent>

          <TabsContent value="summary">
            {isAnalyzing ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : analyzeData ? (
              <SummaryViewer summaries={analyzeData.summaries} />
            ) : null}
          </TabsContent>

          <TabsContent value="mindmap">
            {isAnalyzing ? (
              <Skeleton className="h-[400px] w-full rounded-lg" />
            ) : analyzeData ? (
              <MermaidDiagram chart={analyzeData.mindMap} />
            ) : null}
          </TabsContent>

          <TabsContent value="flowchart">
            {isAnalyzing ? (
              <Skeleton className="h-[400px] w-full rounded-lg" />
            ) : analyzeData ? (
              <MermaidDiagram chart={analyzeData.flowChart} />
            ) : null}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
