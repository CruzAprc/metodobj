import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Dumbbell, Target, Clock, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const QuizTreino = () => {
  const navigate = useNavigate();
  const { pergunta } = useParams();
  const { user } = useAuth();
  const [currentPergunta, setCurrentPergunta] = useState(1);
  const [respostas, setRespostas] = useState({});
  const [errors, setErrors] = useState({});

  // Usar parâmetro da URL ou padrão
  useEffect(() => {
    if (pergunta) {
      setCurrentPergunta(Number(pergunta));
    }
  }, [pergunta]);

  const handleInputChange = (pergunta: number, value: string) => {
    setRespostas(prev => ({ ...prev, [pergunta]: value }));
    if (errors[pergunta]) {
      setErrors(prev => ({ ...prev, [pergunta]: '' }));
    }
  };

  const validatePergunta = (pergunta: number): boolean => {
    const newErrors: any = {};

    switch (pergunta) {
      case 1:
        if (!respostas[1]) {
          newErrors[1] = 'Por favor, selecione seu nível de experiência! 💪';
        }
        break;
      case 2:
        if (!respostas[2]) {
          newErrors[2] = 'Por favor, selecione seu objetivo principal! 🎯';
        }
        break;
      case 3:
        if (!respostas[3]) {
          newErrors[3] = 'Por favor, selecione a frequência semanal de treino! ⏱️';
        }
        break;
      case 4:
        if (!respostas[4]) {
          newErrors[4] = 'Por favor, selecione seu tipo de treino preferido! ⚡';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToDatabase = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('teste_app')
        .update({
          quiz_treino: respostas,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao salvar respostas do quiz de treino:', error);
        return false;
      }

      console.log('Respostas do quiz de treino salvas com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao salvar respostas do quiz de treino:', error);
      return false;
    }
  };

  const handleNext = async () => {
    if (validatePergunta(currentPergunta)) {
      if (currentPergunta < 4) {
        const nextPergunta = currentPergunta + 1;
        setCurrentPergunta(nextPergunta);
        navigate(`/quiz-treino/${nextPergunta}`);
      } else {
        // Finalizar quiz
        console.log('Respostas do quiz treino:', respostas);
        const saved = await saveToDatabase();
        if (saved) {
          localStorage.setItem('quizTreino', JSON.stringify(respostas));
          navigate('/dashboard');
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentPergunta > 1) {
      const prevPergunta = currentPergunta - 1;
      setCurrentPergunta(prevPergunta);
      navigate(`/quiz-treino/${prevPergunta}`);
    } else {
      navigate('/quiz-alimentar/4');
    }
  };

  const perguntas = [
    {
      id: 1,
      icon: <Dumbbell size={32} className="text-red-500" />,
      title: "Qual é o seu nível de experiência com treinos?",
      subtitle: "Seja sincera para personalizarmos seu treino! 💪",
      options: [
        { value: 'iniciante', label: 'Iniciante' },
        { value: 'intermediario', label: 'Intermediário' },
        { value: 'avancado', label: 'Avançado' }
      ]
    },
    {
      id: 2,
      icon: <Target size={32} className="text-orange-500" />,
      title: "Qual é o seu objetivo principal?",
      subtitle: "Defina sua meta para focarmos no resultado! 🎯",
      options: [
        { value: 'emagrecimento', label: 'Emagrecimento' },
        { value: 'hipertrofia', label: 'Hipertrofia' },
        { value: 'definicao', label: 'Definição' },
        { value: 'resistencia', label: 'Resistência' }
      ]
    },
    {
      id: 3,
      icon: <Clock size={32} className="text-yellow-500" />,
      title: "Com que frequência você pretende treinar por semana?",
      subtitle: "Seja realista para criarmos um plano sustentável! ⏱️",
      options: [
        { value: '1-2', label: '1-2 vezes' },
        { value: '3-4', label: '3-4 vezes' },
        { value: '5+', label: '5+ vezes' }
      ]
    },
    {
      id: 4,
      icon: <Zap size={32} className="text-lime-500" />,
      title: "Qual tipo de treino você mais gosta?",
      subtitle: "Escolha algo que te motive a continuar! ⚡",
      options: [
        { value: 'musculacao', label: 'Musculação' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'funcional', label: 'Funcional' },
        { value: 'yoga', label: 'Yoga' }
      ]
    }
  ];

  const currentPerguntaData = perguntas[currentPergunta - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Ilustrações de fundo */}
      <div className="absolute top-20 right-10 opacity-10 hidden md:block">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center">
          <span className="text-3xl">💪</span>
        </div>
      </div>
      
      <div className="absolute bottom-20 left-10 opacity-10 hidden md:block">
        <div className="w-20 h-20 bg-gradient-to-br from-lime-300 to-lime-400 rounded-full flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
      </div>

      {/* Card principal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-200/50 p-8 relative"
      >
        
        {/* Progress bar */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((pergunta) => (
              <motion.div
                key={pergunta}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  pergunta <= currentPergunta 
                    ? 'bg-gradient-to-r from-blue-400 to-blue-500' 
                    : 'bg-gray-200'
                }`}
                animate={{
                  scale: pergunta === currentPergunta ? 1.2 : 1
                }}
              />
            ))}
          </div>
        </div>

        {/* Ícone animado */}
        <motion.div 
          key={currentPergunta}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center border border-blue-200">
            {currentPerguntaData.icon}
          </div>
        </motion.div>

        {/* Conteúdo da pergunta */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPergunta}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6"
          >
            {/* Título */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentPerguntaData.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {currentPerguntaData.subtitle}
              </p>
            </div>

            {/* Opções */}
            <div className="space-y-3">
              {currentPerguntaData.options.map((option) => (
                <motion.button
                  key={option.value}
                  className={`w-full px-6 py-4 rounded-2xl text-lg font-medium
                              bg-blue-50/60 border-2 transition-all duration-300
                              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300
                              ${respostas[currentPergunta] === option.value
                                ? 'bg-blue-200 border-blue-300 text-blue-800 shadow-md'
                                : 'border-blue-200/50 text-gray-700 hover:bg-blue-100'
                              }
                              ${errors[currentPergunta] ? 'border-red-300 bg-red-50/30' : ''}`}
                  onClick={() => handleInputChange(currentPergunta, option.value)}
                >
                  {option.label}
                </motion.button>
              ))}
              
              {/* Mensagem de erro */}
              <AnimatePresence>
                {errors[currentPergunta] && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
                  >
                    {errors[currentPergunta]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botões de navegação */}
        <div className="flex justify-between items-center mt-8 space-x-4">
          <button
            onClick={handlePrevious}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all
                     text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium
                     bg-gradient-to-r from-blue-500 to-blue-600 text-white
                     hover:from-blue-600 hover:to-blue-700 
                     transform hover:scale-105 active:scale-95
                     transition-all duration-300 shadow-lg"
          >
            <span>{currentPergunta === 4 ? 'Finalizar' : 'Continuar'}</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Indicador de pergunta */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Pergunta {currentPergunta} de 4
          </p>
        </div>
      </motion.div>

      {/* Mensagem motivacional */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-500 text-sm mt-6 max-w-md"
      >
        Estamos quase lá! Suas escolhas nos ajudarão a criar o treino perfeito para você! 💪
      </motion.p>
    </div>
  );
};

export default QuizTreino;
