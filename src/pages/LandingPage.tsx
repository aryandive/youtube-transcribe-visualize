import { HeroSearchInput } from "@/components/HeroSearchInput";
import { Header } from "@/components/Header";

export function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background relative selection:bg-primary/20">
            <Header />

            {/* Background Aesthetics */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="bg-dot-pattern absolute inset-0 opacity-50" />
            </div>

            <main className="flex-1 relative z-10 w-full px-6 flex flex-col justify-center pb-24 pt-12">
                <div className="container mx-auto">
                    <HeroSearchInput />

                    {/* Trust markers / Value Prop Teasers */}
                    <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
                            Blazing Fast Processing
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                            AI Powered Synthesis
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                            Mermaid Native Code
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-6 border-t bg-background/50 backdrop-blur-sm relative z-10">
                <div className="container flex justify-center text-xs text-muted-foreground font-medium">
                    © 2026 YouTube Transcriber & Visualizer SaaS.
                </div>
            </footer>
        </div>
    );
}
