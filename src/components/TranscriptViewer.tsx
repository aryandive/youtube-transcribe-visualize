import { TranscriptEntry } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptViewerProps {
  transcript: TranscriptEntry[];
}

const TranscriptViewer = ({ transcript }: TranscriptViewerProps) => {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-3">
        {transcript.map((entry, i) => (
          <div key={i} className="flex gap-3 group">
            <span className="text-xs font-mono text-primary shrink-0 pt-0.5 w-10 text-right">
              {entry.timestamp}
            </span>
            <p className="text-sm text-foreground leading-relaxed">{entry.text}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TranscriptViewer;
