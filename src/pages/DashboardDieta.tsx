import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Coffee, 
  Utensils, 
  Sandwich, 
  Moon, 
  Calendar,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Home,
  ChefHat,
  Clock,
  Zap
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

interface DietData {
  id: string;
  universal_id: string;
  nome_dieta: string;
  descricao: string | null;
  calorias_totais: number | null;
  cafe_da_manha: any;
  almoco: any;
  lanche: any;
  jantar: any;
  ceia: any;
  created_at: string;
  updated_at: string;
  user_id: string;
  ativa: boolean;
}

interface MealData {
  nome: string;
  horario: string;
  calorias: number;
  descricao: string;
  alimentos: string[];
  substituicoes: Array<{ original: string; opcoes: string[] }>;
}

const DashboardDieta = () => {
  const navigate = useNavigate();
  const [dietData, setDietData] = useState<DietData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const refeicoes = [
    {
      id: 'cafe_da_manha',
      nome: 'Café da Manhã',
      emoji: '☀️',
      icon: <Coffee className="text-pink-500" size={24} />,
      cor: 'from-pink-100 to-rose-200 border-pink-200',
      corTexto: 'text-pink-700',
      horario: '07:00'
    },
    {
      id: 'almoco',
      nome: 'Almoço',
      emoji: '🍽️',
      icon: <Utensils className="text-pink-600" size={24} />,
      cor: 'from-rose-100 to-pink-200 border-rose-200',
      corTexto: 'text-pink-800',
      horario: '12:30'
    },
    {
      id: 'lanche',
      nome: 'Lanche',
      emoji: '🥪',
      icon: <Sandwich className="text-rose-500" size={24} />,
      cor: 'from-pink-50 to-pink-150 border-pink-150',
      corTexto: 'text-rose-700',
      horario: '15:30'
    },
    {
      id: 'jantar',
      nome: 'Jantar',
      emoji: '🌙',
      icon: <Moon className="text-pink-500" size={24} />,
      cor: 'from-rose-50 to-rose-150 border-rose-150',
      corTexto: 'text-pink-700',
      horario: '19:00'
    },
    {
      id: 'ceia',
      nome: 'Ceia',
      emoji: '🌟',
      icon: <Moon className="text-rose-400" size={24} />,
      cor: 'from-pink-100 to-rose-100 border-pink-100',
      corTexto: 'text-rose-600',
      horario: '21:30'
    }
  ];

  useEffect(() => {
    if (user) {
      loadDietData();
    }
  }, [user]);

  const loadDietData = async () => {
    if (!user) {
      console.error('❌ Usuário não autenticado');
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Buscando dados da tabela dieta para usuário:', user.id);
      
      const { data, error: supabaseError } = await supabase
        .from('dieta')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativa', true)
        .order('created_at', { ascending: false })
        .limit(1);
        
      console.log('📊 Resposta da consulta dieta ativa:', { data, error: supabaseError });
        
      if (supabaseError) {
        console.error('❌ Erro na consulta Supabase:', supabaseError);
        throw new Error(`Erro ao consultar dados: ${supabaseError.message}`);
      }
        
      if (data && data.length > 0) {
        const dietaAtiva = data[0] as DietData;
        console.log('✅ Dieta ativa encontrada:', dietaAtiva);
        setDietData(dietaAtiva);
      } else {
        console.log('⚠️ Nenhuma dieta ativa encontrada na tabela dieta');
        setError('Nenhuma dieta ativa encontrada. Complete o quiz alimentar para gerar sua dieta personalizada.');
      }
    } catch (err: any) {
      console.error('💥 Erro ao carregar dados da dieta:', err);
      setError(`Erro ao carregar dieta: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const parseTextMeal = (text: string): { alimentos: string[], substituicoes: Array<{ original: string; opcoes: string[] }>, calorias: number, descricao: string } => {
    if (!text || typeof text !== 'string') {
      return { alimentos: [], substituicoes: [], calorias: 0, descricao: '' };
    }

    console.log('📝 Parseando texto da refeição:', text);

    // Extrair calorias do texto usando regex mais específica
    const caloriasMatch = text.match(/(\d+)\s*kcal/i);
    const calorias = caloriasMatch ? parseInt(caloriasMatch[1]) : 0;

    // Dividir o texto em partes principais
    const parts = text.split(/Substituições?:/i);
    const mainPart = parts[0] || '';
    const substitutionPart = parts[1] || '';

    // Extrair alimentos principais - melhor parsing
    let alimentosText = mainPart;
    
    // Remover o nome da refeição do início (ex: "Café da Manhã:")
    alimentosText = alimentosText.replace(/^[^:]+:\s*/, '').trim();
    
    // Remover informações de calorias
    alimentosText = alimentosText.replace(/\d+\s*kcal/gi, '').trim();
    
    // Dividir por vírgulas e limpar cada item
    const alimentos = alimentosText
      .split(',')
      .map(item => {
        // Limpar cada item removendo espaços extras e pontos
        return item.trim().replace(/\.$/, '').trim();
      })
      .filter(item => item.length > 2) // Remover itens muito pequenos
      .map(item => {
        // Manter as quantidades mas limpar formatação
        return item.replace(/^\s*[-•]\s*/, '').trim();
      })
      .filter(item => item.length > 0);

    // Extrair substituições com parsing melhorado
    const substituicoes: Array<{ original: string; opcoes: string[] }> = [];
    if (substitutionPart) {
      // Dividir por vírgulas ou pontos para pegar cada substituição
      const substitutionItems = substitutionPart.split(/[,.]/).filter(item => item.trim().length > 0);
      
      substitutionItems.forEach(item => {
        // Procurar pelo padrão "original → substituição1 / substituição2"
        if (item.includes('→')) {
          const [original, replacements] = item.split('→');
          if (original && replacements) {
            const originalClean = original.trim();
            const replacementOptions = replacements
              .split('/')
              .map(opt => opt.trim())
              .filter(opt => opt.length > 0);
            
            if (originalClean && replacementOptions.length > 0) {
              substituicoes.push({
                original: originalClean,
                opcoes: replacementOptions
              });
            }
          }
        }
      });
    }

    // Criar descrição melhor estruturada
    const descricao = alimentos.length > 0 
      ? alimentos.join(', ') 
      : 'Refeição não configurada';

    const result = { alimentos, substituicoes, calorias, descricao };
    console.log('✅ Resultado do parsing:', result);

    return result;
  };

  const formatMealData = (mealData: any, mealName: string, defaultTime: string): MealData => {
    console.log(`🍽️ Formatando dados da refeição ${mealName}:`, mealData);
    
    if (!mealData) {
      return {
        nome: mealName,
        horario: defaultTime,
        calorias: 0,
        descricao: 'Refeição não configurada',
        alimentos: [],
        substituicoes: []
      };
    }

    if (typeof mealData === 'string') {
      console.log(`📝 Processando texto da refeição ${mealName}`);
      const { alimentos, substituicoes, calorias, descricao } = parseTextMeal(mealData);
      
      return {
        nome: mealName,
        horario: defaultTime,
        calorias: calorias,
        descricao: descricao,
        alimentos: alimentos,
        substituicoes: substituicoes
      };
    }

    if (typeof mealData === 'object' && mealData !== null) {
      console.log(`📊 Dados da refeição ${mealName} são objeto:`, mealData);
      return {
        nome: mealName,
        horario: mealData.horario || defaultTime,
        calorias: mealData.calorias || 0,
        descricao: mealData.descricao || mealData.description || '',
        alimentos: mealData.alimentos || mealData.foods || [],
        substituicoes: mealData.substituicoes || []
      };
    }

    return {
      nome: mealName,
      horario: defaultTime,
      calorias: 0,
      descricao: 'Dados não disponíveis',
      alimentos: [],
      substituicoes: []
    };
  };

  const calcularCaloriasTotais = () => {
    if (dietData?.calorias_totais) {
      return dietData.calorias_totais;
    }
    
    if (dietData) {
      let total = 0;
      refeicoes.forEach(refeicao => {
        const mealData = formatMealData(dietData[refeicao.id as keyof DietData], refeicao.nome, refeicao.horario);
        total += mealData.calorias;
      });
      return total;
    }
    
    return 0;
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
          <h2 className="text-xl font-bold text-pink-800">Carregando sua dieta...</h2>
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
            onClick={loadDietData}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <Header 
        showBack={true} 
        onBack={() => navigate('/dashboard')}
        title="Dieta"
      />

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
            onClick={loadDietData}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-pink-200 hover:bg-pink-50 transition-all"
          >
            <RefreshCw size={16} />
            <span className="text-sm">Atualizar</span>
          </button>
        </div>

        {/* Resumo diário */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200 mb-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="text-pink-500" size={24} />
            <h2 className="text-xl font-bold text-pink-800">
              {dietData?.nome_dieta || 'Plano Alimentar Personalizado'}
            </h2>
            {dietData?.universal_id && (
              <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
                ID: {dietData.universal_id.slice(0, 8)}...
              </span>
            )}
          </div>
          
          {dietData?.descricao && (
            <p className="text-pink-600 mb-4">{dietData.descricao}</p>
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
              <p className="text-sm text-rose-700">Plano Ativo</p>
            </div>
          </div>
        </motion.div>

        {/* Grid de refeições */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {refeicoes.map((tipoRefeicao, index) => {
            const refeicaoData = formatMealData(
              dietData?.[tipoRefeicao.id as keyof DietData], 
              tipoRefeicao.nome, 
              tipoRefeicao.horario
            );
            
            return (
              <motion.div
                key={tipoRefeicao.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${tipoRefeicao.cor} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {tipoRefeicao.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold ${tipoRefeicao.corTexto}`}>
                        {tipoRefeicao.nome}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-pink-600">
                        <Clock size={12} />
                        {refeicaoData.horario}
                      </div>
                    </div>
                  </div>
                  <span className="text-2xl">{tipoRefeicao.emoji}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-pink-600 flex items-center gap-1">
                      <Zap size={12} />
                      Calorias:
                    </span>
                    <span className={`font-bold ${tipoRefeicao.corTexto}`}>
                      {refeicaoData.calorias} kcal
                    </span>
                  </div>
                  
                  {refeicaoData.alimentos && refeicaoData.alimentos.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-pink-700">Descrição:</p>
                      <div className="bg-white/60 p-3 rounded-lg border border-pink-100">
                        <div className="text-sm text-pink-800 leading-relaxed space-y-1">
                          {refeicaoData.alimentos.map((alimento, idx) => (
                            <div key={idx} className="flex items-start">
                              <span className="text-pink-500 mr-2">•</span>
                              <span>{alimento}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {refeicaoData.substituicoes && refeicaoData.substituicoes.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-pink-700">🔄 Substituições:</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {refeicaoData.substituicoes.map((sub, idx) => (
                          <div key={idx} className="bg-white/40 p-3 rounded-lg border border-pink-50">
                            <div className="text-xs">
                              <p className="font-medium text-pink-700 mb-1">
                                <strong>{sub.original}</strong>
                              </p>
                              <p className="text-pink-600">
                                <span className="text-pink-500">→ </span>
                                {sub.opcoes.join(' / ')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!refeicaoData.alimentos || refeicaoData.alimentos.length === 0) && (
                    <div className="text-center py-4">
                      <p className="text-sm text-pink-600 italic">Refeição não configurada</p>
                    </div>
                  )}
                </div>
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
            💡 Sua dieta personalizada está ativa! 
            {dietData?.universal_id && ` (ID: ${dietData.universal_id.slice(0, 8)}...)`}
          </p>
          {dietData && (
            <p className="text-xs text-pink-400 mt-2">
              Última atualização: {new Date(dietData.updated_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardDieta;
