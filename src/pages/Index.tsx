import { HeroSearchInput } from "@/features/landing/HeroSearchInput";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />

      <main className="relative z-10 w-full px-6 py-24 flex flex-col items-center justify-center">
        <HeroSearchInput />
      </main>

      <footer className="absolute bottom-6 text-sm text-muted-foreground">
        © 2026 YouTube Transcriber & Visualizer AI.
      </footer>
    </div>
  );
}
