
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Maximize, Apple, Dumbbell, TrendingUp, Sparkles, ChevronRight, Clock, Target, Heart } from 'lucide-react';
const OnboardingOtimizado = () => {
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [{
    name: "Maria Silva",
    resultado: "Perdeu 14kg em 2 meses",
    texto: "Resultado incrível! O App da Juju mudou minha vida completamente.",
    avatar: "👩‍💼"
  }, {
    name: "Ana Costa",
    resultado: "Ganhou 5kg de massa muscular",
    texto: "Treinos personalizados que se encaixam perfeitamente na minha rotina!",
    avatar: "👩‍🔬"
  }, {
    name: "Carla Mendes",
    resultado: "Perdeu 18kg em 4 meses",
    texto: "Método revolucionário! Me sinto mais forte e confiante do que nunca!",
    avatar: "👩‍🎨"
  }, {
    name: "Juliana Santos",
    resultado: "Definiu o corpo em 3 meses",
    texto: "Finalmente encontrei algo que funciona de verdade para mim!",
    avatar: "👩‍⚕️"
  }, {
    name: "Patrícia Lima",
    resultado: "Eliminou 22kg em 6 meses",
    texto: "Transformação total! Recuperei minha autoestima e saúde.",
    avatar: "👩‍🏫"
  }, {
    name: "Fernanda Oliveira",
    resultado: "Conquistou o corpo dos sonhos",
    texto: "Método simples, eficaz e que realmente se adapta à vida real!",
    avatar: "👩‍💻"
  }];
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const handleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };
  const handleStartTransformation = () => {
    navigate('/dados-pessoais');
  };
  return <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden">
      
      {/* Header com logo melhorado */}
      <motion.header initial={{
      y: -50,
      opacity: 0
    }} animate={{
      y: 0,
      opacity: 1
    }} className="flex justify-center pt-6 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg p-1">
            <img src="/lovable-uploads/02d55ca0-b017-487b-a9a2-275d8eef05b6.png" alt="JS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            
            
          </div>
        </div>
      </motion.header>

      <div className="px-4 pb-6 max-w-lg mx-auto">
        
        {/* Título principal otimizado */}
        <motion.div initial={{
        y: 30,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.2
      }} className="text-center mb-6 px-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 leading-tight">
            Bem-vinda ao <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">App da Juju!</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
            Sua jornada de <span className="font-semibold text-pink-600">transformação</span> e <span className="font-semibold text-purple-600">performance</span> começa aqui!
          </p>
        </motion.div>

        {/* Player de vídeo aumentado */}
        <motion.div initial={{
        scale: 0.9,
        opacity: 0
      }} animate={{
        scale: 1,
        opacity: 1
      }} transition={{
        delay: 0.4
      }} className="relative mb-8 mx-1">
          <div className="relative bg-gradient-to-br from-pink-400 to-pink-600 rounded-3xl p-0.5 shadow-2xl">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden min-h-[280px] sm:min-h-[320px]">
              
              {/* Elementos decorativos no vídeo */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 opacity-20">
                <Sparkles size={24} className="sm:w-7 sm:h-7" />
              </div>
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 opacity-20">
                <Heart size={20} className="sm:w-6 sm:h-6" />
              </div>
              
              <div className="text-center space-y-5 sm:space-y-6 flex flex-col justify-center h-full">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-3">Metodologia App da Juju</h3>
                  <p className="text-pink-100 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
                    Descubra como alcançar seus objetivos com nosso método exclusivo
                  </p>
                </div>
                
                {/* Play button aumentado */}
                <motion.button onClick={handleVideoPlay} whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.95
              }} className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto shadow-lg border border-white/30">
                  {isVideoPlaying ? <Pause size={28} className="text-white sm:w-8 sm:h-8" /> : <Play size={28} className="text-white ml-1 sm:w-8 sm:h-8" />}
                </motion.button>
                
                <div className="flex items-center justify-center space-x-4 sm:space-x-5 text-sm text-pink-100">
                  <span className="flex items-center space-x-1.5">
                    <Clock size={14} className="sm:w-4 sm:h-4" />
                    <span>3:45 min</span>
                  </span>
                  <span>•</span>
                  <span>🎯 Vídeo explicativo</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefícios em cards menores e mais visuais */}
        <motion.div initial={{
        y: 50,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.6
      }} className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 mx-2">
          {[{
          icon: <Apple className="text-orange-500" size={20} />,
          title: "Nutrição Estratégica",
          description: "Plano alimentar baseado nos seus objetivos",
          color: "from-orange-100 to-orange-50 border-orange-200"
        }, {
          icon: <Dumbbell className="text-purple-500" size={20} />,
          title: "Treino de Alta Performance",
          description: "Adaptado ao seu nível e metas específicas",
          color: "from-purple-100 to-purple-50 border-purple-200"
        }, {
          icon: <TrendingUp className="text-blue-500" size={20} />,
          title: "Monitoramento Contínuo",
          description: "Acompanhe sua evolução em tempo real",
          color: "from-blue-100 to-blue-50 border-blue-200"
        }].map((benefit, index) => <motion.div key={index} initial={{
          x: -30,
          opacity: 0
        }} animate={{
          x: 0,
          opacity: 1
        }} transition={{
          delay: 0.8 + index * 0.1
        }} className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${benefit.color} border shadow-sm`}>
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-white/50 rounded-xl flex items-center justify-center">
                {benefit.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">{benefit.title}</h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-0.5">{benefit.description}</p>
              </div>
            </motion.div>)}
        </motion.div>

        {/* Seção de depoimentos */}
        <motion.div initial={{
        y: 30,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 1.0
      }} className="mb-6 sm:mb-8 mx-2">
          <h3 className="text-center text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
            Resultados Reais ✨
          </h3>
          
          <div className="relative h-20 sm:h-24 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div key={currentTestimonial} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.5
            }} className="absolute inset-0 p-3 sm:p-4 flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center text-sm sm:text-lg flex-shrink-0">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 italic mb-1 leading-tight">
                    "{testimonials[currentTestimonial].texto}"
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-800 truncate">
                      {testimonials[currentTestimonial].name}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                      {testimonials[currentTestimonial].resultado}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicadores dos depoimentos */}
          <div className="flex justify-center mt-2 sm:mt-3 space-x-1">
            {testimonials.map((_, index) => <div key={index} className={`h-1.5 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-pink-400 w-4 sm:w-6' : 'bg-gray-300 w-1.5'}`} />)}
          </div>
        </motion.div>

        {/* CTA otimizado */}
        <motion.div initial={{
        y: 30,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 1.2
      }} className="space-y-3 sm:space-y-4 mx-2">
          <motion.button onClick={handleStartTransformation} whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }} className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 text-sm sm:text-base">
            <Sparkles size={18} className="sm:w-5 sm:h-5" />
            <span>Iniciar Minha Transformação</span>
            <ChevronRight size={18} className="sm:w-5 sm:h-5" />
          </motion.button>
          
          <div className="text-center px-4">
            <p className="text-sm sm:text-base text-gray-500">
              ⏱️ Apenas <span className="font-semibold text-pink-600">5 minutos</span> para personalizar tudo para você!
            </p>
            
          </div>
        </motion.div>

      </div>
    </div>;
};
export default OnboardingOtimizado;
