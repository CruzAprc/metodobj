
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Target, Zap, TrendingUp } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentDot, setCurrentDot] = useState(0);

  const testimonials = [
    {
      name: "Rafael Santos",
      initials: "RS",
      content: "Sistema completo! O Método BJ me ajudou a conquistar resultados que eu não conseguia há anos.",
      result: "+12kg massa magra"
    },
    {
      name: "Ana Costa",
      initials: "AC", 
      content: "Metodologia incrível! Finalmente encontrei algo que funciona de verdade.",
      result: "-15kg em 3 meses"
    },
    {
      name: "Carlos Lima",
      initials: "CL",
      content: "Transformação total! Me sinto mais forte e confiante do que nunca.",
      result: "+8kg muscle"
    },
    {
      name: "Maria Silva",
      initials: "MS",
      content: "Resultado além das expectativas! Recomendo para todos.",
      result: "-20kg"
    },
    {
      name: "Pedro Oliveira", 
      initials: "PO",
      content: "Sistema eficiente que se adapta perfeitamente à minha rotina.",
      result: "Corpo definido"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDot(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
    // Simular reprodução de vídeo
    if (!isVideoPlaying) {
      setTimeout(() => setIsVideoPlaying(false), 3000);
    }
  };

  const handleStartTransformation = () => {
    navigate('/dados-pessoais');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="max-w-sm mx-auto bg-white rounded-3xl p-8 shadow-2xl">
        
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-300 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg"
        >
          BJ
        </motion.div>

        {/* Title */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-2"
        >
          <h1 className="text-3xl font-bold text-slate-800">
            Bem-vindo ao <span className="text-blue-600">Método</span><br/>
            <span className="text-sky-300">BJ!</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 text-slate-600"
        >
          Sua jornada de <span className="text-blue-600 font-semibold">evolução</span> e <span className="text-sky-300 font-semibold">alta performance</span><br/>
          começa aqui!
        </motion.div>

        {/* Main Video Card */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white text-center mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          
          <h2 className="text-xl font-bold mb-3">Sistema Método BJ</h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Descubra o sistema completo para atingir seus objetivos de forma consistente
          </p>
          
          <motion.button
            onClick={handleVideoPlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 border-0 cursor-pointer transition-all duration-300 ${isVideoPlaying ? '' : 'animate-pulse'}`}
          >
            <Play size={24} className="text-white ml-1" fill="white" />
          </motion.button>
          
          <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              3:45 min
            </span>
            <span>•</span>
            <span>🎯 Vídeo explicativo</span>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-8"
        >
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-5 hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
              <Zap size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Nutrição Inteligente</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Sistema alimentar baseado em dados e objetivos específicos</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-5 hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
              <Target size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Treino Eficiente</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Protocolos otimizados para máximo resultado em menor tempo</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-2xl p-5 hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-sky-300 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Análise de Dados</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Métricas precisas para acompanhar sua evolução</p>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">Resultados Reais ✨</h2>
          
          <div className="bg-blue-50 rounded-2xl p-5 border-l-4 border-sky-300 mb-5">
            <div className="text-slate-600 italic mb-3 leading-relaxed">
              "{testimonials[currentDot].content}"
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonials[currentDot].initials}
                </div>
                <span className="font-semibold text-slate-800">{testimonials[currentDot].name}</span>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                {testimonials[currentDot].result}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-5">
          {[0, 1, 2, 3, 4].map((index) => (
            <div 
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentDot 
                  ? 'bg-blue-600 w-6' 
                  : 'bg-slate-300 w-2'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={handleStartTransformation}
          whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 mb-4"
        >
          🚀 Acessar o Sistema
        </motion.button>

        {/* Time Info */}
        <div className="text-center flex items-center justify-center gap-2 text-slate-600 text-sm">
          <span>⏰</span>
          <span>Apenas <strong className="text-blue-600">5 minutos</strong> para personalizar tudo para você!</span>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
