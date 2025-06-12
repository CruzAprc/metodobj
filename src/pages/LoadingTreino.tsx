
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Dumbbell } from 'lucide-react';

const LoadingTreino = () => {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [userName, setUserName] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Recuperar o nome do usuário do localStorage
  useEffect(() => {
    const dadosPessoais = localStorage.getItem('dadosPessoais');
    if (dadosPessoais) {
      const dados = JSON.parse(dadosPessoais);
      setUserName(dados.nomeCompleto.split(' ')[0]); // Pega apenas o primeiro nome
    }
  }, []);

  // SUPER AGRESSIVO: Preload instantâneo da imagem - PRIORIDADE MÁXIMA
  useEffect(() => {
    const imageUrl = "/lovable-uploads/f85d4059-57d5-4753-a12e-639ca86ca889.png";
    
    // 1. Preload crítico no head com prioridade máxima
    const criticalPreload = document.createElement('link');
    criticalPreload.rel = 'preload';
    criticalPreload.as = 'image';
    criticalPreload.href = imageUrl;
    criticalPreload.fetchPriority = 'high';
    criticalPreload.crossOrigin = 'anonymous';
    document.head.insertBefore(criticalPreload, document.head.firstChild);
    
    // 2. Prefetch adicional para cache
    const prefetch = document.createElement('link');
    prefetch.rel = 'prefetch';
    prefetch.href = imageUrl;
    prefetch.fetchPriority = 'high';
    document.head.appendChild(prefetch);
    
    // 3. Cache agressivo via Image com múltiplas instâncias
    for (let i = 0; i < 3; i++) {
      const img = new Image();
      img.fetchPriority = 'high';
      img.loading = 'eager';
      img.decoding = 'sync';
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImageLoaded(true);
        console.log(`Imagem do personal trainer carregada - instância ${i + 1}`);
      };
      img.src = imageUrl;
    }
    
    // 4. Força o browser a priorizar esta imagem
    const xhr = new XMLHttpRequest();
    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      console.log('Imagem pré-carregada via XHR');
    };
    xhr.send();

    // 5. Service Worker cache se disponível
    if ('caches' in window) {
      caches.open('image-cache-v1').then(cache => {
        cache.add(imageUrl).then(() => {
          console.log('Imagem cached via Service Worker');
        });
      });
    }

    return () => {
      [criticalPreload, prefetch].forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);

  const messages = [
    "Juju está preparando sua anamnese de treino...",
    "Criando o questionário perfeito para seus objetivos...",
    "Quase pronto! Montando sua avaliação personalizada...",
    `Vamos começar sua anamnese de treino ${userName}!`
  ];

  useEffect(() => {
    const intervals = [2000, 2000, 2000, 1500]; // Duração de cada mensagem
    
    const timer = setTimeout(() => {
      if (currentMessage < messages.length - 1) {
        setCurrentMessage(currentMessage + 1);
      } else {
        // Após a última mensagem, navegar para o quiz de treino
        setTimeout(() => {
          navigate('/quiz-treino/1');
        }, 1000);
      }
    }, intervals[currentMessage]);

    return () => clearTimeout(timer);
  }, [currentMessage, navigate, userName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-20 right-10 opacity-20 animate-pulse">
        <Sparkles size={40} className="text-blue-400" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-20 animate-pulse delay-1000">
        <Dumbbell size={35} className="text-indigo-400" />
      </div>
      <div className="absolute top-1/3 left-1/4 opacity-10 animate-pulse delay-500">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full" />
      </div>

      {/* IMAGEM CRÍTICA - RENDERIZAÇÃO SUPER PRIORITÁRIA */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="mb-8 relative"
      >
        <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl p-4">
          {/* IMAGEM SUPER OTIMIZADA */}
          <img 
            src="/lovable-uploads/f85d4059-57d5-4753-a12e-639ca86ca889.png" 
            alt="Personal Trainer - Método BJ" 
            className="w-full h-full object-contain transform-gpu"
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
              WebkitBackfaceVisibility: 'hidden'
            }}
          />
          
          {/* Fallback instantâneo - sempre visível até carregamento */}
          <div className={`w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl absolute inset-0 flex items-center justify-center transition-opacity duration-100 ${imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <span className="text-white font-bold text-2xl">BJ</span>
          </div>
        </div>
      </motion.div>

      {/* Container das mensagens */}
      <div className="text-center space-y-6 max-w-md mx-auto">
        
        {/* Saudação com nome */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Agora vamos para o treino, <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {userName}!
            </span>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mt-6"
        >
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse border-t-blue-300"></div>
          </div>
        </motion.div>

        {/* Mensagem motivacional */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 mt-6 px-4"
        >
          💪 Preparando sua anamnese de treino personalizada!
        </motion.p>

      </div>
    </div>
  );
};

export default LoadingTreino;
