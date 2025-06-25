import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Dumbbell } from 'lucide-react';

interface LoadingAnimationProps {
  type: 'dieta' | 'treino';
  userName?: string;
  redirectTo: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  type, 
  userName = '', 
  redirectTo 
}) => {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(0);

  const config = {
    dieta: {
      emoji: '👩‍⚕️',
      colors: {
        gradient: 'from-pink-50 via-white to-purple-50',
        card: 'from-pink-400 to-pink-600',
        accent: 'from-pink-500 to-pink-600',
        spinner: 'border-pink-200 border-t-pink-500',
        progress: 'from-pink-400 to-pink-500',
        decorative: 'from-pink-300 to-pink-400'
      },
      messages: [
        "Juju está preparando sua anamnese...",
        "Montando o questionário perfeito para você...",
        "Quase pronto! Preparando sua experiência personalizada...",
        `Vamos começar ${userName}!`
      ],
      icons: {
        primary: Sparkles,
        secondary: Heart
      }
    },
    treino: {
      emoji: '💪🏻',
      colors: {
        gradient: 'from-blue-50 via-white to-indigo-50',
        card: 'from-blue-400 to-blue-600',
        accent: 'from-blue-500 to-blue-600',
        spinner: 'border-blue-200 border-t-blue-500',
        progress: 'from-blue-400 to-blue-500',
        decorative: 'from-blue-300 to-blue-400'
      },
      messages: [
        "Basa está montando sua anamnese de treino...",
        "Criando o questionário perfeito para seus objetivos...",
        "Quase pronto! Montando sua avaliação personalizada...",
        `Vamos começar sua anamnese de treino ${userName}!`
      ],
      icons: {
        primary: Sparkles,
        secondary: Dumbbell
      }
    }
  };

  const currentConfig = config[type];
  const { emoji, colors, messages, icons } = currentConfig;
  const PrimaryIcon = icons.primary;
  const SecondaryIcon = icons.secondary;

  useEffect(() => {
    const intervals = [2000, 2000, 2000, 1500];
    
    const timer = setTimeout(() => {
      if (currentMessage < messages.length - 1) {
        setCurrentMessage(currentMessage + 1);
      } else {
        setTimeout(() => {
          navigate(redirectTo);
        }, 1000);
      }
    }, intervals[currentMessage]);

    return () => clearTimeout(timer);
  }, [currentMessage, navigate, userName, redirectTo, messages.length]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradient} flex flex-col justify-center items-center p-4 relative overflow-hidden`}>
      
      {/* EMOJI PRINCIPAL */}
      <div className="mb-8 relative">
        <div className={`w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br ${colors.card} rounded-3xl flex items-center justify-center shadow-2xl`}>
          <div className="text-8xl sm:text-9xl">{emoji}</div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-center space-y-6 max-w-md mx-auto"
      >
        
        {/* Saudação com nome */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {type === 'dieta' ? (
              <>
                Olá, <span className={`bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                  {userName}!
                </span>
              </>
            ) : (
              <>
                Agora vamos para o treino, <span className={`bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                  {userName}!
                </span>
              </>
            )}
          </h1>
        </motion.div>

        {/* Área das mensagens */}
        <div className="min-h-[80px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed px-4">
                {messages[currentMessage]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicador de progresso */}
        <div className="flex justify-center space-x-2 mt-8">
          {messages.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= currentMessage 
                  ? `bg-gradient-to-r ${colors.progress} w-8`
                  : 'bg-gray-200 w-2'
              }`}
              animate={{
                scale: index === currentMessage ? 1.1 : 1
              }}
            />
          ))}
        </div>

        {/* Loading spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-6"
        >
          <div className="relative">
            <div className={`w-12 h-12 border-4 ${colors.spinner} rounded-full animate-spin`}></div>
            <div className={`absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse ${colors.spinner.replace('border-t-', 'border-t-').replace('-500', '-300')}`}></div>
          </div>
        </motion.div>

        {/* Mensagem motivacional */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-500 mt-6 px-4"
        >
          {type === 'dieta' 
            ? '✨ Estamos personalizando tudo especialmente para você!'
            : '💪 Preparando sua anamnese de treino personalizada!'
          }
        </motion.p>

      </motion.div>

      {/* ELEMENTOS DECORATIVOS */}
      <div className="absolute top-20 right-10 opacity-20 animate-pulse">
        <PrimaryIcon size={40} className={`text-${type === 'dieta' ? 'pink' : 'blue'}-400`} />
      </div>
      <div className="absolute bottom-20 left-10 opacity-20 animate-pulse delay-1000">
        <SecondaryIcon size={35} className={`text-${type === 'dieta' ? 'purple' : 'indigo'}-400`} />
      </div>
      <div className="absolute top-1/3 left-1/4 opacity-10 animate-pulse delay-500">
        <div className={`w-12 h-12 bg-gradient-to-br ${colors.decorative} rounded-full`} />
      </div>
    </div>
  );
};

export default LoadingAnimation; 