import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Loader2 } from 'lucide-react';

interface MermaidRendererProps {
    chartOptions: string;
}

mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'inherit',
});

export function MermaidRenderer({ chartOptions }: MermaidRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgContent, setSvgContent] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const renderChart = async () => {
            try {
                if (!containerRef.current) return;
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(id, chartOptions);
                if (isMounted) {
                    setSvgContent(svg);
                }
            } catch (error) {
                console.error("Mermaid parsing error:", error);
            }
        };

        renderChart();

        return () => {
            isMounted = false;
        };
    }, [chartOptions]);

    if (!svgContent) {
        return (
            <div
                ref={containerRef}
                className="w-full h-full flex items-center justify-center p-12 text-muted-foreground"
            >
                <Loader2 className="w-6 h-6 animate-spin mr-3" /> Rendering Diagram...
            </div>
        );
    }

    return (
        <div
            className="w-full h-full flex items-center justify-center overflow-hidden [&>svg]:max-w-full [&>svg]:max-h-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
}
