
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Dumbbell } from 'lucide-react';

const LoadingTreino = () => {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [userName, setUserName] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  // PRIMEIRA PRIORIDADE ABSOLUTA: IMAGEM
  useEffect(() => {
    const imageUrl = "/lovable-uploads/f85d4059-57d5-4753-a12e-639ca86ca889.png";
    
    // 1. PRELOAD CRÍTICO IMEDIATO - MÁXIMA PRIORIDADE
    const criticalPreload = document.createElement('link');
    criticalPreload.rel = 'preload';
    criticalPreload.as = 'image';
    criticalPreload.href = imageUrl;
    criticalPreload.fetchPriority = 'high';
    criticalPreload.crossOrigin = 'anonymous';
    // Insere no topo absoluto do head
    document.head.insertBefore(criticalPreload, document.head.firstChild);
    
    // 2. CARREGAMENTO INSTANTÂNEO VIA IMAGE
    const img = new Image();
    img.fetchPriority = 'high';
    img.loading = 'eager';
    img.decoding = 'sync';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageLoaded(true);
      console.log('Imagem do personal trainer carregada INSTANTANEAMENTE');
    };
    img.src = imageUrl;
    
    // 3. MÚLTIPLOS PRELOADS PARA GARANTIR
    for (let i = 0; i < 5; i++) {
      const extraImg = new Image();
      extraImg.fetchPriority = 'high';
      extraImg.loading = 'eager';
      extraImg.src = imageUrl;
    }

    return () => {
      if (document.head.contains(criticalPreload)) {
        document.head.removeChild(criticalPreload);
      }
    };
  }, []);

  // Recuperar o nome do usuário APÓS a imagem
  useEffect(() => {
    // Delay mínimo para garantir que a imagem tenha prioridade
    const timer = setTimeout(() => {
      const dadosPessoais = localStorage.getItem('dadosPessoais');
      if (dadosPessoais) {
        const dados = JSON.parse(dadosPessoais);
        setUserName(dados.nomeCompleto.split(' ')[0]);
      }
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const messages = [
    "Juju está preparando sua anamnese de treino...",
    "Criando o questionário perfeito para seus objetivos...",
    "Quase pronto! Montando sua avaliação personalizada...",
    `Vamos começar sua anamnese de treino ${userName}!`
  ];

  useEffect(() => {
    const intervals = [2000, 2000, 2000, 1500];
    
    const timer = setTimeout(() => {
      if (currentMessage < messages.length - 1) {
        setCurrentMessage(currentMessage + 1);
      } else {
        setTimeout(() => {
          navigate('/quiz-treino/1');
        }, 1000);
      }
    }, intervals[currentMessage]);

    return () => clearTimeout(timer);
  }, [currentMessage, navigate, userName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* IMAGEM PRINCIPAL - RENDERIZAÇÃO PRIORITÁRIA ABSOLUTA */}
      <div className="mb-8 relative" style={{ willChange: 'transform', contain: 'layout style paint' }}>
        <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl p-4">
          <img 
            src="/lovable-uploads/f85d4059-57d5-4753-a12e-639ca86ca889.png" 
            alt="Personal Trainer - Método BJ" 
            className="w-full h-full object-contain"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            crossOrigin="anonymous"
            onLoad={() => setImageLoaded(true)}
            style={{
              contentVisibility: 'visible',
              containIntrinsicSize: '192px 192px',
              imageRendering: 'crisp-edges',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)'
            }}
          />
          
          {/* Fallback APENAS se imagem não carregou */}
          {!imageLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">BJ</span>
            </div>
          )}
        </div>
      </div>

      {/* APENAS APÓS IMAGEM: Container das mensagens */}
      {imageLoaded && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center space-y-6 max-w-md mx-auto"
        >
          
          {/* Saudação com nome */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Agora vamos para o treino, <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                {userName}!
              </span>
            </h1>
          </div>

          {/* Área das mensagens */}
          <div className="min-h-[80px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
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
                    ? 'bg-gradient-to-r from-blue-400 to-blue-500 w-8' 
                    : 'bg-gray-200 w-2'
                }`}
                animate={{
                  scale: index === currentMessage ? 1.1 : 1
                }}
              />
            ))}
          </div>

          {/* Loading spinner */}
          <div className="flex justify-center mt-6">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse border-t-blue-300"></div>
            </div>
          </div>

          {/* Mensagem motivacional */}
          <p className="text-sm text-gray-500 mt-6 px-4">
            💪 Preparando sua anamnese de treino personalizada!
          </p>

        </motion.div>
      )}

      {/* ELEMENTOS DECORATIVOS - APENAS APÓS IMAGEM */}
      {imageLoaded && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 0.3 }}
            className="absolute top-20 right-10 animate-pulse"
          >
            <Sparkles size={40} className="text-blue-400" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-20 left-10 animate-pulse"
          >
            <Dumbbell size={35} className="text-indigo-400" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-1/3 left-1/4 animate-pulse"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full" />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default LoadingTreino;
