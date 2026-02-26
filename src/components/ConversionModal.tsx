import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Github, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface ConversionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    triggerType: 'compute' | 'utility' | 'depth';
}

export function ConversionModal({ open, onOpenChange, triggerType }: ConversionModalProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const content = {
        compute: {
            title: "Unlock Full Analysis",
            description: "You've reached the 10-minute playback limit for guests. Create a free account to unlock the remaining transcript and generate insights for up to 4-hour long videos."
        },
        utility: {
            title: "Save Your Insights",
            description: "Don't lose your work! Sign in to permanently save this dashboard, export to Notion, or download as PDF."
        },
        depth: {
            title: "Interactive Diagrams Locked",
            description: "Zooming, panning, and exporting Mermaid.js diagrams are premium features. Create a free account to unlock full interactivity."
        }
    }[triggerType];

    const handleOAuth = async (provider: 'google' | 'github') => {
        setIsLoading(provider);
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin + '/dashboard'
            }
        });
        // The redirect handles the actual transition, UI just spins until then
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md backdrop-blur-xl bg-background/95 border-border shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                        {content.title}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-2 text-muted-foreground">
                        {content.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-6">
                    <Button
                        variant="outline"
                        className="w-full h-12 text-md flex items-center justify-center gap-3 transition-colors hover:bg-muted"
                        onClick={() => handleOAuth('google')}
                        disabled={isLoading !== null}
                    >
                        {isLoading === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" focusable="false">
                                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"></path>
                                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"></path>
                                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"></path>
                                <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"></path>
                            </svg>
                        )}
                        Continue with Google
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full h-12 text-md flex items-center justify-center gap-3 transition-colors hover:bg-muted"
                        onClick={() => handleOAuth('github')}
                        disabled={isLoading !== null}
                    >
                        {isLoading === 'github' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
                        Continue with GitHub
                    </Button>
                </div>

                <div className="relative mt-4 mb-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                </div>

                <Button
                    variant="secondary"
                    className="w-full h-12 text-md flex items-center justify-center gap-3 transition-colors"
                    onClick={() => {
                        alert("Email Auth not linked in this sandbox, please use Google/Github.");
                    }}
                    disabled={isLoading !== null}
                >
                    <Mail className="w-5 h-5" />
                    Continue with Email
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-4">
                    By clicking continue, you agree to our Terms of Service and Privacy Policy.
                </p>
            </DialogContent>
        </Dialog>
    );
}
