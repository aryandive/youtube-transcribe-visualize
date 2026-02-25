import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
});

let idCounter = 0;

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const render = async () => {
      try {
        const id = `mermaid-${++idCounter}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setSvg(`<p class="text-destructive text-sm">Failed to render diagram</p>`);
      }
    };
    render();
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center overflow-auto bg-card rounded-lg border border-border p-4 min-h-[400px]"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram;
