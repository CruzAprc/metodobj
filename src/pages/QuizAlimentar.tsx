
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface QuizData {
  objetivo: string;
  restricoes: string[];
  preferencias: string[];
  experiencia: string;
  suplementos: string[];
}

const quizSteps = [
  {
    etapa: '1',
    pergunta: 'Qual é o seu principal objetivo?',
    opcoes: [
      { id: 'perder_peso', texto: 'Perder peso e definir', emoji: '🔥' },
      { id: 'ganhar_massa', texto: 'Ganhar massa muscular', emoji: '💪' },
      { id: 'manter_peso', texto: 'Manter o peso atual', emoji: '⚖️' },
      { id: 'melhorar_saude', texto: 'Melhorar saúde geral', emoji: '❤️' }
    ],
    campo: 'objetivo' as keyof QuizData
  },
  {
    etapa: '2',
    pergunta: 'Você tem alguma restrição alimentar?',
    opcoes: [
      { id: 'nenhuma', texto: 'Nenhuma restrição', emoji: '✅' },
      { id: 'vegetariano', texto: 'Vegetariano', emoji: '🥗' },
      { id: 'vegano', texto: 'Vegano', emoji: '🌱' },
      { id: 'gluten', texto: 'Sem glúten', emoji: '🚫' },
      { id: 'lactose', texto: 'Sem lactose', emoji: '🥛' },
      { id: 'diabetes', texto: 'Diabetes', emoji: '🩺' }
    ],
    campo: 'restricoes' as keyof QuizData,
    multipla: true
  },
  {
    etapa: '3',
    pergunta: 'Quais são suas preferências alimentares?',
    opcoes: [
      { id: 'pratico', texto: 'Refeições práticas', emoji: '⚡' },
      { id: 'caseiro', texto: 'Comida caseira', emoji: '🏠' },
      { id: 'variado', texto: 'Cardápio variado', emoji: '🌈' },
      { id: 'economico', texto: 'Opções econômicas', emoji: '💰' },
      { id: 'gourmet', texto: 'Pratos elaborados', emoji: '👨‍🍳' }
    ],
    campo: 'preferencias' as keyof QuizData,
    multipla: true
  },
  {
    etapa: '4',
    pergunta: 'Qual sua experiência com dietas?',
    opcoes: [
      { id: 'primeira_vez', texto: 'Primeira vez', emoji: '🆕' },
      { id: 'alguma_experiencia', texto: 'Alguma experiência', emoji: '📚' },
      { id: 'experiente', texto: 'Muito experiente', emoji: '🎯' },
      { id: 'profissional', texto: 'Já sou da área', emoji: '👨‍⚕️' }
    ],
    campo: 'experiencia' as keyof QuizData
  },
  {
    etapa: '5',
    pergunta: 'Você toma algum suplemento?',
    opcoes: [
      { id: 'nenhum', texto: 'Não tomo nenhum', emoji: '❌' },
      { id: 'whey', texto: 'Whey Protein', emoji: '🥤' },
      { id: 'creatina', texto: 'Creatina', emoji: '⚡' },
      { id: 'multivitaminico', texto: 'Multivitamínico', emoji: '💊' },
      { id: 'omega3', texto: 'Ômega 3', emoji: '🐟' },
      { id: 'outros', texto: 'Outros', emoji: '📋' }
    ],
    campo: 'suplementos' as keyof QuizData,
    multipla: true
  }
];

const QuizAlimentar = () => {
  const navigate = useNavigate();
  const { etapa } = useParams<{ etapa: string }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizData, setQuizData] = useState<QuizData>({
    objetivo: '',
    restricoes: [],
    preferencias: [],
    experiencia: '',
    suplementos: []
  });

  const currentEtapa = parseInt(etapa || '1');
  const currentStep = quizSteps.find(step => parseInt(step.etapa) === currentEtapa);

  // Verificar se o usuário já preencheu o quiz alimentar
  useEffect(() => {
    const checkExistingQuizData = async () => {
      if (!user) return;

      try {
        console.log('Verificando se usuário já preencheu quiz alimentar...');
        
        const { data: existingQuiz, error } = await supabase
          .from('user_quiz_data')
          .select('*')
          .eq('user_id', user.id)
          .eq('quiz_type', 'alimentar')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao verificar quiz existente:', error);
          return;
        }

        if (existingQuiz) {
          console.log('Quiz alimentar já preenchido, redirecionando para dashboard...');
          navigate('/dashboard');
          return;
        }

        console.log('Quiz alimentar não encontrado, usuário pode preencher');
      } catch (error) {
        console.error('Erro inesperado ao verificar quiz:', error);
      }
    };

    checkExistingQuizData();
  }, [user, navigate]);

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

  const saveQuizData = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      console.log('Salvando dados do quiz alimentar:', quizData);

      const { data: existingQuiz, error: checkError } = await supabase
        .from('user_quiz_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('quiz_type', 'alimentar')
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Erro ao verificar quiz existente:', checkError);
        return false;
      }

      let result;
      if (existingQuiz) {
        result = await supabase
          .from('user_quiz_data')
          .update({
            quiz_data: quizData as any,
            updated_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('quiz_type', 'alimentar');
      } else {
        result = await supabase
          .from('user_quiz_data')
          .insert({
            user_id: user.id,
            quiz_type: 'alimentar',
            quiz_data: quizData as any,
            completed_at: new Date().toISOString()
          });
      }

      if (result.error) {
        console.error('Erro ao salvar quiz:', result.error);
        return false;
      }

      try {
        await supabase.rpc('log_user_event', {
          p_user_id: user.id,
          p_event_type: 'quiz_alimentar_completed',
          p_event_data: quizData as any,
          p_table_reference: 'user_quiz_data'
        });
      } catch (logError) {
        console.warn('Erro ao registrar evento:', logError);
      }

      console.log('Quiz alimentar salvo com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado ao salvar quiz:', error);
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

    if (currentEtapa < quizSteps.length) {
      navigate(`/quiz-alimentar/${currentEtapa + 1}`);
    } else {
      setIsSubmitting(true);
      try {
        const saved = await saveQuizData();
        if (saved) {
          navigate('/quiz-treino/1');
        }
      } catch (error) {
        console.error('Erro no processo final:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentEtapa > 1) {
      navigate(`/quiz-alimentar/${currentEtapa - 1}`);
    } else {
      navigate('/dados-pessoais');
    }
  };

  if (!currentStep) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Etapa não encontrada</p>
          <button 
            onClick={() => navigate('/quiz-alimentar/1')}
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
                  index + 1 <= currentEtapa 
                    ? 'bg-blue-600 w-6' 
                    : 'bg-slate-300 w-2'
                }`}
                animate={{
                  scale: index + 1 === currentEtapa ? 1.2 : 1
                }}
              />
            ))}
          </div>
        </div>

        {/* Conteúdo do quiz */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEtapa}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Título */}
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                {currentStep.pergunta}
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
                : currentEtapa === quizSteps.length 
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
            Etapa {currentEtapa} de {quizSteps.length} - Quiz Alimentar
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizAlimentar;
