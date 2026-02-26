import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function HeroSearchInput() {
    const [url, setUrl] = useState('');
    const navigate = useNavigate();
    const { fetchVideoAndTranscript, isProcessingTranscript, credits } = useWorkspaceStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || isProcessingTranscript) return;

        if (credits < 1) {
            toast.error("Insufficient credits. Please sign in or upgrade.");
            return;
        }

        const promise = fetchVideoAndTranscript(url);
        // Navigate instantly so the user sees the dashboard loading state (The Labor Illusion)
        navigate('/dashboard');

        await promise;
        const error = useWorkspaceStore.getState().transcriptError;
        if (error) {
            toast.error("Unable to fetch transcript. The video might not have captions, or YouTube is restricting access.");
            navigate('/');
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-center text-foreground leading-tight">
                Paste a YouTube Link. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Get instant insights.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-center max-w-2xl font-medium">
                Extract exact transcripts, AI executive summaries, and interactive Mermaid diagrams—no signup required to start.
            </p>

            <form onSubmit={handleSubmit} className="w-full relative shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 focus-within:ring-[3px] focus-within:ring-primary/30 bg-background">
                <div className="relative flex items-center border border-border/50 rounded-2xl p-2 pl-6">
                    <Search className="w-6 h-6 text-muted-foreground shrink-0" />
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg md:text-xl py-7 px-4 shadow-none"
                        disabled={isProcessingTranscript}
                        required
                        type="url"
                    />
                    <Button
                        type="submit"
                        size="lg"
                        className="h-14 px-8 rounded-xl text-lg font-semibold shadow-md transition-all active:scale-95 disabled:opacity-80 ml-2"
                        disabled={!url.trim() || isProcessingTranscript}
                    >
                        {isProcessingTranscript ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing
                            </span>
                        ) : (
                            "Generate Insights"
                        )}
                    </Button>
                </div>
            </form>

            {/* Loading micro-copy to demonstrate the action */}
            <div className={`mt-8 text-sm font-medium transition-all duration-500 ${isProcessingTranscript ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-3 bg-muted/50 py-2 px-4 rounded-full border shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="animate-pulse flex items-center gap-2">
                        <span className="text-muted-foreground">System:</span> Extracting YouTube audio stream...
                    </span>
                </div>
            </div>
        </div>
    );
}
