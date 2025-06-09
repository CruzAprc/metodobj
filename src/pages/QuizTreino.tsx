
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Dumbbell, AlertCircle, Target, Clock, Users, Focus, Zap, HelpCircle, Sparkles } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const QuizTreino = () => {
  const navigate = useNavigate();
  const { pergunta } = useParams();
  const currentStep = parseInt(pergunta || '1');
  const { user } = useAuth();
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [customAnswer, setCustomAnswer] = useState<string>('');
  const [animatingStep, setAnimatingStep] = useState(false);

  const questions = [
    {
      id: 1,
      title: "Histórico de Lesões",
      emoji: "🏥",
      icon: <AlertCircle className="text-red-500" size={24} />,
      question: "Você já teve alguma lesão ou limitação física?",
      type: "single",
      options: [
        { id: 'nao', label: 'Não', color: 'green' },
        { id: 'joelho', label: 'Sim, no joelho', color: 'red' },
        { id: 'coluna', label: 'Sim, na coluna', color: 'red' },
        { id: 'ombro', label: 'Sim, no ombro', color: 'red' },
        { id: 'outra', label: 'Sim, em outra região', color: 'red', hasInput: true }
      ]
    },
    {
      id: 2,
      title: "Objetivo Principal",
      emoji: "🎯",
      icon: <Target className="text-purple-500" size={24} />,
      question: "Qual é seu objetivo principal com o treino?",
      type: "single",
      options: [
        { id: 'massa_muscular', label: 'Ganho de massa muscular', color: 'blue' },
        { id: 'emagrecimento', label: 'Emagrecimento / definição corporal', color: 'pink' },
        { id: 'condicionamento', label: 'Aumento do condicionamento físico', color: 'green' },
        { id: 'postura', label: 'Correção postural / alívio de dores', color: 'orange' },
        { id: 'bem_estar', label: 'Saúde e bem-estar geral', color: 'purple' }
      ]
    },
    {
      id: 3,
      title: "Tempo Disponível",
      emoji: "⏰",
      icon: <Clock className="text-blue-500" size={24} />,
      question: "Quanto tempo você tem disponível por sessão de treino?",
      type: "single",
      options: [
        { id: 'menos_30', label: 'Menos de 30 minutos', color: 'red' },
        { id: '30_45', label: 'De 30 a 45 minutos', color: 'orange' },
        { id: '45_60', label: 'De 45 minutos a 1 hora', color: 'green' },
        { id: 'mais_60', label: 'Mais de 1 hora', color: 'blue' }
      ]
    },
    {
      id: 4,
      title: "Frequência Semanal",
      emoji: "📅",
      icon: <Users className="text-green-500" size={24} />,
      question: "Quantos dias por semana você pode treinar?",
      type: "single",
      options: [
        { id: '1_2_dias', label: '1 a 2 dias', color: 'red' },
        { id: '3_4_dias', label: '3 a 4 dias', color: 'orange' },
        { id: '5_6_dias', label: '5 a 6 dias', color: 'green' },
        { id: 'todos_dias', label: 'Todos os dias', color: 'blue' }
      ]
    },
    {
      id: 5,
      title: "Nível de Experiência",
      emoji: "📈",
      icon: <Focus className="text-indigo-500" size={24} />,
      question: "Qual é seu nível atual de experiência com treinos?",
      type: "single",
      options: [
        { id: 'nunca', label: 'Nunca treinei / vou começar agora', color: 'red' },
        { id: 'pouco_tempo', label: 'Treino há pouco tempo (até 6 meses)', color: 'orange' },
        { id: 'mais_6_meses', label: 'Treino regularmente há mais de 6 meses', color: 'green' },
        { id: 'mais_1_ano', label: 'Treino há mais de 1 ano com frequência', color: 'blue' }
      ]
    },
    {
      id: 6,
      title: "Foco Corporal",
      emoji: "💪",
      icon: <Dumbbell className="text-pink-500" size={24} />,
      question: "Tem alguma área do corpo que você deseja dar mais atenção?",
      type: "single",
      options: [
        { id: 'bracos_ombros', label: 'Braços e ombros', color: 'purple' },
        { id: 'pernas_gluteos', label: 'Pernas e glúteos', color: 'pink' },
        { id: 'abdomen', label: 'Abdômen', color: 'orange' },
        { id: 'costas_postura', label: 'Costas e postura', color: 'blue' },
        { id: 'nenhuma', label: 'Nenhuma preferência específica', color: 'gray' }
      ]
    },
    {
      id: 7,
      title: "Intensidade Preferida",
      emoji: "⚡",
      icon: <Zap className="text-yellow-500" size={24} />,
      question: "Qual nível de intensidade você prefere?",
      type: "single",
      options: [
        { id: 'leve', label: 'Leve – quero começar devagar', color: 'green' },
        { id: 'moderado', label: 'Moderado – gosto de desafio na medida', color: 'orange' },
        { id: 'intenso', label: 'Intenso – quero treinos pesados e resultados rápidos', color: 'red' }
      ]
    },
    {
      id: 8,
      title: "Maior Desafio",
      emoji: "🤔",
      icon: <HelpCircle className="text-gray-500" size={24} />,
      question: "Qual seu maior desafio hoje?",
      type: "single",
      options: [
        { id: 'tempo', label: 'Falta de tempo', color: 'red' },
        { id: 'motivacao', label: 'Falta de motivação', color: 'orange' },
        { id: 'orientacao', label: 'Falta de orientação', color: 'blue' },
        { id: 'manter_constancia', label: 'Já tentei antes e não consegui manter', color: 'purple' },
        { id: 'nenhum', label: 'Nenhum – só quero um plano eficiente', color: 'green' }
      ]
    }
  ];

  const currentQuestion = questions[currentStep - 1];

  useEffect(() => {
    const savedData = localStorage.getItem('quizTreino');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAnswers(parsed);
      if (parsed[`pergunta${currentStep}`]) {
        setCustomAnswer(parsed[`pergunta${currentStep}`].custom || '');
      }
    }
  }, [currentStep]);

  const saveToDatabase = async (finalData: Record<string, any>) => {
    if (!user) return;

    try {
      const workoutData = {
        user_id: user.id,
        lesoes: finalData.pergunta1?.answer || '',
        lesao_especifica: finalData.pergunta1?.custom || null,
        objetivo: finalData.pergunta2?.answer || '',
        tempo_sessao: finalData.pergunta3?.answer || '',
        frequencia: finalData.pergunta4?.answer || '',
        experiencia: finalData.pergunta5?.answer || '',
        foco_regiao: finalData.pergunta6?.answer || '',
        intensidade: finalData.pergunta7?.answer || '',
        desafio: finalData.pergunta8?.answer || ''
      };

      const { data: existingData } = await supabase
        .from('teste_treino')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingData) {
        await supabase
          .from('teste_treino')
          .update(workoutData)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('teste_treino')
          .insert(workoutData);
      }

      await supabase
        .from('teste_app')
        .update({ quiz_treino_concluido: true })
        .eq('user_id', user.id);

      console.log('Dados de treino salvos no banco com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados de treino no banco:', error);
    }
  };

  const handleAnswer = (optionId: string) => {
    const newAnswers = {
      ...answers,
      [`pergunta${currentStep}`]: {
        answer: optionId,
        custom: optionId === 'outra' ? customAnswer : ''
      }
    };
    setAnswers(newAnswers);
    localStorage.setItem('quizTreino', JSON.stringify(newAnswers));
  };

  const handleContinue = async () => {
    const currentAnswer = answers[`pergunta${currentStep}`];
    if (!currentAnswer?.answer) {
      alert('Por favor, selecione uma resposta!');
      return;
    }
    
    if (currentAnswer.answer === 'outra' && !customAnswer.trim()) {
      alert('Por favor, especifique sua lesão!');
      return;
    }

    setAnimatingStep(true);
    
    setTimeout(async () => {
      if (currentStep < questions.length) {
        navigate(`/quiz-treino/${currentStep + 1}`);
      } else {
        await saveToDatabase(answers);
        localStorage.setItem('quizTreinoConcluido', 'true');
        navigate('/dashboard');
      }
      setAnimatingStep(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/quiz-treino/${currentStep - 1}`);
    } else {
      navigate('/quiz-alimentar/5');
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      green: isSelected ? 'border-green-400 bg-green-50 text-green-800' : 'border-gray-200 hover:border-green-300',
      blue: isSelected ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-gray-200 hover:border-blue-300',
      red: isSelected ? 'border-red-400 bg-red-50 text-red-800' : 'border-gray-200 hover:border-red-300',
      orange: isSelected ? 'border-orange-400 bg-orange-50 text-orange-800' : 'border-gray-200 hover:border-orange-300',
      purple: isSelected ? 'border-purple-400 bg-purple-50 text-purple-800' : 'border-gray-200 hover:border-purple-300',
      pink: isSelected ? 'border-pink-400 bg-pink-50 text-pink-800' : 'border-gray-200 hover:border-pink-300',
      yellow: isSelected ? 'border-yellow-400 bg-yellow-50 text-yellow-800' : 'border-gray-200 hover:border-yellow-300',
      gray: isSelected ? 'border-gray-400 bg-gray-50 text-gray-800' : 'border-gray-200 hover:border-gray-300'
    };
    return colors[color] || colors.gray;
  };

  if (!currentQuestion) {
    return <div>Pergunta não encontrada</div>;
  }

  const currentAnswer = answers[`pergunta${currentStep}`];
  const selectedAnswer = currentAnswer?.answer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* Header melhorado */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-pink-100 z-10">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          
          <div className="text-center">
            <h1 className="text-sm font-medium text-gray-700">Anamnese de Treino</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">Pergunta</span>
              <span className="text-sm font-bold text-pink-600">{currentStep}/8</span>
            </div>
          </div>
          
          <div className="w-8" />
        </div>
        
        {/* Barra de progresso */}
        <div className="px-4 pb-3">
          <div className="flex space-x-1">
            {questions.map((_, index) => (
              <div
                key={index + 1}
                className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                  index + 1 <= currentStep 
                    ? 'bg-gradient-to-r from-pink-400 to-pink-600' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 max-w-md mx-auto">
        
        {/* Título da pergunta */}
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 space-y-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto border border-purple-200 shadow-sm">
            {currentQuestion.icon}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">{currentQuestion.emoji}</span>
              <h2 className="text-xl font-bold text-gray-800">
                {currentQuestion.title}
              </h2>
            </div>
            
            <p className="text-gray-600 text-base leading-relaxed px-2">
              {currentQuestion.question}
            </p>
          </div>
        </motion.div>

        {/* Opções de resposta */}
        <motion.div 
          className="space-y-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option.id;
            
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option.id)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                  getColorClasses(option.color, isSelected)
                } ${isSelected ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? `border-${option.color}-500 bg-${option.color}-500` 
                      : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                  
                  <span className={`font-medium transition-colors ${
                    isSelected ? '' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                </div>
                
                {/* Campo de input adicional se necessário */}
                {option.hasInput && isSelected && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    type="text"
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                    placeholder="Especifique a região..."
                    className="w-full mt-3 p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Botão continuar */}
        <motion.button
          onClick={handleContinue}
          disabled={!selectedAnswer || animatingStep}
          whileHover={{ scale: selectedAnswer ? 1.02 : 1 }}
          whileTap={{ scale: selectedAnswer ? 0.98 : 1 }}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            !selectedAnswer
              ? 'bg-gray-300 cursor-not-allowed'
              : animatingStep
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 hover:shadow-xl'
          }`}
        >
          {animatingStep ? (
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              <Sparkles size={18} />
              <span>{currentStep === questions.length ? 'Finalizar' : 'Próxima Pergunta'}</span>
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
        
        {/* Informação de progresso */}
        <p className="text-center text-xs text-gray-500 mt-4">
          💪 Pergunta {currentStep} de {questions.length} - Você está indo muito bem!
        </p>

      </div>
    </div>
  );
};

export default QuizTreino;
