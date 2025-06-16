
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell,
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

const DashboardTreino = () => {
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWorkoutData();
    }
  }, [user]);

  const loadWorkoutData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_quiz_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('quiz_type', 'treino')
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
    } catch (err) {
      setError("Erro ao carregar dados do treino");
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-xl font-bold text-gray-800">Preparando seus treinos...</h2>
          <p className="text-gray-600">O Basa está montando seu plano de exercícios perfeito! 💪</p>
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
            onClick={simulateNewWorkoutData}
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

      {/* Conteúdo principal - apenas cronograma semanal */}
      <div className="max-w-4xl mx-auto p-4">
        {workoutData ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Cronograma Semanal</h3>
            </div>
            
            <div className="text-center py-8">
              <Dumbbell className="text-gray-300 mx-auto mb-4" size={48} />
              <h4 className="text-lg font-bold text-gray-600 mb-2">Treinos em Preparação</h4>
              <p className="text-gray-500 mb-4">
                Seu plano de treino personalizado será gerado em breve!
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-gray-600">
                  💪 O Basa está criando exercícios específicos para seus objetivos!
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Quiz concluído com sucesso
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
              <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Treinos em Preparação</h3>
              <p className="text-gray-500 text-lg mb-4">Complete o quiz de treino para ver seu plano personalizado aqui!</p>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <p className="text-sm text-gray-600">
                  💪 O Basa está esperando suas preferências para criar o plano perfeito!
                </p>
              </div>
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
