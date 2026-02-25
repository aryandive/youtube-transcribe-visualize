import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const Hero = ({ onSubmit, isLoading }: HeroProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="flex items-center gap-2 mb-6 text-primary">
        <Sparkles className="h-8 w-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center mb-4 max-w-2xl">
        Unlock Any YouTube Video's <span className="text-primary">Full Potential</span>
      </h1>
      <p className="text-muted-foreground text-lg text-center mb-10 max-w-lg">
        Extract transcripts, generate summaries, and visualize ideas — instantly. No account required.
      </p>
      <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-3">
        <Input
          placeholder="Paste a YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-12 text-base"
          disabled={isLoading}
        />
        <Button type="submit" size="lg" disabled={isLoading || !url.trim()} className="h-12 px-6 gap-2">
          {isLoading ? "Generating…" : "Generate"}
          {!isLoading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};

export default Hero;
