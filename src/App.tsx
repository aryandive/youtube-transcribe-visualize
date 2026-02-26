import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import { RootLayout } from "./components/layout/RootLayout";
import { useEffect } from "react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

const App = () => {
  useEffect(() => {
    useWorkspaceStore.getState().initializeAuthListener();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Dashboard might want a different clean layout, but per instructions we wrap the app or specific routes. 
              Let's keep dashboard outside RootLayout if it has its own sidebar, or inside if it needs the global header.
              The prompt implies a global header ("where the future profile dropdown will live") is in the basic layout wrapper. */}
            <Route element={<RootLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
