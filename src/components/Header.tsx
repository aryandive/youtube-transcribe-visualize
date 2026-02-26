import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { isGuest, authUser, setGuestMode, credits } = useWorkspaceStore();

  const handleSimulateLogin = () => {
    // Development helper function to toggle states
    setGuestMode(false, {
      id: "u_1",
      name: "Alex Developer",
      email: "alex@example.com",
      avatarUrl: "https://github.com/shadcn.png"
    });
  };

  const handleSimulateLogout = () => {
    setGuestMode(true, null);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center flex-1 px-4 md:px-8">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-6 transition-transform active:scale-95">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 12.5a6.3 6.3 0 0 1 8.12-5.94l8.6-4.3a2 2 0 0 1 2.78 2.78l-4.3 8.6a6.3 6.3 0 1 1-15.2-1.14Z" /><path d="m11.5 12.5 3-3" /></svg>
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:inline-block">
            Visualizer AI
          </span>
        </Link>

        {/* Right Nav */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-sm font-medium hidden md:inline-flex">
              <Link to="/pricing">Pricing</Link>
            </Button>

            <div className="h-6 w-px bg-border mx-2 hidden md:block"></div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full border shadow-sm text-sm font-medium mr-2">
              <span className="text-primary mr-1">⚡</span>
              {credits} {credits === 1 ? 'Credit' : 'Credits'}
            </div>

            {isGuest ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" className="text-sm font-medium" onClick={handleSimulateLogin}>
                  Sign In
                </Button>
                <Button className="text-sm shadow-sm transition-transform active:scale-95" onClick={handleSimulateLogin}>
                  Get Started
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-transform hover:scale-105">
                    <Avatar className="h-9 w-9 border shadow-sm">
                      <AvatarImage src={authUser?.avatarUrl} alt={authUser?.name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {authUser?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{authUser?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {authUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                    Settings (Premium coming soon)
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                    Billing (Premium coming soon)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSimulateLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
