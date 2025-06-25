import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, CheckCircle, Dumbbell, 
  Timer, Target, Activity, Zap, Trophy, User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { gradients, colors } from '@/theme/colors';
import LoadingState, { LoadingButton } from '@/components/LoadingState';

interface QuizData {
  experiencia: string;
  frequencia: string;
  objetivo: string;
  limitacoes: string[];
  preferencias: string[];
  tempo_disponivel: string;
}

const quizSteps = [
  {
    pergunta: 1,
    titulo: 'Qual sua experiência com musculação?',
    subtitulo: 'Queremos personalizar seu treino com base no seu nível atual',
    icon: <Dumbbell className="w-6 h-6" />,
    opcoes: [
      { id: 'iniciante', texto: 'Iniciante', subtexto: 'Nunca treinei', emoji: '🆕', color: 'from-green-400 to-green-500' },
      { id: 'basico', texto: 'Básico', subtexto: 'Menos de 6 meses', emoji: '📚', color: 'from-blue-400 to-blue-500' },
      { id: 'intermediario', texto: 'Intermediário', subtexto: '6 meses - 2 anos', emoji: '💪', color: 'from-purple-400 to-purple-500' },
      { id: 'avancado', texto: 'Avançado', subtexto: 'Mais de 2 anos', emoji: '🏆', color: 'from-orange-400 to-orange-500' }
    ],
    campo: 'experiencia' as keyof QuizData
  },
  {
    pergunta: 2,
    titulo: 'Quantas vezes por semana você pode treinar?',
    subtitulo: 'Vamos criar um cronograma que se encaixe na sua rotina',
    icon: <Timer className="w-6 h-6" />,
    opcoes: [
      { id: '2_vezes', texto: '2x por semana', subtexto: 'Treino básico', emoji: '✌️', color: 'from-cyan-400 to-cyan-500' },
      { id: '3_vezes', texto: '3x por semana', subtexto: 'Ritmo ideal', emoji: '🔥', color: 'from-pink-400 to-pink-500' },
      { id: '4_vezes', texto: '4x por semana', subtexto: 'Treino intenso', emoji: '💪', color: 'from-indigo-400 to-indigo-500' },
      { id: '5_mais', texto: '5+ vezes', subtexto: 'Dedicação total', emoji: '🚀', color: 'from-red-400 to-red-500' }
    ],
    campo: 'frequencia' as keyof QuizData
  },
  {
    pergunta: 3,
    titulo: 'Qual seu principal objetivo no treino?',
    subtitulo: 'Cada objetivo requer uma abordagem específica de treino',
    icon: <Target className="w-6 h-6" />,
    opcoes: [
      { id: 'ganhar_massa', texto: 'Ganhar Massa', subtexto: 'Músculos maiores', emoji: '💪', color: 'from-emerald-400 to-emerald-500' },
      { id: 'definir', texto: 'Definição', subtexto: 'Músculos definidos', emoji: '✨', color: 'from-amber-400 to-amber-500' },
      { id: 'forca', texto: 'Ganhar Força', subtexto: 'Potência máxima', emoji: '🏋️', color: 'from-slate-400 to-slate-500' },
      { id: 'hipertrofia', texto: 'Hipertrofia', subtexto: 'Volume + definição', emoji: '💥', color: 'from-violet-400 to-violet-500' }
    ],
    campo: 'objetivo' as keyof QuizData
  },
  {
    pergunta: 4,
    titulo: 'Você tem alguma limitação física?',
    subtitulo: 'Vamos adaptar os exercícios para manter você segura',
    icon: <Activity className="w-6 h-6" />,
    opcoes: [
      { id: 'nenhuma', texto: 'Nenhuma limitação', subtexto: 'Estou 100%', emoji: '✅', color: 'from-green-400 to-green-500' },
      { id: 'joelho', texto: 'Problemas no joelho', subtexto: 'Cuidado especial', emoji: '🦵', color: 'from-yellow-400 to-yellow-500' },
      { id: 'costas', texto: 'Problemas nas costas', subtexto: 'Exercícios adaptados', emoji: '🔄', color: 'from-orange-400 to-orange-500' },
      { id: 'ombro', texto: 'Problemas no ombro', subtexto: 'Movimentos seguros', emoji: '🤷', color: 'from-red-400 to-red-500' },
      { id: 'outras', texto: 'Outras limitações', subtexto: 'Personalização total', emoji: '⚠️', color: 'from-gray-400 to-gray-500' }
    ],
    campo: 'limitacoes' as keyof QuizData,
    multipla: true
  },
  {
    pergunta: 5,
    titulo: 'Que tipo de treino de musculação você prefere?',
    subtitulo: 'Escolha os estilos que mais te motivam a treinar',
    icon: <Zap className="w-6 h-6" />,
    opcoes: [
      { id: 'musculacao_tradicional', texto: 'Tradicional', subtexto: 'Séries e repetições', emoji: '🏋️', color: 'from-blue-400 to-blue-500' },
      { id: 'powerlifting', texto: 'Powerlifting', subtexto: 'Força e técnica', emoji: '💪', color: 'from-red-400 to-red-500' },
      { id: 'bodybuilding', texto: 'Bodybuilding', subtexto: 'Estética e volume', emoji: '🏆', color: 'from-yellow-400 to-yellow-500' },
      { id: 'hiit_muscular', texto: 'HIIT com pesos', subtexto: 'Intensidade máxima', emoji: '🔥', color: 'from-orange-400 to-orange-500' }
    ],
    campo: 'preferencias' as keyof QuizData,
    multipla: true
  },
  {
    pergunta: 6,
    titulo: 'Quanto tempo você tem por treino?',
    subtitulo: 'Vamos otimizar cada minuto do seu treino',
    icon: <User className="w-6 h-6" />,
    opcoes: [
      { id: '30_min', texto: '30 minutos', subtexto: 'Treino express', emoji: '⏰', color: 'from-cyan-400 to-cyan-500' },
      { id: '45_min', texto: '45 minutos', subtexto: 'Tempo equilibrado', emoji: '⏱️', color: 'from-green-400 to-green-500' },
      { id: '60_min', texto: '1 hora', subtexto: 'Treino completo', emoji: '🕐', color: 'from-blue-400 to-blue-500' },
      { id: '90_min', texto: '1h30 ou mais', subtexto: 'Dedicação total', emoji: '⏳', color: 'from-purple-400 to-purple-500' }
    ],
    campo: 'tempo_disponivel' as keyof QuizData
  }
];

