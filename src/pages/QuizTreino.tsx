
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

const QuizTreino = () => {
  const navigate = useNavigate();
  const { pergunta } = useParams();
  const currentQuestion = parseInt(pergunta || '1');
  
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<string>('');
  const [quizData, setQuizData] = useState<Record<string, any>>({});

  const questions = [
    {
      id: 1,
      title: "🔹 Histórico de Lesões",
      question: "Você já teve alguma lesão ou limitação física?",
      options: [
        { value: 'nao', label: 'Não' },
        { value: 'joelho', label: 'Sim, no joelho' },
        { value: 'coluna', label: 'Sim, na coluna' },
        { value: 'ombro', label: 'Sim, no ombro' },
        { value: 'outra', label: 'Sim, em outra região', hasCustom: true }
      ]
    },
    {
      id: 2,
      title: "🔹 Objetivo Principal",
      question: "Qual seu objetivo principal com o treino?",
      options: [
        { value: 'massa_muscular', label: 'Ganho de massa muscular' },
        { value: 'emagrecimento', label: 'Emagrecimento / definição corporal' },
        { value: 'condicionamento', label: 'Aumento do condicionamento físico' },
        { value: 'postura', label: 'Correção postural / alívio de dores' },
        { value: 'bem_estar', label: 'Saúde e bem-estar geral' }
      ]
    },
    {
      id: 3,
      title: "🔹 Tempo Disponível",
      question: "Quanto tempo você tem disponível por sessão de treino?",
      options: [
        { value: 'menos_30', label: 'Menos de 30 minutos' },
        { value: '30_45', label: 'De 30 a 45 minutos' },
        { value: '45_60', label: 'De 45 minutos a 1 hora' },
        { value: 'mais_60', label: 'Mais de 1 hora' }
      ]
    },
    {
      id: 4,
      title: "🔹 Frequência Semanal",
      question: "Quantos dias por semana você pode treinar?",
      options: [
        { value: '1_2_dias', label: '1 a 2 dias' },
        { value: '3_4_dias', label: '3 a 4 dias' },
        { value: '5_6_dias', label: '5 a 6 dias' },
        { value: 'todos_dias', label: 'Todos os dias' }
      ]
    },
    {
      id: 5,
      title: "🔹 Nível de Experiência",
      question: "Qual seu nível atual de experiência com treinos?",
      options: [
        { value: 'nunca', label: 'Nunca treinei / vou começar agora' },
        { value: 'pouco_tempo', label: 'Treino há pouco tempo (até 6 meses)' },
        { value: 'mais_6_meses', label: 'Treino regularmente há mais de 6 meses' },
        { value: 'mais_1_ano', label: 'Treino há mais de 1 ano com frequência' }
      ]
    },
    {
      id: 6,
      title: "🔹 Foco em Regiões",
      question: "Tem alguma área do corpo que você deseja dar mais atenção?",
      options: [
        { value: 'bracos_ombros', label: 'Braços e ombros' },
        { value: 'pernas_gluteos', label: 'Pernas e glúteos' },
        { value: 'abdomen', label: 'Abdômen' },
        { value: 'costas_postura', label: 'Costas e postura' },
        { value: 'nenhuma', label: 'Nenhuma preferência específica' }
      ]
    },
    {
      id: 7,
      title: "🔹 Intensidade Preferida",
      question: "Qual nível de intensidade você prefere?",
      options: [
        { value: 'leve', label: 'Leve – quero começar devagar' },
        { value: 'moderado', label: 'Moderado – gosto de desafio na medida' },
        { value: 'intenso', label: 'Intenso – quero treinos pesados e resultados rápidos' }
      ]
    },
    {
      id: 8,
      title: "🔹 Maior Desafio",
      question: "Qual seu maior desafio hoje?",
      options: [
        { value: 'tempo', label: 'Falta de tempo' },
        { value: 'motivacao', label: 'Falta de motivação' },
        { value: 'orientacao', label: 'Falta de orientação' },
        { value: 'manter_constancia', label: 'Já tentei antes e não consegui manter' },
        { value: 'nenhum', label: 'Nenhum – só quero um plano eficiente' }
      ]
    }
  ];

  const currentQ = questions.find(q => q.id === currentQuestion);

  useEffect(() => {
    const savedData = localStorage.getItem('quizTreino');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setQuizData(parsed);
      setSelectedAnswer(parsed[`pergunta${currentQuestion}`]?.answer || '');
      setCustomAnswer(parsed[`pergunta${currentQuestion}`]?.custom || '');
    }
  }, [currentQuestion]);

  const handleNext = () => {
    if (!selectedAnswer) {
      alert('Por favor, selecione uma resposta!');
      return;
    }

    if (selectedAnswer === 'outra' && !customAnswer.trim()) {
      alert('Por favor, especifique sua lesão!');
      return;
    }

    const newQuizData = {
      ...quizData,
      [`pergunta${currentQuestion}`]: {
        answer: selectedAnswer,
        custom: customAnswer
      }
    };
    setQuizData(newQuizData);
    localStorage.setItem('quizTreino', JSON.stringify(newQuizData));

    if (currentQuestion < 8) {
      navigate(`/quiz-treino/${currentQuestion + 1}`);
    } else {
      localStorage.setItem('quizTreinoConcluido', 'true');
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 1) {
      navigate(`/quiz-treino/${currentQuestion - 1}`);
    } else {
      navigate('/quiz-alimentar/5');
    }
  };

  if (!currentQ) {
    return <div>Pergunta não encontrada</div>;
  }

  return (
    <div className="min-h-screen juju-gradient-bg">
      <Header showBack onBack={handleBack} title="Anamnese de Treino" />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProgressBar current={currentQuestion} total={8} label="Progresso do Quiz de Treino" />
        
        <div className="juju-card animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentQ.title}
            </h2>
            <p className="text-lg text-gray-700 font-medium">
              {currentQ.question}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {currentQ.options.map((option) => (
              <div key={option.value}>
                <label className="flex items-start space-x-3 p-4 border-2 border-pink-200 rounded-2xl cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all duration-300">
                  <input
                    type="radio"
                    name={`question${currentQuestion}`}
                    value={option.value}
                    checked={selectedAnswer === option.value}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="mt-1 text-pink-500 focus:ring-pink-400"
                  />
                  <span className="text-gray-700 font-medium flex-1">
                    {option.label}
                  </span>
                </label>
                
                {option.hasCustom && selectedAnswer === option.value && (
                  <div className="mt-3 ml-6">
                    <input
                      type="text"
                      value={customAnswer}
                      onChange={(e) => setCustomAnswer(e.target.value)}
                      placeholder="Especifique sua lesão..."
                      className="w-full p-3 border border-pink-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-full juju-button"
            disabled={!selectedAnswer}
          >
            {currentQuestion === 8 ? 'Finalizar Quiz' : 'Próxima Pergunta'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizTreino;
