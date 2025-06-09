
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Avaliacao = () => {
  const navigate = useNavigate();
  const [daysUsingApp, setDaysUsingApp] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);

  useEffect(() => {
    // Simular dados do usuário
    const regDate = new Date();
    regDate.setDate(regDate.getDate() - 15); // Simular 15 dias de uso
    
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - regDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUsingApp(diffDays);
    
    setIsUnlocked(diffDays >= 14);
  }, []);

  const handlePhotoUpload = (type: 'before' | 'after', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'before') {
          setBeforePhoto(result);
        } else {
          setAfterPhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isUnlocked) {
    const daysRemaining = 14 - daysUsingApp;
    
    return (
      <div className="min-h-screen juju-gradient-bg">
        <Header showBack onBack={() => navigate('/dashboard')} title="Avaliação" />
        
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="juju-card text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">🔒</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Área Bloqueada
            </h2>
            
            <p className="text-gray-600 mb-6">
              Esta área será liberada após 2 semanas de uso do app para você acompanhar seu progresso.
            </p>
            
            <div className="bg-pink-50 rounded-2xl p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  {daysRemaining}
                </div>
                <p className="text-pink-700 font-medium">
                  dia{daysRemaining !== 1 ? 's' : ''} restante{daysRemaining !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <span className="text-xl mr-3">📸</span>
                <span className="text-gray-700">Fotos do progresso</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">📊</span>
                <span className="text-gray-700">Comparativo antes/depois</span>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">📈</span>
                <span className="text-gray-700">Relatório de evolução</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full juju-button mt-6"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen juju-gradient-bg">
      <Header showBack onBack={() => navigate('/dashboard')} title="Minha Avaliação" />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="juju-card mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Parabéns! Área Liberada
          </h2>
          <p className="text-gray-600">
            Você completou 2 semanas usando o app. Agora pode acompanhar seu progresso!
          </p>
          <div className="mt-4 p-3 bg-green-50 rounded-2xl">
            <p className="text-green-700 font-medium">
              ⏰ {daysUsingApp} dias de dedicação!
            </p>
          </div>
        </div>

        {/* Upload de fotos */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="juju-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              📸 Foto "Antes"
            </h3>
            
            {beforePhoto ? (
              <div className="relative">
                <img 
                  src={beforePhoto} 
                  alt="Foto antes" 
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <button 
                  onClick={() => setBeforePhoto(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center">
                <span className="text-4xl mb-4 block">📷</span>
                <p className="text-gray-600 mb-4">Adicione sua foto inicial</p>
                <label className="juju-button-outline cursor-pointer">
                  Escolher Foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => handlePhotoUpload('before', e)}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="juju-card">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              📸 Foto "Depois"
            </h3>
            
            {afterPhoto ? (
              <div className="relative">
                <img 
                  src={afterPhoto} 
                  alt="Foto depois" 
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <button 
                  onClick={() => setAfterPhoto(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center">
                <span className="text-4xl mb-4 block">📷</span>
                <p className="text-gray-600 mb-4">Adicione sua foto atual</p>
                <label className="juju-button-outline cursor-pointer">
                  Escolher Foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={(e) => handlePhotoUpload('after', e)}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Comparativo */}
        {beforePhoto && afterPhoto && (
          <div className="juju-card">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              🔄 Comparativo da Sua Evolução
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-center font-medium text-gray-700 mb-2">Antes</p>
                <img src={beforePhoto} alt="Antes" className="w-full h-48 object-cover rounded-xl" />
              </div>
              <div>
                <p className="text-center font-medium text-gray-700 mb-2">Depois</p>
                <img src={afterPhoto} alt="Depois" className="w-full h-48 object-cover rounded-xl" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 text-center">
              <h4 className="font-bold text-gray-800 mb-3">🏆 Sua Transformação</h4>
              <p className="text-gray-600 mb-4">
                Incrível! Você conseguiu manter a constância por {daysUsingApp} dias seguindo o plano personalizado.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-pink-600">{daysUsingApp}</div>
                  <div className="text-xs text-gray-600">Dias de Dedicação</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-600">100%</div>
                  <div className="text-xs text-gray-600">Comprometimento</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-600">⭐</div>
                  <div className="text-xs text-gray-600">Resultado</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="grid grid-cols-2 gap-4">
          <button className="juju-button-outline">
            📊 Gerar Relatório
          </button>
          <button className="juju-button">
            📱 Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Avaliacao;
