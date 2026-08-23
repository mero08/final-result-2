import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Maximize2, Minimize2 } from "lucide-react";
import { useCinematicFullscreen } from "@/hooks/useCinematicFullscreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { toggleFullscreen, isFullscreen } = useCinematicFullscreen();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="fixed bottom-6 left-6 z-50 hidden items-center justify-center rounded-full p-2.5 glass-card transition-all duration-300 hover:border-primary/40 group lg:flex"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              data-cursor-hover
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
              ) : (
                <Maximize2 className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
              )}
            </button>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
