import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function HeroSearchInput() {
    const [url, setUrl] = useState('');
    const navigate = useNavigate();
    const { setVideoUrl, isProcessing, processingStage } = useWorkspaceStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || isProcessing) return;

        // Trigger state change immediately to show loading on this page or dashboard
        setVideoUrl(url);
        navigate('/dashboard');
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-center text-foreground">
                Paste a YouTube Link. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Get instant insights.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
                Extract exact transcripts, AI executive summaries, and interactive Mermaid diagrams—no signup required to start.
            </p>

            <form onSubmit={handleSubmit} className="w-full relative shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500">
                <div className="relative flex items-center bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl p-2 pl-4">
                    <Search className="w-6 h-6 text-muted-foreground shrink-0" />
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg md:text-xl py-6 px-4"
                        disabled={isProcessing}
                    />
                    <Button
                        type="submit"
                        size="lg"
                        className="h-14 px-8 rounded-xl text-lg font-medium transition-transform active:scale-95 bg-primary hover:bg-primary/90 disabled:opacity-80"
                        disabled={!url.trim() || isProcessing}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            "Generate Insights"
                        )}
                    </Button>
                </div>
            </form>

            {/* Loading micro-copy (Labor Illusion) */}
            <div className={\`mt-6 text-sm font-medium transition-all duration-500 \${isProcessing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}\`}>
            <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="animate-pulse">{processingStage || 'Initializing...'}</span>
            </div>
        </div>
    </div >
  );
}
