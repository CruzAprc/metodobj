
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Coffee, 
  Utensils, 
  Sandwich, 
  Moon, 
  Clock, 
  ChefHat,
  Calendar,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Home,
  User
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

const DashboardDieta = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [dietData, setDietData] = useState<any>(null);
  const [realDietData, setRealDietData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { user } = useAuth();

  // Mock data para demonstração (mantido como fallback)
  const mockDietData = {
    cafeDaManha: {
      nome: "Café da Manhã Energético",
      horario: "07:00",
      calorias: 350,
      macros: { proteina: 25, carboidrato: 35, gordura: 12 },
      alimentos: [
        { nome: "Ovos mexidos", quantidade: "2 unidades", calorias: 140 },
        { nome: "Pão integral", quantidade: "2 fatias", calorias: 120 },
        { nome: "Abacate", quantidade: "1/4 unidade", calorias: 90 }
      ]
    },
    almoco: {
      nome: "Almoço Balanceado", 
      horario: "12:30",
      calorias: 450,
      macros: { proteina: 35, carboidrato: 45, gordura: 15 },
      alimentos: [
        { nome: "Peito de frango grelhado", quantidade: "150g", calorias: 250 },
        { nome: "Arroz integral", quantidade: "3 colheres", calorias: 120 },
        { nome: "Salada verde", quantidade: "1 prato", calorias: 50 },
        { nome: "Feijão", quantidade: "1 concha", calorias: 80 }
      ]
    },
    lanche: {
      nome: "Lanche da Tarde",
      horario: "15:30", 
      calorias: 200,
      macros: { proteina: 20, carboidrato: 15, gordura: 8 },
      alimentos: [
        { nome: "Whey protein", quantidade: "1 scoop", calorias: 120 },
        { nome: "Banana", quantidade: "1 unidade", calorias: 80 }
      ]
    },
    jantar: {
      nome: "Jantar Leve",
      horario: "19:00",
      calorias: 350,
      macros: { proteina: 30, carboidrato: 25, gordura: 12 },
      alimentos: [
        { nome: "Salmão grelhado", quantidade: "120g", calorias: 200 },
        { nome: "Batata doce", quantidade: "100g", calorias: 90 },
        { nome: "Brócolis refogado", quantidade: "1 xícara", calorias: 60 }
      ]
    },
    ceia: {
      nome: "Ceia Opcional",
      horario: "21:30",
      calorias: 150,
      macros: { proteina: 15, carboidrato: 8, gordura: 6 },
      alimentos: [
        { nome: "Iogurte natural", quantidade: "1 pote", calorias: 100 },
        { nome: "Chia", quantidade: "1 colher", calorias: 50 }
      ]
    }
  };

  useEffect(() => {
    if (user) {
      loadUserData();
      loadDietData();
      loadRealDietData();
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

  const loadDietData = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_quiz_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('quiz_type', 'alimentar')
      .single();
      
    if (data) {
      setDietData(data);
    }
  };

  const loadRealDietData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('dieta')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativa', true)
        .order('created_at', { ascending: false })
        .maybeSingle();
        
      if (data) {
        console.log('Dados da dieta carregados:', data);
        setRealDietData(data);
      } else {
        console.log('Nenhuma dieta ativa encontrada');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da dieta:', error);
    }
  };

  // Simular carregamento de dieta atualizada
  const simulateNewDietData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loadRealDietData();
      setLastUpdate(new Date());
    } catch (err) {
      setError("Erro ao carregar dados da dieta");
    } finally {
      setLoading(false);
    }
  };

  // Configuração das refeições com tema rosa
  const refeicoes = [
    {
      id: 'cafeDaManha',
      dbField: 'cafe_da_manha',
      nome: 'Café da Manhã',
      emoji: '☀️',
      icon: <Coffee className="text-pink-500" size={24} />,
      cor: 'from-pink-100 to-rose-200 border-pink-200',
      corTexto: 'text-pink-700'
    },
    {
      id: 'almoco',
      dbField: 'almoco',
      nome: 'Almoço',
      emoji: '🍽️',
      icon: <Utensils className="text-pink-600" size={24} />,
      cor: 'from-rose-100 to-pink-200 border-rose-200',
      corTexto: 'text-pink-800'
    },
    {
      id: 'lanche',
      dbField: 'lanche',
      nome: 'Lanche',
      emoji: '🥪',
      icon: <Sandwich className="text-rose-500" size={24} />,
      cor: 'from-pink-50 to-pink-150 border-pink-150',
      corTexto: 'text-rose-700'
    },
    {
      id: 'jantar',
      dbField: 'jantar',
      nome: 'Jantar',
      emoji: '🌙',
      icon: <Moon className="text-pink-500" size={24} />,
      cor: 'from-rose-50 to-rose-150 border-rose-150',
      corTexto: 'text-pink-700'
    },
    {
      id: 'ceia',
      dbField: 'ceia',
      nome: 'Ceia',
      emoji: '🌟',
      icon: <Moon className="text-rose-400" size={24} />,
      cor: 'from-pink-100 to-rose-100 border-pink-100',
      corTexto: 'text-rose-600'
    }
  ];

  const calcularCaloriasTotais = () => {
    // Se temos dados reais da dieta, usar eles
    if (realDietData?.calorias_totais) {
      return realDietData.calorias_totais;
    }
    
    // Senão, usar mock data
    return Object.values(mockDietData).reduce((total, refeicao) => total + (refeicao?.calorias || 0), 0);
  };

  const getDietDataToShow = () => {
    // Se temos dados reais da dieta, usar as colunas específicas
    if (realDietData) {
      const dietDataFromColumns = {
        cafeDaManha: realDietData.cafe_da_manha,
        almoco: realDietData.almoco,
        lanche: realDietData.lanche,
        jantar: realDietData.jantar,
        ceia: realDietData.ceia
      };
      
      // Verificar se há dados nas colunas específicas
      const hasDataInColumns = Object.values(dietDataFromColumns).some(meal => 
        meal && typeof meal === 'object' && Object.keys(meal).length > 0
      );
      
      if (hasDataInColumns) {
        return dietDataFromColumns;
      }
      
      // Fallback para a coluna refeicoes se ainda existir
      if (realDietData.refeicoes && Object.keys(realDietData.refeicoes).length > 0) {
        return realDietData.refeicoes;
      }
    }
    
    // Senão, usar mock data
    return mockDietData;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center mx-auto"
          >
            <ChefHat className="text-white" size={32} />
          </motion.div>
          <h2 className="text-xl font-bold text-pink-800">Preparando sua dieta...</h2>
          <p className="text-pink-600">A Juju está montando seu plano alimentar perfeito! ✨</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="text-rose-500 mx-auto" size={48} />
          <h2 className="text-xl font-bold text-pink-800">Ops! Algo deu errado</h2>
          <p className="text-pink-600">{error}</p>
          <button
            onClick={simulateNewDietData}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const currentDietData = getDietDataToShow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      
      {/* Header com navegação */}
      <Header 
        showBack={true} 
        onBack={() => navigate('/dashboard')}
        title="Dieta"
      />

      {/* Navegação rápida */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-pink-200 hover:bg-pink-50 transition-all"
          >
            <Home size={16} />
            <span className="text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/treino')}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-pink-200 hover:bg-pink-50 transition-all"
          >
            <span className="text-sm">💪 Ver Treinos</span>
          </button>
          <button
            onClick={simulateNewDietData}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-pink-200 hover:bg-pink-50 transition-all"
          >
            <RefreshCw size={16} />
            <span className="text-sm">Atualizar</span>
          </button>
        </div>

        {dietData || realDietData ? (
          <>
            {/* Resumo diário com tema rosa */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200 mb-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="text-pink-500" size={24} />
                <h2 className="text-xl font-bold text-pink-800">
                  {realDietData?.nome_dieta || 'Plano Alimentar Personalizado'}
                </h2>
              </div>
              
              {realDietData?.descricao && (
                <p className="text-pink-600 mb-4">{realDietData.descricao}</p>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl">
                  <p className="text-2xl font-bold text-pink-600">{calcularCaloriasTotais()}</p>
                  <p className="text-sm text-pink-700">Calorias Totais</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-100 rounded-xl">
                  <p className="text-2xl font-bold text-rose-600">5</p>
                  <p className="text-sm text-rose-700">Refeições</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl">
                  <p className="text-2xl font-bold text-pink-600">Saudável</p>
                  <p className="text-sm text-pink-700">Objetivo</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl">
                  <CheckCircle className="text-rose-600 mx-auto mb-1" size={24} />
                  <p className="text-sm text-rose-700">
                    {realDietData ? 'Plano Ativo' : 'Mock Data'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Grid de refeições */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {refeicoes.map((tipoRefeicao, index) => {
                const refeicaoData = currentDietData[tipoRefeicao.id];
                
                return (
                  <motion.div
                    key={tipoRefeicao.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${tipoRefeicao.cor} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
                  >
                    {/* Header da refeição */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                          {tipoRefeicao.icon}
                        </div>
                        <div>
                          <h4 className={`font-bold ${tipoRefeicao.corTexto}`}>
                            {tipoRefeicao.nome}
                          </h4>
                          <p className="text-sm text-pink-600">
                            {refeicaoData?.horario || '--:--'}
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl">{tipoRefeicao.emoji}</span>
                    </div>

                    {/* Informações nutricionais */}
                    {refeicaoData && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-pink-600">Calorias:</span>
                          <span className={`font-bold ${tipoRefeicao.corTexto}`}>
                            {refeicaoData.calorias} kcal
                          </span>
                        </div>
                        
                        {/* Macros */}
                        {refeicaoData.macros && (
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-white/60 rounded-lg">
                              <p className="font-medium text-pink-700">Proteína</p>
                              <p className={tipoRefeicao.corTexto}>{refeicaoData.macros.proteina}g</p>
                            </div>
                            <div className="text-center p-2 bg-white/60 rounded-lg">
                              <p className="font-medium text-pink-700">Carbo</p>
                              <p className={tipoRefeicao.corTexto}>{refeicaoData.macros.carboidrato}g</p>
                            </div>
                            <div className="text-center p-2 bg-white/60 rounded-lg">
                              <p className="font-medium text-pink-700">Gordura</p>
                              <p className={tipoRefeicao.corTexto}>{refeicaoData.macros.gordura}g</p>
                            </div>
                          </div>
                        )}

                        {/* Lista de alimentos */}
                        {refeicaoData.alimentos && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-pink-700">Alimentos:</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {refeicaoData.alimentos.map((alimento, idx) => (
                                <div key={idx} className="text-xs bg-white/40 p-2 rounded-lg">
                                  <div className="flex justify-between">
                                    <span className="font-medium text-pink-800">{alimento.nome}</span>
                                    <span className={tipoRefeicao.corTexto}>{alimento.calorias} kcal</span>
                                  </div>
                                  <p className="text-pink-600">{alimento.quantidade}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {!refeicaoData && (
                      <div className="text-center py-4">
                        <p className="text-sm text-pink-600">Refeição não configurada</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Footer com informações */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-pink-500">
                💡 {realDietData 
                  ? 'Sua dieta personalizada está ativa!' 
                  : 'Complete o quiz alimentar para ver suas refeições personalizadas'
                }
              </p>
              {realDietData && (
                <p className="text-xs text-pink-400 mt-2">
                  Última atualização: {new Date(realDietData.updated_at).toLocaleDateString('pt-BR')}
                </p>
              )}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto border border-pink-200">
              <AlertCircle className="text-pink-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-pink-800 mb-2">Dieta em Preparação</h3>
              <p className="text-pink-600 text-lg mb-4">Complete o quiz alimentar para ver suas refeições personalizadas aqui!</p>
              <div className="bg-gradient-to-br from-pink-50 to-rose-100 p-4 rounded-xl">
                <p className="text-sm text-pink-600">
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

export default DashboardDieta;
