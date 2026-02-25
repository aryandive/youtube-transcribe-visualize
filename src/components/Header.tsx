import { Link, useLocation } from "react-router-dom";
import { User, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>TranscriptAI</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Button variant={location.pathname === "/" ? "secondary" : "ghost"} size="sm" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant={location.pathname === "/pricing" ? "secondary" : "ghost"} size="sm" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled className="text-muted-foreground">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Premium Features Coming Soon
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
