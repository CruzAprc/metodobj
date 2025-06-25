
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Calendar,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Home,
  ChefHat
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import TreinoWeekTable from "@/components/TreinoWeekTable";
import { Tables } from "@/integrations/supabase/types";

type TreinoData = Tables<'treino'>;

const DashboardTreino = () => {
  const navigate = useNavigate();
  const [treinoData, setTreinoData] = useState<TreinoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTreinoData();
    }
  }, [user]);

  const loadTreinoData = async () => {
    if (!user) {
      console.error('❌ Usuário não autenticado');
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Carregando dados do treino para usuário:', user.id);
      
      const { data, error: queryError } = await supabase
        .from('treino')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (queryError) {
        console.error('❌ Erro ao carregar dados do treino:', queryError);
        throw new Error(`Erro na consulta: ${queryError.message}`);
      }
        
      if (data && data.length > 0) {
        const treinoAtivo = data[0] as TreinoData;
        console.log('✅ Dados do treino carregados:', treinoAtivo);
        setTreinoData(treinoAtivo);
      } else {
        console.log('⚠️ Nenhum treino ativo encontrado');
        setError('Basa e seu time está montando seu treino personalizado');
      }
    } catch (err: any) {
      console.error('💥 Erro ao carregar treino:', err);
      setError(`Erro ao carregar treino: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto"
          >
            <Dumbbell className="text-white" size={32} />
          </motion.div>
          <h2 className="text-xl font-bold text-blue-800">Carregando seu treino...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="text-red-500 mx-auto" size={48} />
          <h2 className="text-xl font-bold text-blue-800">Ops! Algo deu errado</h2>
          <p className="text-blue-600">{error}</p>
          <button
            onClick={loadTreinoData}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Header 
        showBack={true} 
        onBack={() => navigate('/dashboard')}
        title="Treino"
      />

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-50 transition-all"
          >
            <Home size={16} />
            <span className="text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/dieta')}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-50 transition-all"
          >
            <ChefHat size={16} />
            <span className="text-sm">Ver Dieta</span>
          </button>
          <button
            onClick={loadTreinoData}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-blue-200 hover:bg-blue-50 transition-all"
          >
            <RefreshCw size={16} />
            <span className="text-sm">Atualizar</span>
          </button>
        </div>

        {treinoData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 mb-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Dumbbell className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-blue-800">
                {treinoData.nome_plano || 'Plano de Treino Personalizado'}
              </h2>
              {treinoData.universal_id && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  ID: {treinoData.universal_id.slice(0, 8)}...
                </span>
              )}
            </div>
            
            {treinoData.descricao && (
              <p className="text-blue-600 mb-4">{treinoData.descricao}</p>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">7</p>
                <p className="text-sm text-blue-700">Dias da Semana</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl">
                <p className="text-2xl font-bold text-indigo-600">Variado</p>
                <p className="text-sm text-indigo-700">Exercícios</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-100 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">Personalizado</p>
                <p className="text-sm text-purple-700">Plano</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                <CheckCircle className="text-blue-600 mx-auto mb-1" size={24} />
                <p className="text-sm text-blue-700">Ativo</p>
              </div>
            </div>
          </motion.div>
        )}

        {treinoData ? (
          <TreinoWeekTable treinoData={treinoData} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Dumbbell className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-600 mb-2">Nenhum treino encontrado</h3>
            <p className="text-gray-500 mb-6">Basa e seu time está montando seu treino personalizado</p>
            <button
              onClick={() => navigate('/quiz-treino')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              Fazer Quiz de Treino
            </button>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-blue-500">
            💪 Seu treino personalizado está ativo! 
            {treinoData?.universal_id && ` (ID: ${treinoData.universal_id.slice(0, 8)}...)`}
          </p>
          {treinoData && (
            <p className="text-xs text-blue-400 mt-2">
              Última atualização: {new Date(treinoData.updated_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardTreino;
