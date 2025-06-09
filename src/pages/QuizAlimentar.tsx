
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

interface FoodOption {
  id: string;
  name: string;
  emoji: string;
}

const QuizAlimentar = () => {
  const navigate = useNavigate();
  const { etapa } = useParams();
  const currentStep = parseInt(etapa || '1');
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quizData, setQuizData] = useState<Record<string, string[]>>({});

  const quizSteps = [
    {
      id: 1,
      title: "Café da Manhã ☕",
      subtitle: "Selecione os alimentos que você NÃO GOSTA ou NÃO CONSOME",
      foods: [
        { id: 'ovos', name: 'Ovos', emoji: '🥚' },
        { id: 'queijo_branco', name: 'Queijo Branco', emoji: '🧀' },
        { id: 'queijo_mucarela', name: 'Queijo Muçarela', emoji: '🧀' },
        { id: 'requeijao', name: 'Requeijão', emoji: '🥣' },
        { id: 'pao_integral', name: 'Pão Integral', emoji: '🍞' },
        { id: 'pao_frances', name: 'Pão Francês', emoji: '🥖' },
        { id: 'tapioca', name: 'Tapioca', emoji: '⚪' },
        { id: 'cuscuz', name: 'Cuscuz', emoji: '🌽' },
        { id: 'batata_doce', name: 'Batata Doce', emoji: '🍠' },
        { id: 'frango_desfiado', name: 'Frango Desfiado', emoji: '🍗' },
        { id: 'peito_peru', name: 'Peito de Peru', emoji: '🦃' },
        { id: 'frutas_variadas', name: 'Frutas Variadas', emoji: '🍓' },
        { id: 'banana', name: 'Banana', emoji: '🍌' },
        { id: 'mamao', name: 'Mamão', emoji: '🥭' },
        { id: 'abacate', name: 'Abacate', emoji: '🥑' },
        { id: 'leite', name: 'Leite', emoji: '🥛' },
        { id: 'iogurte', name: 'Iogurte', emoji: '🍦' },
        { id: 'whey_protein', name: 'Whey Protein', emoji: '💪' },
        { id: 'pasta_amendoim', name: 'Pasta de Amendoim', emoji: '🥜' },
        { id: 'aveia', name: 'Aveia', emoji: '🌾' },
        { id: 'chia', name: 'Chia', emoji: '🌱' },
        { id: 'granola', name: 'Granola', emoji: '🥣' },
        { id: 'cafe', name: 'Café', emoji: '☕' }
      ]
    },
    {
      id: 2,
      title: "Almoço 🍽️",
      subtitle: "Selecione os alimentos que você NÃO GOSTA ou NÃO CONSOME",
      foods: [
        { id: 'frango', name: 'Frango', emoji: '🍗' },
        { id: 'patinho', name: 'Patinho', emoji: '🥩' },
        { id: 'alcatra', name: 'Alcatra', emoji: '🥩' },
        { id: 'carne_moida', name: 'Carne Moída', emoji: '🥩' },
        { id: 'mandioca', name: 'Mandioca', emoji: '🥔' },
        { id: 'carne_porco', name: 'Carne de Porco', emoji: '🐖' },
        { id: 'batata_doce', name: 'Batata Doce', emoji: '🍠' },
        { id: 'tilapia', name: 'Tilápia', emoji: '🐟' },
        { id: 'merluza', name: 'Merluza', emoji: '🐟' },
        { id: 'legumes', name: 'Legumes', emoji: '🥦' },
        { id: 'arroz', name: 'Arroz', emoji: '🍚' },
        { id: 'feijao', name: 'Feijão', emoji: '🫘' },
        { id: 'salada', name: 'Salada', emoji: '🥗' },
        { id: 'macarrao', name: 'Macarrão', emoji: '🍝' },
        { id: 'ovo', name: 'Ovo', emoji: '🥚' },
        { id: 'inhame', name: 'Inhame', emoji: '🥔' },
        { id: 'cuscuz', name: 'Cuscuz', emoji: '🌽' },
        { id: 'batata', name: 'Batata', emoji: '🥔' }
      ]
    },
    {
      id: 3,
      title: "Lanche da Tarde 🥪",
      subtitle: "Selecione os alimentos que você NÃO GOSTA ou NÃO CONSOME",
      foods: [
        { id: 'whey', name: 'Whey', emoji: '🥛' },
        { id: 'fruta', name: 'Fruta', emoji: '🍎' },
        { id: 'cuscuz', name: 'Cuscuz', emoji: '🌽' },
        { id: 'pao_ovo', name: 'Pão + Ovo', emoji: '🥚' },
        { id: 'tapioca_frango', name: 'Tapioca + Frango', emoji: '🍗' },
        { id: 'crepioca_queijo', name: 'Crepioca + Queijo', emoji: '🧀' },
        { id: 'leite', name: 'Leite', emoji: '🥛' },
        { id: 'crepioca_frango', name: 'Crepioca + Frango', emoji: '🍗' },
        { id: 'ovo', name: 'Ovo', emoji: '🥚' },
        { id: 'sanduiche_frango', name: 'Sanduíche de Frango', emoji: '🥪' },
        { id: 'sanduiche_peru', name: 'Sanduíche de Peru', emoji: '🥪' },
        { id: 'suco', name: 'Suco', emoji: '🧃' }
      ]
    },
    {
      id: 4,
      title: "Jantar 🍽️",
      subtitle: "Selecione os alimentos que você NÃO GOSTA ou NÃO CONSOME",
      foods: [
        { id: 'frango', name: 'Frango', emoji: '🍗' },
        { id: 'patinho', name: 'Patinho', emoji: '🥩' },
        { id: 'alcatra', name: 'Alcatra', emoji: '🥩' },
        { id: 'carne_moida', name: 'Carne Moída', emoji: '🥩' },
        { id: 'mandioca', name: 'Mandioca', emoji: '🥔' },
        { id: 'carne_porco', name: 'Carne de Porco', emoji: '🐖' },
        { id: 'batata_doce', name: 'Batata Doce', emoji: '🍠' },
        { id: 'tilapia', name: 'Tilápia', emoji: '🐟' },
        { id: 'merluza', name: 'Merluza', emoji: '🐟' },
        { id: 'legumes', name: 'Legumes', emoji: '🥦' },
        { id: 'arroz', name: 'Arroz', emoji: '🍚' },
        { id: 'feijao', name: 'Feijão', emoji: '🫘' },
        { id: 'salada', name: 'Salada', emoji: '🥗' },
        { id: 'macarrao', name: 'Macarrão', emoji: '🍝' },
        { id: 'ovo', name: 'Ovo', emoji: '🥚' },
        { id: 'inhame', name: 'Inhame', emoji: '🥔' },
        { id: 'cuscuz', name: 'Cuscuz', emoji: '🌽' },
        { id: 'batata', name: 'Batata', emoji: '🥔' }
      ]
    },
    {
      id: 5,
      title: "Ceia 🌙",
      subtitle: "Selecione os alimentos que você NÃO GOSTA ou NÃO CONSOME (Opcional)",
      foods: [
        { id: 'iogurte_natural', name: 'Iogurte Natural', emoji: '🥛' },
        { id: 'cha', name: 'Chá', emoji: '🍵' },
        { id: 'whey_protein', name: 'Whey Protein', emoji: '💪' },
        { id: 'frutas_leves', name: 'Frutas Leves', emoji: '🍓' },
        { id: 'queijo_cottage', name: 'Queijo Cottage', emoji: '🧀' },
        { id: 'leite_morno', name: 'Leite Morno', emoji: '🥛' },
        { id: 'oleaginosas', name: 'Oleaginosas', emoji: '🥜' }
      ]
    }
  ];

  const currentQuiz = quizSteps.find(step => step.id === currentStep);

  useEffect(() => {
    // Carregar dados salvos do quiz
    const savedData = localStorage.getItem('quizAlimentar');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setQuizData(parsed);
      setSelectedItems(parsed[`etapa${currentStep}`] || []);
    }
  }, [currentStep]);

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleNext = () => {
    // Salvar seleção atual
    const newQuizData = {
      ...quizData,
      [`etapa${currentStep}`]: selectedItems
    };
    setQuizData(newQuizData);
    localStorage.setItem('quizAlimentar', JSON.stringify(newQuizData));

    if (currentStep < 5) {
      navigate(`/quiz-alimentar/${currentStep + 1}`);
    } else {
      // Quiz concluído
      localStorage.setItem('quizAlimentarConcluido', 'true');
      navigate('/quiz-treino/1');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/quiz-alimentar/${currentStep - 1}`);
    } else {
      navigate('/onboarding');
    }
  };

  const handleSkip = () => {
    // Pular etapa (útil para ceia ou quando não tem restrições)
    const newQuizData = {
      ...quizData,
      [`etapa${currentStep}`]: []
    };
    setQuizData(newQuizData);
    localStorage.setItem('quizAlimentar', JSON.stringify(newQuizData));

    if (currentStep < 5) {
      navigate(`/quiz-alimentar/${currentStep + 1}`);
    } else {
      localStorage.setItem('quizAlimentarConcluido', 'true');
      navigate('/quiz-treino/1');
    }
  };

  if (!currentQuiz) {
    return <div>Etapa não encontrada</div>;
  }

  return (
    <div className="min-h-screen juju-gradient-bg">
      <Header showBack onBack={handleBack} title="Anamnese Alimentar" />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProgressBar current={currentStep} total={5} label="Progresso do Quiz Alimentar" />
        
        <div className="juju-card animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentQuiz.title}
            </h2>
            <p className="text-gray-600 font-medium">
              {currentQuiz.subtitle}
            </p>
            {currentStep === 5 && (
              <p className="text-sm text-pink-600 mt-2">
                ✨ Esta etapa é opcional - você pode pular se não faz ceia
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {currentQuiz.foods.map((food) => (
              <div
                key={food.id}
                onClick={() => toggleSelection(food.id)}
                className={`juju-quiz-option text-center ${
                  selectedItems.includes(food.id) ? 'selected' : ''
                }`}
              >
                <div className="text-2xl mb-2">{food.emoji}</div>
                <div className="text-sm font-medium text-gray-700">
                  {food.name}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleNext}
              className="w-full juju-button"
            >
              {currentStep === 5 ? 'Finalizar Quiz Alimentar' : 'Continuar'}
            </button>
            
            {currentStep === 5 && (
              <button 
                onClick={handleSkip}
                className="w-full juju-button-outline"
              >
                Pular Ceia (Não faço esta refeição)
              </button>
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selecionado{selectedItems.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAlimentar;
