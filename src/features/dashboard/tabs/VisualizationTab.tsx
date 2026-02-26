import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { InteractiveMap } from '@/components/InteractiveMap';
import { Maximize2, Lock, Loader2, Workflow } from 'lucide-react';
import { useState } from 'react';
import { ConversionModal } from '@/components/ConversionModal';
import { MermaidRenderer } from '@/components/diagrams/MermaidRenderer';
import { Button } from '@/components/ui/button';

interface VisualizationTabProps {
    type: 'mindmap' | 'flowchart';
}

export function VisualizationTab({ type }: VisualizationTabProps) {
    const {
        mindMapSyntax,
        flowChartSyntax,
        isGuest,
        isProcessingVisual,
        generateMindMap,
        generateFlowChart,
        credits
    } = useWorkspaceStore();

    const [showModal, setShowModal] = useState(false);

    const syntax = type === 'mindmap' ? mindMapSyntax : flowChartSyntax;
    const generateFunc = type === 'mindmap' ? generateMindMap : generateFlowChart;
    const title = type === 'mindmap' ? 'Mind Map' : 'Flow Chart';

    // LOADING STATE
    if (isProcessingVisual) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
                <h2 className="text-xl font-bold mb-2">Generating Diagram...</h2>
                <p className="text-muted-foreground animate-pulse text-sm">Rendering spatial nodes</p>
            </div>
        );
    }

    // EMPTY STATE / ON-DEMAND WALL
    if (!syntax) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
                <div className="max-w-md w-full text-center space-y-6 bg-card border shadow-sm p-8 rounded-2xl">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <Workflow className="w-8 h-8" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">Generate {title}</h2>
                        <p className="text-muted-foreground text-sm">
                            Translate the video transcript into an interactive, visual representation of key concepts.
                        </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <Button
                            onClick={generateFunc}
                            className="w-full h-12 text-md shadow-md transition-all active:scale-95"
                            disabled={isGuest && credits < 1}
                        >
                            Generate {title} (1 Credit)
                        </Button>

                        {isGuest && credits < 1 && (
                            <p className="text-xs text-orange-500 font-medium tracking-tight">
                                Insufficient credits. Please sign in to reload.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // PREMIUM USER VIEW
    if (!isGuest) {
        return (
            <div className="w-full h-[600px] md:h-[700px] p-2 relative animate-in fade-in zoom-in-95 duration-500">
                <InteractiveMap chartOptions={syntax} />
            </div>
        );
    }

    // GUEST VIEW (Depth Wall Tease)
    return (
        <div className="w-full h-full p-4 relative flex flex-col items-center justify-center min-h-[500px]">

            {/* The Diagram Preview (Scaled Down & Static) */}
            <div className="w-full max-w-5xl h-[500px] bg-card rounded-2xl border shadow-sm p-4 flex items-center justify-center overflow-hidden relative">
                {/* We render it statically without the zoom/pan wrapper for guests */}
                <div className="w-full h-full transform scale-[0.6] md:scale-90 origin-center transition-transform duration-700 pointer-events-none opacity-40 blur-[2px]">
                    <MermaidRenderer chartOptions={syntax} />
                </div>
            </div>

            {/* The Depth Wall Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/5 backdrop-blur-[2px]">
                <button
                    onClick={() => setShowModal(true)}
                    className="group relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-primary/95 text-primary-foreground rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ring-8 ring-primary/20 hover:ring-primary/40"
                >
                    <Maximize2 className="w-8 h-8 md:w-10 md:h-10 ml-1" />

                    <div className="absolute -top-3 -right-3 bg-orange-500 text-white rounded-full p-1.5 shadow-lg border-2 border-background">
                        <Lock className="w-4 h-4" />
                    </div>
                </button>

                <div className="mt-6 text-center bg-background/80 backdrop-blur-md py-4 px-8 rounded-2xl border shadow-2xl max-w-sm">
                    <h3 className="font-bold text-lg md:text-xl">Interactive Diagram</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">
                        Tap to pan, zoom, and export the generated SVG. Requires a free account.
                    </p>
                </div>
            </div>

            <ConversionModal
                open={showModal}
                onOpenChange={setShowModal}
                triggerType="depth"
            />
        </div>
    );
}
