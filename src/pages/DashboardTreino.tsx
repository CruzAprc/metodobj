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
  Shield,
  CheckCircle,
  PlayCircle
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import TreinoWeekTable from "@/components/TreinoWeekTable";
import { Tables } from "@/integrations/supabase/types";

interface QuizData {
  experiencia: string;
  frequencia: string;
  objetivo: string;
  limitacoes: string[];
  preferencias: string[];
  tempo_disponivel: string;
}

// Use the actual Supabase table type
type TreinoData = Tables<'treino'>;

// Type guard to check if data matches QuizData structure
const isQuizData = (data: any): data is QuizData => {
  return data &&
    typeof data === 'object' &&
    typeof data.experiencia === 'string' &&
    typeof data.frequencia === 'string' &&
    typeof data.objetivo === 'string' &&
    Array.isArray(data.limitacoes) &&
    Array.isArray(data.preferencias) &&
    typeof data.tempo_disponivel === 'string';
};

const DashboardTreino = () => {
  const navigate = useNavigate();
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [treinoData, setTreinoData] = useState<TreinoData | null>(null);
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
      console.log('Dashboard Treino: Iniciando carregamento de dados para usuário:', user.id);
      
      // Buscar treino personalizado da tabela treino
      const { data: treinoPersonalizado, error: treinoError } = await supabase
        .from('treino')
        .select('*')
        .eq('user_id', user.id)
        .eq('ativo', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log('Dashboard Treino: Consulta treino personalizado - dados:', treinoPersonalizado);
      console.log('Dashboard Treino: Consulta treino personalizado - erro:', treinoError);

      if (treinoError && treinoError.code !== 'PGRST116') {
        console.error('Dashboard Treino: Erro ao carregar treino personalizado:', treinoError);
      } else if (treinoPersonalizado) {
        console.log('Dashboard Treino: Treino personalizado encontrado:', treinoPersonalizado);
        
        // Log específico das colunas dos dias da semana
        console.log('Dashboard Treino: Dados por dia da semana:');
        console.log('- Segunda-feira:', treinoPersonalizado.segunda_feira);
        console.log('- Terça-feira:', treinoPersonalizado.terca_feira);
        console.log('- Quarta-feira:', treinoPersonalizado.quarta_feira);
        console.log('- Quinta-feira:', treinoPersonalizado.quinta_feira);
        console.log('- Sexta-feira:', treinoPersonalizado.sexta_feira);
        console.log('- Sábado:', treinoPersonalizado.sabado);
        console.log('- Domingo:', treinoPersonalizado.domingo);
        
        setTreinoData(treinoPersonalizado);
        
        // Extract quiz_data if it exists and has the right structure
        if (treinoPersonalizado.quiz_data && isQuizData(treinoPersonalizado.quiz_data)) {
          setWorkoutData({ quiz_data: treinoPersonalizado.quiz_data });
        }
      }

      // Se não houver treino personalizado OU se houve erro, busca dados do quiz
      if (!treinoPersonalizado || treinoError) {
        console.log('Dashboard Treino: Buscando dados do quiz como fallback');
        
        const { data: quizData, error: quizError } = await supabase
          .from('user_quiz_data')
          .select('*')
          .eq('user_id', user.id)
          .eq('quiz_type', 'treino')
          .maybeSingle();
          
        console.log('Dashboard Treino: Dados do quiz:', quizData);
        console.log('Dashboard Treino: Erro do quiz:', quizError);
          
        if (quizData) {
          console.log('Dashboard Treino: Dados do quiz carregados:', quizData);
          setWorkoutData(quizData);
        }
        
        if (quizError && quizError.code !== 'PGRST116') {
          console.error('Dashboard Treino: Erro ao carregar dados do quiz:', quizError);
          setError('Erro ao carregar dados do treino');
        }
      }
    } catch (err) {
      console.error('Dashboard Treino: Erro inesperado:', err);
      setError('Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para converter Json para objeto
  const convertJsonToObject = (jsonData: any): any => {
    if (!jsonData) return null;
    
    // Se já é um objeto, retorna como está
    if (typeof jsonData === 'object' && jsonData !== null) {
      return jsonData;
    }
    
    // Se é uma string, tenta parsear como JSON
    if (typeof jsonData === 'string') {
      try {
        return JSON.parse(jsonData);
      } catch (error) {
        console.log('Erro ao parsear JSON:', error);
        return null;
      }
    }
    
    return null;
  };

  // Função para formatar dados do treino
  const formatTreinoData = (treinoRaw: any): any => {
    if (!treinoRaw) return null;
    
    const treino = convertJsonToObject(treinoRaw);
    if (!treino) return null;
    
    // Se tem estrutura de exercícios
    if (treino.exercicios && Array.isArray(treino.exercicios)) {
      return {
        exercicios: treino.exercicios,
        foco: treino.foco || '',
        duracao: treino.duracao || '',
        observacoes: treino.observacoes || ''
      };
    }
    
    return treino;
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

  const getDiaNome = (dia: string) => {
    const nomes = {
      'segunda_feira': 'Segunda-feira',
      'terca_feira': 'Terça-feira',
      'quarta_feira': 'Quarta-feira',
      'quinta_feira': 'Quinta-feira',
      'sexta_feira': 'Sexta-feira',
      'sabado': 'Sábado',
      'domingo': 'Domingo'
    };
    return nomes[dia as keyof typeof nomes] || dia;
  };

  const renderTreinoPersonalizado = () => {
    if (!treinoData) {
      console.log('Dashboard Treino: renderTreinoPersonalizado - treinoData é null');
      return null;
    }

    console.log('Dashboard Treino: renderTreinoPersonalizado - dados completos:', treinoData);

    const diasTreino = ['segunda_feira', 'terca_feira', 'quarta_feira', 'quinta_feira', 'sexta_feira', 'sabado', 'domingo'];
    const diasComTreino = diasTreino.filter(dia => {
      const treinoDiaRaw = treinoData[dia as keyof TreinoData];
      console.log(`Dashboard Treino: Verificando ${dia}:`, treinoDiaRaw);
      const treinoDia = formatTreinoData(treinoDiaRaw);
      const temTreino = treinoDia && treinoDia !== null;
      console.log(`Dashboard Treino: ${dia} tem treino:`, temTreino);
      return temTreino;
    });

    console.log('Dashboard Treino: Dias com treino:', diasComTreino);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100"
      >
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Seu Plano Personalizado</h3>
            {treinoData.nome_plano && (
              <p className="text-sm text-gray-600">{treinoData.nome_plano}</p>
            )}
          </div>
        </div>

        {treinoData.descricao && (
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <p className="text-gray-700">{treinoData.descricao}</p>
          </div>
        )}

        {/* Treinos por Dia da Semana */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Cronograma Semanal</h4>
          
          {diasComTreino.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {diasComTreino.map((dia) => {
                const treinoDiaRaw = treinoData[dia as keyof TreinoData];
                const treinoDia = formatTreinoData(treinoDiaRaw);
                
                return (
                  <div key={dia} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-3">
                      <PlayCircle className="text-blue-600" size={18} />
                      <h4 className="font-semibold text-gray-800">{getDiaNome(dia)}</h4>
                    </div>
                    
                    {treinoDia && treinoDia.exercicios && Array.isArray(treinoDia.exercicios) ? (
                      <div className="space-y-2">
                        {treinoDia.foco && (
                          <div className="text-xs text-blue-600 font-medium mb-2">
                            {treinoDia.foco}
                          </div>
                        )}
                        {treinoDia.exercicios.slice(0, 3).map((exercicio: any, index: number) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {exercicio.nome || exercicio.exercicio || 'Exercício'}
                            {exercicio.series && exercicio.repeticoes && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({exercicio.series}x{exercicio.repeticoes})
                              </span>
                            )}
                          </div>
                        ))}
                        {treinoDia.exercicios.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{treinoDia.exercicios.length - 3} exercícios
                          </div>
                        )}
                        {treinoDia.duracao && (
                          <div className="text-xs text-gray-500 mt-2">
                            ⏱️ {treinoDia.duracao}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        {treinoDia ? 'Treino personalizado disponível' : 'Dados do treino em processamento'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Dumbbell className="text-blue-400 mx-auto mb-4" size={48} />
              <h4 className="text-lg font-bold text-gray-600 mb-2">Treinos por Dia da Semana</h4>
              <p className="text-gray-500 mb-4">
                Nenhum treino específico encontrado para os dias da semana.
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-gray-600">
                  💪 Plano de treino em preparação
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Treinos ABCDE se disponíveis */}
        {(treinoData.treino_a || treinoData.treino_b || treinoData.treino_c || treinoData.treino_d || treinoData.treino_e) && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Divisão de Treinos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(['treino_a', 'treino_b', 'treino_c', 'treino_d', 'treino_e'] as const).map((treino) => {
                const treinoInfoRaw = treinoData[treino];
                const treinoInfo = formatTreinoData(treinoInfoRaw);
                if (!treinoInfo) return null;
                
                return (
                  <div key={treino} className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Dumbbell className="text-purple-600" size={16} />
                      <h5 className="font-semibold text-gray-800">
                        Treino {treino.split('_')[1].toUpperCase()}
                      </h5>
                    </div>
                    {treinoInfo.foco && (
                      <div className="text-xs text-purple-600 font-medium mb-2">
                        {treinoInfo.foco}
                      </div>
                    )}
                    {treinoInfo.exercicios && Array.isArray(treinoInfo.exercicios) ? (
                      <div className="text-sm text-gray-600">
                        {treinoInfo.exercicios.length} exercícios
                        {treinoInfo.duracao && (
                          <div className="text-xs text-gray-500 mt-1">
                            ⏱️ {treinoInfo.duracao}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Treino disponível
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          Plano criado em: {new Date(treinoData.webhook_received_at || treinoData.created_at).toLocaleDateString('pt-BR')}
        </div>
      </motion.div>
    );
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
      <div className="max-w-6xl mx-auto p-4 space-y-6">
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

            {/* Tabela de Treinos da Semana */}
            {treinoData ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TreinoWeekTable treinoData={treinoData} />
              </motion.div>
            ) : (
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
                      Quiz concluído • Aguardando plano personalizado
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
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
