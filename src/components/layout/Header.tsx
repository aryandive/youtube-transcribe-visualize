import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

export function Header() {
    const { isGuestMode } = useAppStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center flex-1">
                <Link to="/" className="flex items-center space-x-2 mr-6">
                    <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Visualizer AI
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center gap-2">
                        <Button variant="ghost" asChild className="hidden text-sm md:flex">
                            <Link to="/pricing">Pricing</Link>
                        </Button>

                        {isGuestMode ? (
                            <div className="flex gap-2 ml-4 border-l pl-4 border-border/50">
                                <Button variant="ghost" className="text-sm">Log in</Button>
                                <Button className="text-sm shadow-sm hover:shadow-md transition-shadow">Sign up</Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-4 border-l pl-4 border-border/50">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    US
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
