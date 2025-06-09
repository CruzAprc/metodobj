
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gym-gradient-bg">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="gym-card animate-slide-in-bottom text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-black rounded-2xl mx-auto mb-6 flex items-center justify-center animate-power-bounce">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bem-vinda ao <span className="performance-text">App da Juju</span>!
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-medium">
              Sua jornada de transformação e performance começa aqui
            </p>
          </div>

          {/* Video placeholder mais profissional */}
          <div className="performance-card mb-8">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-black">▶️</span>
                </div>
                <p className="text-white font-semibold text-lg">Metodologia App da Juju</p>
                <p className="text-gray-300 text-sm">Descubra como alcançar seus objetivos</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              🎥 Vídeo explicativo sobre nossa metodologia de treino e alimentação personalizada
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-left bg-gray-50 p-5 rounded-xl gym-card-hover">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">🍎</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Nutrição Estratégica</h3>
                <p className="text-sm text-gray-600">Plano alimentar baseado nos seus objetivos</p>
              </div>
            </div>
            
            <div className="flex items-center text-left bg-gray-50 p-5 rounded-xl gym-card-hover">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">💪</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Treino de Alta Performance</h3>
                <p className="text-sm text-gray-600">Adaptado ao seu nível e metas específicas</p>
              </div>
            </div>
            
            <div className="flex items-center text-left bg-gray-50 p-5 rounded-xl gym-card-hover">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mr-4">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Monitoramento Contínuo</h3>
                <p className="text-sm text-gray-600">Acompanhe sua evolução em tempo real</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/quiz-alimentar/1')}
            className="w-full gym-button text-xl py-5 animate-power-pulse"
          >
            🚀 Iniciar Avaliação
          </button>
          
          <p className="text-sm text-gray-500 mt-4 font-medium">
            Apenas 5 minutos para personalizar tudo para você!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
