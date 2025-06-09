
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Onboarding from "./pages/Onboarding";
import DadosPessoais from "./pages/DadosPessoais";
import Loading from "./pages/Loading";
import LoadingTreino from "./pages/LoadingTreino";
import QuizAlimentar from "./pages/QuizAlimentar";
import QuizTreino from "./pages/QuizTreino";
import Dashboard from "./pages/Dashboard";
import Avaliacao from "./pages/Avaliacao";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dados-pessoais" element={<DadosPessoais />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/loading-treino" element={<LoadingTreino />} />
            <Route path="/quiz-alimentar/:etapa" element={<QuizAlimentar />} />
            <Route path="/quiz-treino/:pergunta" element={<QuizTreino />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/avaliacao" element={<Avaliacao />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
