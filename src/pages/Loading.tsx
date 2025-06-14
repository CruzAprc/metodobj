
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

const Loading = () => {
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

  // ESTRATÉGIA ULTRA-AGRESSIVA DE PRÉ-CARREGAMENTO
  useEffect(() => {
    const imageUrl = "/lovable-uploads/4f268362-785c-45b9-aeba-4c33c58fa0e1.png";
    
    // 1. PRELOAD CRÍTICO COM MÁXIMA PRIORIDADE NO HEAD
    const criticalPreload = document.createElement('link');
    criticalPreload.rel = 'preload';
    criticalPreload.as = 'image';
    criticalPreload.href = imageUrl;
    criticalPreload.fetchPriority = 'high';
    criticalPreload.crossOrigin = 'anonymous';
    // Força inserção no topo absoluto do head
    document.head.insertBefore(criticalPreload, document.head.firstChild);
    
    // 2. PREFETCH ADICIONAL PARA CACHE DO BROWSER
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = imageUrl;
    prefetchLink.fetchPriority = 'high';
    document.head.appendChild(prefetchLink);
    
    // 3. PRÉ-CARREGAMENTO VIA MÚLTIPLAS IMAGENS PARA GARANTIR CACHE
    for (let i = 0; i < 5; i++) {
      const preloadImg = new Image();
      preloadImg.fetchPriority = 'high';
      preloadImg.loading = 'eager';
      preloadImg.decoding = 'sync';
      preloadImg.crossOrigin = 'anonymous';
      preloadImg.src = imageUrl;
    }
    
    // 4. IMAGEM PRINCIPAL COM TODAS AS OTIMIZAÇÕES
    const mainImg = new Image();
    mainImg.fetchPriority = 'high';
    mainImg.loading = 'eager';
    mainImg.decoding = 'sync';
    mainImg.crossOrigin = 'anonymous';
    
    // Event listeners otimizados
    mainImg.onload = () => {
      setImageLoaded(true);
      console.log('✅ Imagem da Juju carregada INSTANTANEAMENTE!');
    };
    
    mainImg.onerror = () => {
      console.error('❌ Erro ao carregar imagem da Juju');
      setImageLoaded(true); // Ainda mostra o container
    };
    
    // Carrega a imagem principal
    mainImg.src = imageUrl;

    return () => {
      // Cleanup
      if (document.head.contains(criticalPreload)) {
        document.head.removeChild(criticalPreload);
      }
      if (document.head.contains(prefetchLink)) {
        document.head.removeChild(prefetchLink);
      }
    };
  }, []);

  const messages = [
    "Juju está preparando sua anamnese...",
    "Montando o questionário perfeito para você...",
    "Quase pronto! Preparando sua experiência personalizada...",
    `Vamos começar ${userName}!`
  ];

  useEffect(() => {
    const intervals = [2000, 2000, 2000, 1500]; // Duração de cada mensagem
    
    const timer = setTimeout(() => {
      if (currentMessage < messages.length - 1) {
        setCurrentMessage(currentMessage + 1);
      } else {
        // Após a última mensagem, navegar para o quiz
        setTimeout(() => {
          navigate('/quiz-alimentar/1');
        }, 1000);
      }
    }, intervals[currentMessage]);

    return () => clearTimeout(timer);
  }, [currentMessage, navigate, userName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* IMAGEM DA JUJU - RENDERIZAÇÃO COM MÁXIMA PRIORIDADE */}
      <div className="mb-8 relative" style={{ 
        willChange: 'transform', 
        contain: 'layout style paint',
        transform: 'translateZ(0)' // Force GPU acceleration
      }}>
        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-pink-400 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl p-3">
          {/* IMAGEM OTIMIZADA COM TÉCNICAS AVANÇADAS */}
          <img 
            src="/lovable-uploads/4f268362-785c-45b9-aeba-4c33c58fa0e1.png" 
            alt="Juju - Método BJ" 
            className="w-full h-full object-contain"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            crossOrigin="anonymous"
            onLoad={() => {
              setImageLoaded(true);
              console.log('🚀 Imagem da Juju renderizada com sucesso!');
            }}
            onError={() => setImageLoaded(true)}
            style={{
              // Otimizações críticas de performance
              contentVisibility: 'visible',
              containIntrinsicSize: '160px 160px',
              imageRendering: 'crisp-edges',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              // Força o browser a tratar como critical resource
              position: 'relative',
              zIndex: 1000
            }}
          />
          
          {/* Fallback mínimo apenas para garantir que algo apareça */}
          {!imageLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
          )}
        </div>
      </div>

      {/* CONTEÚDO SECUNDÁRIO - RENDERIZA APENAS APÓS IMAGEM */}
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
            Olá, <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
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
                  ? 'bg-gradient-to-r from-pink-400 to-pink-500 w-8' 
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
            <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse border-t-pink-300"></div>
          </div>
        </motion.div>

        {/* Mensagem motivacional */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-500 mt-6 px-4"
        >
          ✨ Estamos personalizando tudo especialmente para você!
        </motion.p>

      </motion.div>

      {/* ELEMENTOS DECORATIVOS - RENDERIZAM APÓS IMAGEM */}
      <div className="absolute top-20 right-10 opacity-20 animate-pulse">
        <Sparkles size={40} className="text-pink-400" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-20 animate-pulse delay-1000">
        <Heart size={35} className="text-purple-400" />
      </div>
      <div className="absolute top-1/3 left-1/4 opacity-10 animate-pulse delay-500">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full" />
      </div>
    </div>
  );
};

export default Loading;
