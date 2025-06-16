
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell,
  Calendar,
  AlertCircle,
  User,
  Target,
  Clock,
  Activity,
  Shield
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

interface QuizData {
  experiencia: string;
  frequencia: string;
  objetivo: string;
  limitacoes: string[];
  preferencias: string[];
  tempo_disponivel: string;
}

const DashboardTreino = () => {
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWorkoutData();
    }
  }, [user]);

  const loadWorkoutData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_quiz_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('quiz_type', 'treino')
        .single();
        
      if (data) {
        console.log('Dashboard Treino: Dados carregados:', data);
        setWorkoutData(data);
      }
      
      if (error && error.code !== 'PGRST116') {
        console.error('Dashboard Treino: Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do treino');
      }
    } catch (err) {
      console.error('Dashboard Treino: Erro inesperado:', err);
      setError('Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const getExperienciaTexto = (experiencia: string) => {
    const textos = {
      'iniciante': 'Iniciante (nunca treinei)',
      'basico': 'Básico (menos de 6 meses)',
      'intermediario': 'Intermediário (6 meses - 2 anos)',
      'avancado': 'Avançado (mais de 2 anos)'
    };
    return textos[experiencia as keyof typeof textos] || experiencia;
  };

  const getFrequenciaTexto = (frequencia: string) => {
    const textos = {
      '2_vezes': '2 vezes por semana',
      '3_vezes': '3 vezes por semana',
      '4_vezes': '4 vezes por semana',
      '5_mais': '5 ou mais vezes'
    };
    return textos[frequencia as keyof typeof textos] || frequencia;
  };

  const getObjetivoTexto = (objetivo: string) => {
    const textos = {
      'ganhar_massa': 'Ganhar massa muscular',
      'definir': 'Definição muscular',
      'forca': 'Ganhar força',
      'hipertrofia': 'Hipertrofia'
    };
    return textos[objetivo as keyof typeof textos] || objetivo;
  };

  const getTempoTexto = (tempo: string) => {
    const textos = {
      '30_min': '30 minutos',
      '45_min': '45 minutos',
      '60_min': '1 hora',
      '90_min': '1h30 ou mais'
    };
    return textos[tempo as keyof typeof textos] || tempo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto"
          >
            <Dumbbell className="text-white" size={32} />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-800">Carregando seus treinos...</h2>
          <p className="text-gray-600">Preparando seu plano personalizado! 💪</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="text-red-500 mx-auto" size={48} />
          <h2 className="text-xl font-bold text-gray-800">Ops! Algo deu errado</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      
      {/* Header com navegação */}
      <Header 
        showBack={true} 
        onBack={() => navigate('/dashboard')}
        title="Treinos"
      />

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {workoutData && workoutData.quiz_data ? (
          <>
            {/* Perfil de Treino */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center space-x-3 mb-6">
                <User className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Seu Perfil de Treino</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="text-blue-600" size={18} />
                    <span className="font-semibold text-gray-700">Experiência</span>
                  </div>
                  <p className="text-gray-600">{getExperienciaTexto(workoutData.quiz_data.experiencia)}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="text-green-600" size={18} />
                    <span className="font-semibold text-gray-700">Frequência</span>
                  </div>
                  <p className="text-gray-600">{getFrequenciaTexto(workoutData.quiz_data.frequencia)}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="text-purple-600" size={18} />
                    <span className="font-semibold text-gray-700">Objetivo</span>
                  </div>
                  <p className="text-gray-600">{getObjetivoTexto(workoutData.quiz_data.objetivo)}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="text-orange-600" size={18} />
                    <span className="font-semibold text-gray-700">Tempo por Treino</span>
                  </div>
                  <p className="text-gray-600">{getTempoTexto(workoutData.quiz_data.tempo_disponivel)}</p>
                </div>
              </div>

              {/* Limitações */}
              {workoutData.quiz_data.limitacoes && workoutData.quiz_data.limitacoes.length > 0 && (
                <div className="mt-4 bg-red-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="text-red-600" size={18} />
                    <span className="font-semibold text-gray-700">Limitações</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {workoutData.quiz_data.limitacoes.map((limitacao: string, index: number) => (
                      <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm">
                        {limitacao}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferências */}
              {workoutData.quiz_data.preferencias && workoutData.quiz_data.preferencias.length > 0 && (
                <div className="mt-4 bg-indigo-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Dumbbell className="text-indigo-600" size={18} />
                    <span className="font-semibold text-gray-700">Preferências de Treino</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {workoutData.quiz_data.preferencias.map((preferencia: string, index: number) => (
                      <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm">
                        {preferencia}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Cronograma Semanal */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Cronograma Semanal</h3>
              </div>
              
              <div className="text-center py-8">
                <Dumbbell className="text-blue-400 mx-auto mb-4" size={48} />
                <h4 className="text-lg font-bold text-gray-600 mb-2">Plano Personalizado em Preparação</h4>
                <p className="text-gray-500 mb-4">
                  Com base no seu perfil, o Basa está criando seu plano de treino ideal!
                </p>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl max-w-md mx-auto">
                  <p className="text-sm text-gray-600">
                    💪 Treino personalizado para {getObjetivoTexto(workoutData.quiz_data.objetivo).toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Quiz concluído • Dados enviados com sucesso
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Complete seu Quiz de Treino</h3>
              <p className="text-gray-500 text-lg mb-4">
                Para ver seu plano personalizado aqui, complete primeiro o quiz de musculação!
              </p>
              <button
                onClick={() => navigate('/quiz-treino/1')}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Fazer Quiz de Treino
              </button>
            </div>
          </div>
        )}

        {/* Footer informativo */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            💪 Seus treinos são personalizados baseados no seu perfil e objetivos pelo Basa
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardTreino;
