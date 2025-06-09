
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [registrationDate, setRegistrationDate] = useState<Date>();
  const [daysUsingApp, setDaysUsingApp] = useState(0);

  useEffect(() => {
    // Simular dados do usuário
    setUserName('Juju'); // Em produção, pegar do Supabase
    
    // Calcular dias usando o app
    const regDate = new Date();
    regDate.setDate(regDate.getDate() - 5); // Simular 5 dias de uso
    setRegistrationDate(regDate);
    
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - regDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUsingApp(diffDays);
  }, []);

  const daysUntilEvaluation = Math.max(0, 14 - daysUsingApp);

  const dietPlan = [
    {
      meal: 'Café da Manhã',
      emoji: '☕',
      foods: ['2 ovos mexidos', 'Pão integral', 'Abacate', 'Café'],
      time: '07:00'
    },
    {
      meal: 'Almoço',
      emoji: '🍽️',
      foods: ['Frango grelhado 150g', 'Arroz integral', 'Feijão', 'Salada verde'],
      time: '12:00'
    },
    {
      meal: 'Lanche',
      emoji: '🥪',
      foods: ['Whey protein', 'Banana', 'Aveia'],
      time: '15:30'
    },
    {
      meal: 'Jantar',
      emoji: '🍽️',
      foods: ['Tilápia assada', 'Batata doce', 'Legumes refogados'],
      time: '19:00'
    }
  ];

  const workoutPlan = [
    { day: 'Segunda', workout: 'Pernas e Glúteos', duration: '45 min', emoji: '🍑' },
    { day: 'Terça', workout: 'Braços e Ombros', duration: '40 min', emoji: '💪' },
    { day: 'Quarta', workout: 'Descanso Ativo', duration: '30 min', emoji: '🧘' },
    { day: 'Quinta', workout: 'Costas e Abdômen', duration: '45 min', emoji: '🔥' },
    { day: 'Sexta', workout: 'Cardio + Core', duration: '35 min', emoji: '❤️' },
    { day: 'Sábado', workout: 'Funcional', duration: '50 min', emoji: '⚡' },
    { day: 'Domingo', workout: 'Descanso', duration: '-', emoji: '😴' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <Header title="Meu Dashboard" />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Saudação personalizada */}
        <div className="juju-card mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Olá, {userName}! 
          </h2>
          <p className="text-gray-600">
            Você está usando o app há <span className="font-bold text-pink-600">{daysUsingApp} dias</span>
          </p>
          
          {daysUntilEvaluation > 0 ? (
            <div className="mt-4 p-4 bg-pink-50 rounded-2xl">
              <p className="text-sm text-pink-700">
                🔒 Área de avaliação será liberada em <span className="font-bold">{daysUntilEvaluation} dias</span>
              </p>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/avaliacao')}
              className="mt-4 juju-button"
            >
              📸 Acessar Área de Avaliação
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Seção Dieta */}
          <div className="juju-card">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl">🍎</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Minha Dieta</h3>
                <p className="text-sm text-gray-600">Personalizada para você</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {dietPlan.map((meal, index) => (
                <div key={index} className="bg-pink-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{meal.emoji}</span>
                      <span className="font-semibold text-gray-800">{meal.meal}</span>
                    </div>
                    <span className="text-sm text-pink-600 font-medium">{meal.time}</span>
                  </div>
                  <div className="space-y-1">
                    {meal.foods.map((food, idx) => (
                      <p key={idx} className="text-sm text-gray-600">• {food}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seção Treinos */}
          <div className="juju-card">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl">💪</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Meus Treinos</h3>
                <p className="text-sm text-gray-600">Cronograma semanal</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {workoutPlan.map((day, index) => (
                <div key={index} className={`rounded-2xl p-4 ${
                  day.workout === 'Descanso' || day.workout === 'Descanso Ativo' 
                    ? 'bg-gray-50' 
                    : 'bg-pink-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{day.emoji}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{day.day}</p>
                        <p className="text-sm text-gray-600">{day.workout}</p>
                      </div>
                    </div>
                    <span className="text-sm text-pink-600 font-medium">{day.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu de navegação */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <button className="juju-card text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <span className="text-2xl mb-2 block">📊</span>
            <span className="text-sm font-medium text-gray-700">Progresso</span>
          </button>
          
          <button className="juju-card text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <span className="text-2xl mb-2 block">💧</span>
            <span className="text-sm font-medium text-gray-700">Hidratação</span>
          </button>
          
          <button className="juju-card text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <span className="text-2xl mb-2 block">⚙️</span>
            <span className="text-sm font-medium text-gray-700">Configurações</span>
          </button>
          
          <button className="juju-card text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <span className="text-2xl mb-2 block">📞</span>
            <span className="text-sm font-medium text-gray-700">Suporte</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