const QuizTreino = () => {
  const navigate = useNavigate();
  const { pergunta } = useParams<{ pergunta: string }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);
  const [quizData, setQuizData] = useState<QuizData>({
    experiencia: '',
    frequencia: '',
    objetivo: '',
    limitacoes: [],
    preferencias: [],
    tempo_disponivel: ''
  });

  const currentPergunta = parseInt(pergunta || '1');
  const currentStep = quizSteps.find(step => step.pergunta === currentPergunta);
  const progress = (currentPergunta / quizSteps.length) * 100;

  // Mover todos os hooks para antes dos returns condicionais
  const isMultipleChoice = currentStep?.multipla || false;
  const currentValue = currentStep ? quizData[currentStep.campo] : '';
  
  // Validação mais robusta para verificar se há seleção
  const hasSelection = React.useMemo(() => {
    if (!currentStep) return false;
    
    if (isMultipleChoice) {
      return Array.isArray(currentValue) && currentValue.length > 0;
    } else {
      return currentValue !== '' && currentValue !== null && currentValue !== undefined;
    }
  }, [currentValue, isMultipleChoice, currentStep]);

  // Verificar se o usuário já completou o quiz
  useEffect(() => {
    const checkQuizCompletion = async () => {
      if (!user) {
        console.log('Quiz Treino: Usuário não logado');
        setIsCheckingExisting(false);
        return;
      }

      try {
        console.log('Quiz Treino: Verificando quiz existente...', {
          userId: user.id,
          currentRoute: window.location.pathname,
          isSpecificQuestion: !!pergunta
        });
        
        const { data: existingQuiz, error } = await supabase
          .from('user_quiz_data')
          .select('*')
          .eq('user_id', user.id)
          .eq('quiz_type', 'treino')
          .maybeSingle();

        console.log('Quiz Treino: Resultado da verificação:', {
          data: existingQuiz,
          error: error,
          hasCompletedAt: !!existingQuiz?.completed_at,
          isAccessingSpecificQuestion: !!pergunta
        });

        if (error && error.code !== 'PGRST116') {
          console.error('Quiz Treino: Erro ao verificar quiz existente:', error);
          setIsCheckingExisting(false);
          return;
        }

        // SE o usuário está acessando /quiz-treino sem pergunta específica E já completou
        // ENTÃO redireciona para dashboard
        if (!pergunta && existingQuiz && existingQuiz.completed_at) {
          console.log('Quiz Treino: Quiz completado + acesso sem pergunta específica -> redirecionando para dashboard');
          navigate('/dashboard');
          return;
        }

        // SE está acessando uma pergunta específica OU não tem quiz completado
        // ENTÃO permite continuar/preencher
        console.log('Quiz Treino: Permitindo preenchimento do quiz');
        
        // Se existem dados (completos ou parciais), carrega para edição
        if (existingQuiz && existingQuiz.quiz_data) {
          console.log('Quiz Treino: Carregando dados existentes para edição');
          const data = existingQuiz.quiz_data as any;
          if (data && typeof data === 'object') {
            setQuizData({
              experiencia: data.experiencia || '',
              frequencia: data.frequencia || '',
              objetivo: data.objetivo || '',
              limitacoes: Array.isArray(data.limitacoes) ? data.limitacoes : [],
              preferencias: Array.isArray(data.preferencias) ? data.preferencias : [],
              tempo_disponivel: data.tempo_disponivel || ''
            });
          }
        }

        setIsCheckingExisting(false);
      } catch (error) {
        console.error('Quiz Treino: Erro inesperado ao verificar quiz:', error);
        setIsCheckingExisting(false);
      }
    };

    checkQuizCompletion();
  }, [user, navigate, pergunta]);

  // Mostrar loading enquanto verifica dados existentes
  if (isCheckingExisting) {
    return (
      <LoadingState 
        fullScreen={true} 
        message="Verificando dados do quiz..." 
        type="heartbeat"
        size="lg"
      />
    );
  }

  const handleOptionSelect = (opcaoId: string) => {
    if (!currentStep) return;

    const { campo, multipla } = currentStep;

    if (multipla) {
      setQuizData(prev => {
        const currentArray = prev[campo] as string[];
        const newArray = currentArray.includes(opcaoId)
          ? currentArray.filter(id => id !== opcaoId)
          : [...currentArray, opcaoId];
        
        return { ...prev, [campo]: newArray };
      });
    } else {
      setQuizData(prev => ({ ...prev, [campo]: opcaoId }));
    }
  };

  const updateCompleteProfile = async (data: QuizData) => {
    if (!user) return;

    try {
      console.log('Atualizando perfil consolidado com dados do quiz treino:', data);

      const profileData = {
        user_id: user.id,
        experiencia_treino: data.experiencia,
        frequencia_treino: data.frequencia,
        objetivo_treino: data.objetivo,
        limitacoes_fisicas: data.limitacoes,
        preferencias_treino: data.preferencias,
        tempo_disponivel: data.tempo_disponivel,
        quiz_treino_completed: true,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_complete_profile')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) {
        console.error('Erro ao atualizar perfil consolidado:', error);
        throw error;
      }

      console.log('Perfil consolidado atualizado com dados do quiz treino');
    } catch (error) {
      console.error('Erro ao atualizar perfil consolidado:', error);
      throw error;
    }
  };

  const sendCompleteDataToWebhook = async () => {
    if (!user) return;

    try {
      console.log('Verificando se todos os dados estão completos para envio ao webhook...');
      
      // Buscar dados completos do perfil
      const { data: completeProfile, error } = await supabase
        .from('user_complete_profile')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil completo:', error);
        return;
      }

      if (completeProfile && completeProfile.all_data_completed && !completeProfile.webhook_sent) {
        console.log('Todos os dados completos! Enviando para webhook...');
        
        // Buscar dados do usuário para o webhook
        const { data: userData } = await supabase
          .from('teste_app')
          .select('email, nome')
          .eq('user_id', user.id)
          .single();

        const webhookPayload = {
          user_id: user.id,
          universal_id: completeProfile.universal_id,
          email: userData?.email || user.email,
          nome: userData?.nome || completeProfile.nome_completo,
          dados_completos: {
            dados_pessoais: {
              nome_completo: completeProfile.nome_completo,
              data_nascimento: completeProfile.data_nascimento,
              altura: completeProfile.altura,
              peso_atual: completeProfile.peso_atual,
              sexo: completeProfile.sexo
            },
            quiz_alimentar: {
              objetivo: completeProfile.objetivo_alimentar,
              restricoes: completeProfile.restricoes_alimentares,
              preferencias: completeProfile.preferencias_alimentares,
              frequencia_refeicoes: completeProfile.frequencia_refeicoes,
              nivel_atividade: completeProfile.nivel_atividade,
              alergias: completeProfile.alergias,
              suplementos: completeProfile.suplementos,
              horario_preferencia: completeProfile.horario_preferencia,
              orcamento: completeProfile.orcamento
            },
            quiz_treino: {
              experiencia: completeProfile.experiencia_treino,
              frequencia: completeProfile.frequencia_treino,
              objetivo: completeProfile.objetivo_treino,
              limitacoes: completeProfile.limitacoes_fisicas,
              preferencias: completeProfile.preferencias_treino,
              tempo_disponivel: completeProfile.tempo_disponivel
            }
          },
          timestamp: new Date().toISOString()
        };

        console.log('Enviando dados completos para webhook:', webhookPayload);

        const webhookResponse = await fetch('https://webhook.sv-02.botfai.com.br/webhook/1613f464-324c-494d-945a-efedd0a0dbd5', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });

        let webhookResult = null;
        if (webhookResponse.ok) {
          webhookResult = await webhookResponse.json();
          console.log('Dados enviados com sucesso para o webhook');
          
          // Marcar como enviado
          await supabase
            .from('user_complete_profile')
            .update({
              webhook_sent: true,
              webhook_sent_at: new Date().toISOString(),
              webhook_response: webhookResult
            })
            .eq('user_id', user.id);
            
          toast.success('Dados completos enviados com sucesso!');
        } else {
          console.error('Erro no webhook:', webhookResponse.statusText);
          toast.error('Erro ao enviar dados completos');
        }
      }
    } catch (error) {
      console.error('Erro ao enviar dados completos para webhook:', error);
    }
  };

  const sendToWebhook = async (data: QuizData): Promise<boolean> => {
    try {
      console.log('Quiz Treino: Enviando dados para webhook:', data);
      
      const webhookData = {
        user_id: user?.id,
        email: user?.email,
        quiz_type: 'treino',
        quiz_data: data,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('https://webhook.sv-02.botfai.com.br/webhook/1613f464-324c-494d-945a-efedd0a0dbd5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        console.log('Quiz Treino: Dados enviados para webhook com sucesso');
        return true;
      } else {
        console.error('Quiz Treino: Erro ao enviar para webhook:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Quiz Treino: Erro ao enviar para webhook:', error);
      return false;
    }
  };

  const saveQuizData = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('Quiz Treino: Salvando dados:', quizData);

      const { data: existingQuiz, error: checkError } = await supabase
        .from('user_quiz_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('quiz_type', 'treino')
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Quiz Treino: Erro ao verificar quiz existente:', checkError);
        return false;
      }

      let result;
      if (existingQuiz) {
        console.log('Quiz Treino: Atualizando quiz existente');
        result = await supabase
          .from('user_quiz_data')
          .update({
            quiz_data: quizData as any,
            updated_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('quiz_type', 'treino');
      } else {
        console.log('Quiz Treino: Criando novo quiz');
        result = await supabase
          .from('user_quiz_data')
          .insert({
            user_id: user.id,
            quiz_type: 'treino',
            quiz_data: quizData as any,
            completed_at: new Date().toISOString()
          });
      }

      if (result.error) {
        console.error('Quiz Treino: Erro ao salvar quiz:', result.error);
        return false;
      }

      // Atualizar perfil consolidado
      await updateCompleteProfile(quizData);

      // Verificar e enviar dados completos se necessário
      await sendCompleteDataToWebhook();

      try {
        await supabase.rpc('log_user_event', {
          p_user_id: user.id,
          p_event_type: 'quiz_treino_completed',
          p_event_data: quizData as any,
          p_table_reference: 'user_quiz_data'
        });
      } catch (logError) {
        console.warn('Quiz Treino: Erro ao registrar evento:', logError);
      }

      console.log('Quiz Treino: Quiz salvo com sucesso!');
      toast.success('Quiz de treino concluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Quiz Treino: Erro inesperado ao salvar quiz:', error);
      return false;
    }
  };

  const handleNext = async () => {
    if (!currentStep) return;

    const { campo, multipla } = currentStep;
    const value = quizData[campo];
    
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return;
    }

    if (currentPergunta < quizSteps.length) {
      navigate(`/quiz-treino/${currentPergunta + 1}`);
    } else {
      setIsSubmitting(true);
      try {
        const saved = await saveQuizData();
        if (saved) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Quiz Treino: Erro no processo final:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentPergunta > 1) {
      navigate(`/quiz-treino/${currentPergunta - 1}`);
    } else {
      navigate('/quiz-alimentar');
    }
  };

  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: gradients.background }}>
        <div className="text-center">
          <p className="text-red-500 mb-4">Pergunta não encontrada</p>
          <button 
            onClick={() => navigate('/quiz-treino/1')}
            className="text-pink-600 underline"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4" style={{ background: gradients.background }}>
      <div className="w-full max-w-2xl">
        
        {/* Header com progresso - COR AZUL BASA responsivo */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-blue-200/30 p-3 sm:p-6 mb-3 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                {currentStep.icon}
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-blue-700">
                  Quiz de Treino - Basa
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Pergunta {currentPergunta} de {quizSteps.length}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-gray-500">Completo</div>
            </div>
          </div>

          {/* Barra de progresso - COR AZUL responsiva */}
          <div className="w-full bg-blue-100 rounded-full h-2 sm:h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Conteúdo principal responsivo */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-blue-200/30 p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPergunta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 sm:space-y-8"
            >
              
              {/* Título da pergunta responsivo */}
              <div className="text-center space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 leading-tight">
                  {currentStep.titulo}
                </h2>
                <p className="text-gray-600 text-base sm:text-lg px-2">
                  {currentStep.subtitulo}
                </p>
                <div className="text-sm text-gray-500">
                  {isMultipleChoice ? '✨ Selecione todas que se aplicam' : '🎯 Escolha uma opção'}
                </div>
              </div>

              {/* Opções responsivas */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                {currentStep.opcoes.map((opcao, index) => {
                  const isSelected = isMultipleChoice
                    ? Array.isArray(currentValue) && currentValue.includes(opcao.id)
                    : currentValue === opcao.id;

                  return (
                    <motion.button
                      key={opcao.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(opcao.id)}
                      className={`relative group p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden min-h-[80px] sm:min-h-[100px] ${
                        isSelected
                          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      }`}
                      disabled={isSubmitting}
                    >
                      {/* Background gradient para opções selecionadas */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`absolute inset-0 bg-gradient-to-br ${opcao.color} opacity-10`}
                        />
                      )}
                      
                      <div className="relative flex items-center space-x-3 sm:space-x-4">
                        <div className={`text-2xl sm:text-3xl transform transition-transform duration-300 flex-shrink-0 ${
                          isSelected ? 'scale-110' : 'group-hover:scale-105'
                        }`}>
                          {opcao.emoji}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold text-base sm:text-lg mb-1 leading-tight ${
                            isSelected ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {opcao.texto}
                          </div>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            {opcao.subtexto}
                          </div>
                        </div>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-blue-500 flex-shrink-0"
                          >
                            <CheckCircle size={20} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Botões de navegação responsivos */}
        <div className="flex justify-between items-center mt-4 sm:mt-8 gap-3 sm:gap-4">
          <button
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300
                     text-gray-600 hover:text-gray-800 hover:bg-white/50 backdrop-blur-sm
                     disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 text-sm sm:text-base min-h-[48px]"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Voltar</span>
            <span className="sm:hidden">←</span>
          </button>

          <LoadingButton
            onClick={handleNext}
            loading={isSubmitting}
            disabled={!hasSelection}
            className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-medium
                     transition-all duration-300 shadow-lg flex-1 max-w-xs text-sm sm:text-base min-h-[48px]
                     ${hasSelection 
                       ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transform hover:scale-105 active:scale-95' 
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
          >
            <span className="text-center">
              {hasSelection 
                ? (currentPergunta === quizSteps.length ? 'Finalizar Quiz' : 'Continuar')
                : 'Selecione uma opção'
              }
            </span>
            {!isSubmitting && hasSelection && <ArrowRight size={16} />}
          </LoadingButton>
        </div>

        {/* Indicadores responsivos */}
        <div className="text-center mt-4 sm:mt-6 space-y-2">
          <div className="flex justify-center gap-1 sm:gap-2">
            {quizSteps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index + 1 <= currentPergunta 
                    ? 'bg-blue-400 w-6 sm:w-8' 
                    : 'bg-gray-300 w-1.5 sm:w-2'
                }`}
                animate={{
                  scale: index + 1 === currentPergunta ? 1.2 : 1
                }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 px-4">
            💪 Quiz de Treino - Basa • Próximo: Dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizTreino;
