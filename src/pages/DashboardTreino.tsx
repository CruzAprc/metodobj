
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Dumbbell,
  Clock,
  Target,
  Activity,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  User
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DashboardTreino = () => {
  const [userData, setUserData] = useState<any>(null);
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserData();
      loadWorkoutData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('teste_app')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (data) {
      setUserData(data);
    }
  };

  const loadWorkoutData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('teste_treino')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (data) {
      setWorkoutData(data);
    }
  };

  const simulateNewWorkoutData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastUpdate(new Date());
    } catch (err) {
      setError("Erro ao carregar dados do treino");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto"
          >
            <Dumbbell className="text-white" size={32} />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-800">Preparando seus treinos...</h2>
          <p className="text-gray-600">A Juju está montando seu plano de exercícios perfeito! 💪</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="text-red-500 mx-auto" size={48} />
          <h2 className="text-xl font-bold text-gray-800">Ops! Algo deu errado</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={simulateNewWorkoutData}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                <Dumbbell className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Seus Treinos 💪</h1>
                <p className="text-sm text-gray-600">Plano de exercícios personalizado</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>Atualizado: {lastUpdate.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={simulateNewWorkoutData}
                className="mt-1 text-pink-600 hover:text-pink-700 transition-colors"
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        
        {workoutData ? (
          <>
            {/* Resumo do perfil de treino */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 mb-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Target className="text-pink-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Seu Perfil de Treino</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                  <Activity className="text-pink-600 mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-600">Objetivo</p>
                  <p className="font-bold text-gray-800">{workoutData.objetivo}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <Clock className="text-blue-600 mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-600">Frequência</p>
                  <p className="font-bold text-gray-800">{workoutData.frequencia}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <Dumbbell className="text-green-600 mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-600">Experiência</p>
                  <p className="font-bold text-gray-800">{workoutData.experiencia}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <CheckCircle className="text-purple-600 mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-bold text-gray-800">Ativo</p>
                </div>
              </div>

              {/* Detalhes do perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-orange-700 mb-2">Tempo por Sessão</h4>
                    <p className="text-sm text-gray-600">{workoutData.tempo_sessao}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-purple-700 mb-2">Foco Principal</h4>
                    <p className="text-sm text-gray-600">{workoutData.foco_regiao}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
                    <h4 className="font-semibold text-red-700 mb-2">Intensidade</h4>
                    <p className="text-sm text-gray-600">{workoutData.intensidade}</p>
                  </div>

                  {workoutData.lesoes && workoutData.lesoes !== 'nao' && (
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
                      <h4 className="font-semibold text-yellow-700 mb-2">Lesões/Limitações</h4>
                      <p className="text-sm text-gray-600">
                        {workoutData.lesoes}
                        {workoutData.lesao_especifica && ` - ${workoutData.lesao_especifica}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Seção de treinos (placeholder para futura implementação) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="text-pink-500" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Cronograma Semanal</h3>
              </div>
              
              <div className="text-center py-8">
                <Dumbbell className="text-gray-300 mx-auto mb-4" size={48} />
                <h4 className="text-lg font-bold text-gray-600 mb-2">Treinos em Preparação</h4>
                <p className="text-gray-500">
                  Seu plano de treino personalizado será gerado em breve!
                </p>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl mt-4 max-w-md mx-auto">
                  <p className="text-sm text-gray-600">
                    ✨ A Juju está criando exercícios específicos para seus objetivos
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Footer com informações */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-gray-500">
                💪 Seus treinos são personalizados baseados no seu perfil e objetivos
              </p>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Treinos em Preparação</h3>
              <p className="text-gray-500 text-lg mb-4">Complete o quiz de treino para ver seu plano personalizado aqui!</p>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                <p className="text-sm text-gray-600">
                  ✨ A Juju está esperando suas preferências para criar o plano perfeito!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTreino;
