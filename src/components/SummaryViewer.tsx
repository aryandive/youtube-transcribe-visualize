import { AnalyzeResponse } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface SummaryViewerProps {
  summaries: AnalyzeResponse["summaries"];
}

type SummaryFormat = "executive" | "bullets" | "actionItems";

const SummaryViewer = ({ summaries }: SummaryViewerProps) => {
  const [format, setFormat] = useState<SummaryFormat>("executive");

  return (
    <div className="space-y-4">
      <Select value={format} onValueChange={(v) => setFormat(v as SummaryFormat)}>
        <SelectTrigger className="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="executive">Executive Summary</SelectItem>
          <SelectItem value="bullets">Bullet Points</SelectItem>
          <SelectItem value="actionItems">Action Items</SelectItem>
        </SelectContent>
      </Select>

      <ScrollArea className="h-[440px] pr-4">
        {format === "executive" && (
          <p className="text-sm leading-relaxed text-foreground">{summaries.executive}</p>
        )}
        {format === "bullets" && (
          <ul className="space-y-2">
            {summaries.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary mt-1 shrink-0">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {format === "actionItems" && (
          <ol className="space-y-2">
            {summaries.actionItems.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary font-semibold shrink-0">{i + 1}.</span>
                <span>{a}</span>
              </li>
            ))}
          </ol>
        )}
      </ScrollArea>
    </div>
  );
};

export default SummaryViewer;
