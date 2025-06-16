
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import DashboardDieta from "./pages/DashboardDieta";
import DashboardTreino from "./pages/DashboardTreino";
import Avaliacao from "./pages/Avaliacao";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dados-pessoais" element={<DadosPessoais />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/loading-treino" element={<LoadingTreino />} />
            <Route path="/quiz-alimentar" element={<QuizAlimentar />} />
            <Route path="/quiz-alimentar/:etapa" element={<QuizAlimentar />} />
            <Route path="/quiz-treino" element={<Navigate to="/quiz-treino/1" replace />} />
            <Route path="/quiz-treino/:pergunta" element={<QuizTreino />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/dieta" element={<DashboardDieta />} />
            <Route path="/dashboard/treino" element={<DashboardTreino />} />
            <Route path="/avaliacao" element={<Avaliacao />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
