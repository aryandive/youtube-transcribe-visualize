import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Loader2, Zap } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

export function SummaryTab() {
    const { summary, isProcessingSummary, generateSummary, credits, isGuest } = useWorkspaceStore();
    const [format, setFormat] = useState('Executive Summary');

    if (isProcessingSummary) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
                <h2 className="text-xl font-bold mb-2">Generating Insight...</h2>
                <p className="text-muted-foreground animate-pulse text-sm">Passing transcript to AI model</p>
            </div>
        );
    }

    // EMPTY STATE / ON-DEMAND WALL
    if (!summary) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-8 min-h-[400px]">
                <div className="max-w-md w-full text-center space-y-6 bg-card border shadow-sm p-8 rounded-2xl">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <Zap className="w-8 h-8" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">Generate AI Summary</h2>
                        <p className="text-muted-foreground text-sm">
                            Transform the source transcript into actionable insights instantly.
                        </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select output format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Executive Summary">Executive Summary</SelectItem>
                                <SelectItem value="Study Notes">Study Notes</SelectItem>
                                <SelectItem value="Action Items & Tasks">Action Items & Tasks</SelectItem>
                                <SelectItem value="Blog Post Draft">Blog Post Draft</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            onClick={() => generateSummary(format)}
                            className="w-full h-12 text-md shadow-md transition-all active:scale-95"
                            disabled={isGuest && credits < 1}
                        >
                            Generate Analysis (1 Credit)
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

    // GENERATED STATE
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Context */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">AI Intelligence</h2>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Generated Format: {format}</p>
                </div>

                <Button variant="outline" size="sm" onClick={() => generateSummary(format)} className="hidden sm:flex" disabled={credits < 1}>
                    <Zap className="w-4 h-4 mr-2" /> Regenerate (1 Credit)
                </Button>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none text-base md:text-lg leading-relaxed font-medium">
                {summary}
            </div>

        </div>
    );
}
