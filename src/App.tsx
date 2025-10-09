import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PredictionProvider } from "@/contexts/PredictionContext";
import Landing from "./pages/Landing";
import Predict from "./pages/Predict";
import Heatmap from "./pages/Heatmap";
import Chatbot from "./pages/Chatbot";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PredictionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/heatmap" element={<Heatmap />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PredictionProvider>
  </QueryClientProvider>
);

export default App;
