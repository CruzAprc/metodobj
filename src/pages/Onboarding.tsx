
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen juju-gradient-bg">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="juju-card animate-fade-in-up text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce-gentle">
              <span className="text-4xl">🎯</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Bem-vinda ao <span className="text-pink-600">App da Juju</span>!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Sua jornada de transformação começa aqui
            </p>
          </div>

          {/* Player de vídeo responsivo */}
          <div className="bg-gray-100 rounded-3xl p-8 mb-8">
            <div className="aspect-video bg-gradient-to-r from-pink-200 to-pink-100 rounded-2xl flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">▶️</span>
                </div>
                <p className="text-gray-600 font-medium">Vídeo Explicativo</p>
                <p className="text-sm text-gray-500">Descubra como funciona o App da Juju</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              🎥 Assista ao vídeo para entender como vamos criar sua dieta e treino personalizados
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-left bg-pink-50 p-4 rounded-2xl">
              <span className="text-2xl mr-4">🍎</span>
              <div>
                <h3 className="font-semibold text-gray-800">Dieta Personalizada</h3>
                <p className="text-sm text-gray-600">Baseada nos seus gostos e preferências</p>
              </div>
            </div>
            
            <div className="flex items-center text-left bg-pink-50 p-4 rounded-2xl">
              <span className="text-2xl mr-4">💪</span>
              <div>
                <h3 className="font-semibold text-gray-800">Treino Sob Medida</h3>
                <p className="text-sm text-gray-600">Adaptado ao seu nível e objetivos</p>
              </div>
            </div>
            
            <div className="flex items-center text-left bg-pink-50 p-4 rounded-2xl">
              <span className="text-2xl mr-4">📱</span>
              <div>
                <h3 className="font-semibold text-gray-800">Acompanhamento</h3>
                <p className="text-sm text-gray-600">Monitore seu progresso diariamente</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/quiz-alimentar/1')}
            className="w-full juju-button text-xl py-4 animate-bounce-gentle"
          >
            🚀 Começar Jornada
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Leva apenas 5 minutos para personalizar tudo!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
