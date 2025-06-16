import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
    opcoes: [
      { id: 'iniciante', texto: 'Iniciante (nunca treinei)', emoji: '🆕' },
      { id: 'basico', texto: 'Básico (menos de 6 meses)', emoji: '📚' },
      { id: 'intermediario', texto: 'Intermediário (6 meses - 2 anos)', emoji: '💪' },
      { id: 'avancado', texto: 'Avançado (mais de 2 anos)', emoji: '🏆' }
    ],
    campo: 'experiencia' as keyof QuizData
  },
  {
    pergunta: 2,
    titulo: 'Quantas vezes por semana você pode treinar?',
    opcoes: [
      { id: '2_vezes', texto: '2 vezes por semana', emoji: '✌️' },
      { id: '3_vezes', texto: '3 vezes por semana', emoji: '🔥' },
      { id: '4_vezes', texto: '4 vezes por semana', emoji: '💪' },
      { id: '5_mais', texto: '5 ou mais vezes', emoji: '🚀' }
    ],
    campo: 'frequencia' as keyof QuizData
  },
  {
    pergunta: 3,
    titulo: 'Qual seu principal objetivo no treino?',
    opcoes: [
      { id: 'ganhar_massa', texto: 'Ganhar massa muscular', emoji: '💪' },
      { id: 'definir', texto: 'Definição muscular', emoji: '✨' },
      { id: 'forca', texto: 'Ganhar força', emoji: '🏋️' },
      { id: 'hipertrofia', texto: 'Hipertrofia', emoji: '💥' }
    ],
    campo: 'objetivo' as keyof QuizData
  },
  {
    pergunta: 4,
    titulo: 'Você tem alguma limitação física?',
    opcoes: [
      { id: 'nenhuma', texto: 'Nenhuma limitação', emoji: '✅' },
      { id: 'joelho', texto: 'Problemas no joelho', emoji: '🦵' },
      { id: 'costas', texto: 'Problemas nas costas', emoji: '🔄' },
      { id: 'ombro', texto: 'Problemas no ombro', emoji: '🤷' },
      { id: 'outras', texto: 'Outras limitações', emoji: '⚠️' }
    ],
    campo: 'limitacoes' as keyof QuizData,
    multipla: true
  },
  {
    pergunta: 5,
    titulo: 'Que tipo de treino de musculação você prefere?',
    opcoes: [
      { id: 'musculacao_tradicional', texto: 'Musculação tradicional', emoji: '🏋️' },
      { id: 'powerlifting', texto: 'Powerlifting', emoji: '💪' },
      { id: 'bodybuilding', texto: 'Bodybuilding', emoji: '🏆' },
      { id: 'hiit_muscular', texto: 'HIIT com pesos', emoji: '🔥' }
    ],
    campo: 'preferencias' as keyof QuizData,
    multipla: true
  },
  {
    pergunta: 6,
    titulo: 'Quanto tempo você tem por treino?',
    opcoes: [
      { id: '30_min', texto: '30 minutos', emoji: '⏰' },
      { id: '45_min', texto: '45 minutos', emoji: '⏱️' },
      { id: '60_min', texto: '1 hora', emoji: '🕐' },
      { id: '90_min', texto: '1h30 ou mais', emoji: '⏳' }
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

  // Verificar se o usuário já preencheu o quiz de treino
  useEffect(() => {
    const checkExistingQuizData = async () => {
      if (!user) {
        console.log('Quiz Treino: Usuário não logado');
        setIsCheckingExisting(false);
        return;
      }

      try {
        console.log('Quiz Treino: Verificando se usuário já preencheu quiz...', {
          userId: user.id,
          email: user.email
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
          errorCode: error?.code
        });

        if (error && error.code !== 'PGRST116') {
          console.error('Quiz Treino: Erro ao verificar quiz existente:', error);
          setIsCheckingExisting(false);
          return;
        }

        if (existingQuiz) {
          console.log('Quiz Treino: Quiz já preenchido! Dados:', existingQuiz);
          console.log('Quiz Treino: Redirecionando para dashboard...');
          navigate('/dashboard');
          return;
        }

        console.log('Quiz Treino: Quiz não encontrado, usuário pode preencher');
        setIsCheckingExisting(false);
      } catch (error) {
        console.error('Quiz Treino: Erro inesperado ao verificar quiz:', error);
        setIsCheckingExisting(false);
      }
    };

    checkExistingQuizData();
  }, [user, navigate]);

  // Mostrar loading enquanto verifica dados existentes
  if (isCheckingExisting) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando seus dados...</p>
        </div>
      </div>
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

      // Enviar dados para o webhook após salvar com sucesso
      await sendToWebhook(quizData);

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
      navigate('/quiz-alimentar/5');
    }
  };

  if (!currentStep) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Pergunta não encontrada</p>
          <button 
            onClick={() => navigate('/quiz-treino/1')}
            className="text-blue-600 underline"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const isMultipleChoice = currentStep.multipla;
  const currentValue = quizData[currentStep.campo];
  const hasSelection = isMultipleChoice 
    ? Array.isArray(currentValue) && currentValue.length > 0
    : currentValue !== '';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Progress bar */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex space-x-2">
            {quizSteps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index + 1 <= currentPergunta 
                    ? 'bg-blue-600 w-6' 
                    : 'bg-slate-300 w-2'
                }`}
                animate={{
                  scale: index + 1 === currentPergunta ? 1.2 : 1
                }}
              />
            ))}
          </div>
        </div>

        {/* Conteúdo do quiz */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPergunta}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Título */}
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                {currentStep.titulo}
              </h2>
              <p className="text-slate-600 text-sm">
                {isMultipleChoice ? 'Selecione todas que se aplicam:' : 'Escolha uma opção:'}
              </p>
            </div>

            {/* Opções */}
            <div className="space-y-3">
              {currentStep.opcoes.map((opcao) => {
                const isSelected = isMultipleChoice
                  ? Array.isArray(currentValue) && currentValue.includes(opcao.id)
                  : currentValue === opcao.id;

                return (
                  <motion.button
                    key={opcao.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(opcao.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{opcao.emoji}</span>
                      <span className="font-medium flex-1">{opcao.texto}</span>
                      {isSelected && <CheckCircle size={20} className="text-blue-600" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botões de navegação */}
        <div className="flex justify-between items-center mt-8 space-x-4">
          <button
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all
                     text-slate-600 hover:text-slate-800 hover:bg-slate-100
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!hasSelection || isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium
                     bg-gradient-to-r from-blue-600 to-blue-800 text-white
                     hover:from-blue-700 hover:to-blue-900 
                     transform hover:scale-105 active:scale-95
                     transition-all duration-300 shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span>
              {isSubmitting 
                ? 'Salvando...' 
                : currentPergunta === quizSteps.length 
                  ? 'Finalizar' 
                  : 'Continuar'
              }
            </span>
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </div>

        {/* Indicador de etapa */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Pergunta {currentPergunta} de {quizSteps.length} - Quiz Musculação
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizTreino;
