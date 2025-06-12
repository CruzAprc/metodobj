
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
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
    alert('🎬 Reproduzindo vídeo da metodologia do Método BJ...');
  };

  const handleStartTransformation = () => {
    navigate('/dados-pessoais');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-2xl">
        
        {/* Logo/Image */}
        <div className="w-full mb-8 flex items-center justify-center">
          <img 
            src="/lovable-uploads/5e3b41d1-5f67-4a50-927e-5a32e4c74a2c.png" 
            alt="Método BJ" 
            className="w-48 h-48 object-contain rounded-2xl"
          />
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8 text-slate-600">
          <span className="text-blue-600 font-semibold">Ele traz a força.</span> <span className="text-pink-500 font-semibold">Ela ativa a constância</span><br/>
          <span className="text-slate-600">juntos criamos o método que vai</span><br/>
          <span className="text-blue-600 font-semibold">transformar seu corpo</span>
        </div>

        {/* Main Video Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl px-6 py-6 text-white text-center mb-6 relative overflow-hidden min-h-[220px] flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
          
          <h2 className="text-lg font-bold mb-3">Sistema Método BJ</h2>
          <p className="text-blue-100 mb-5 leading-relaxed text-sm">
            Descubra o sistema completo para atingir seus objetivos de forma consistente
          </p>
          
          <button
            onClick={handleVideoPlay}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-0 cursor-pointer transition-all duration-300 animate-pulse hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white ml-1">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          
          <div className="flex items-center justify-center gap-4 text-xs text-blue-100">
            <span className="flex items-center gap-1">⏱️ 3:45 min</span>
            <span>•</span>
            <span>🎯 Vídeo explicativo</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-5 hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
              <span className="text-white text-lg">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Nutrição Inteligente</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Sistema alimentar baseado em dados e objetivos específicos</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-5 hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
              <span className="text-white text-lg">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Treino Eficiente</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Protocolos otimizados para máximo resultado em menor tempo</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border-2 border-blue-200 rounded-2xl p-5 hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="w-10 h-10 bg-sky-300 rounded-xl flex items-center justify-center mb-3">
              <span className="text-white text-lg">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Análise de Dados</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Métricas precisas para acompanhar sua evolução</p>
          </div>
        </div>

        {/* Results Section */}
        <div className="text-center mb-8">
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
        </div>

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
        <button
          onClick={handleStartTransformation}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 mb-4 hover:-translate-y-0.5 hover:shadow-lg"
        >
          🚀 Acessar o Sistema
        </button>

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
