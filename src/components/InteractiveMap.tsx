import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MermaidRenderer } from "./diagrams/MermaidRenderer";
import { Maximize, ZoomIn, ZoomOut } from "lucide-react";

interface InteractiveMapProps {
    chartOptions: string;
}

export function InteractiveMap({ chartOptions }: InteractiveMapProps) {
    return (
        <div className="w-full h-full relative group bg-dot-pattern rounded-2xl border overflow-hidden">
            <TransformWrapper
                initialScale={1}
                minScale={0.2}
                maxScale={4}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        {/* Floating Controls Overlay */}
                        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 bg-background/80 backdrop-blur-md p-2 rounded-xl border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => zoomIn()}
                                className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
                                aria-label="Zoom In"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => zoomOut()}
                                className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
                                aria-label="Zoom Out"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <div className="w-full h-px bg-border my-1" />
                            <button
                                onClick={() => resetTransform()}
                                className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
                                aria-label="Reset Zoom"
                            >
                                <Maximize className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Diagram Canvas */}
                        <TransformComponent
                            wrapperClass="w-full h-full cursor-grab active:cursor-grabbing"
                            contentClass="w-full h-full flex items-center justify-center p-8 md:p-16"
                        >
                            <MermaidRenderer chartOptions={chartOptions} />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}
