
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Coffee, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface FoodOption {
  id: string;
  name: string;
  emoji: string;
}

const QuizAlimentar = () => {
  const navigate = useNavigate();
  const { etapa } = useParams();
  const currentStep = parseInt(etapa || '1');
  const { user } = useAuth();
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quizData, setQuizData] = useState<Record<string, string[]>>({});
  const [animatingStep, setAnimatingStep] = useState(false);

  const quizSteps = [
    {
      id: 1,
      title: "Café da Manhã",
      emoji: "☕",
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
      title: "Almoço",
      emoji: "🍽️",
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
      title: "Lanche da Tarde",
      emoji: "🥪",
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
      title: "Jantar",
      emoji: "🍽️",
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
      title: "Ceia",
      emoji: "🌙",
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
    console.log('Loading quiz data for step:', currentStep);
    // Carregar dados salvos do quiz
    const savedData = localStorage.getItem('quizAlimentar');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setQuizData(parsed);
      const stepData = parsed[`etapa${currentStep}`] || [];
      setSelectedItems(stepData);
      console.log('Loaded data for step:', stepData);
    } else {
      setSelectedItems([]);
    }
  }, [currentStep]);

  const toggleSelection = (itemId: string) => {
    console.log('Toggling selection for:', itemId);
    setSelectedItems(prev => {
      const newSelection = prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      console.log('New selection:', newSelection);
      return newSelection;
    });
  };

  const saveToDatabase = async (finalData: Record<string, string[]>) => {
    if (!user) return;

    try {
      const dietData = {
        user_id: user.id,
        cafe_da_manha: { naoGosta: finalData.etapa1 || [] },
        almoco: { naoGosta: finalData.etapa2 || [] },
        lanche: { naoGosta: finalData.etapa3 || [] },
        jantar: { naoGosta: finalData.etapa4 || [] },
        ceia: { naoGosta: finalData.etapa5 || [] }
      };

      // Verificar se já existe um registro
      const { data: existingData } = await supabase
        .from('teste_dieta')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingData) {
        // Atualizar registro existente
        await supabase
          .from('teste_dieta')
          .update(dietData)
          .eq('user_id', user.id);
      } else {
        // Criar novo registro
        await supabase
          .from('teste_dieta')
          .insert(dietData);
      }

      // Atualizar status do quiz na tabela teste_app
      await supabase
        .from('teste_app')
        .update({ quiz_alimentar_concluido: true })
        .eq('user_id', user.id);

      console.log('Dados salvos no banco com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar dados no banco:', error);
    }
  };

  const handleNext = async () => {
    console.log('Saving selection:', selectedItems);
    setAnimatingStep(true);
    
    // Salvar seleção atual
    const newQuizData = {
      ...quizData,
      [`etapa${currentStep}`]: selectedItems
    };
    setQuizData(newQuizData);
    localStorage.setItem('quizAlimentar', JSON.stringify(newQuizData));

    setTimeout(async () => {
      if (currentStep < 5) {
        navigate(`/quiz-alimentar/${currentStep + 1}`);
      } else {
        // Quiz concluído - salvar no banco
        await saveToDatabase(newQuizData);
        localStorage.setItem('quizAlimentarConcluido', 'true');
        navigate('/loading-treino');
      }
      setAnimatingStep(false);
    }, 300);
  };

  const handleSkip = async () => {
    setAnimatingStep(true);
    
    // Pular etapa (útil para ceia ou quando não tem restrições)
    const newQuizData = {
      ...quizData,
      [`etapa${currentStep}`]: []
    };
    setQuizData(newQuizData);
    localStorage.setItem('quizAlimentar', JSON.stringify(newQuizData));

    setTimeout(async () => {
      if (currentStep < 5) {
        navigate(`/quiz-alimentar/${currentStep + 1}`);
      } else {
        // Quiz concluído - salvar no banco
        await saveToDatabase(newQuizData);
        localStorage.setItem('quizAlimentarConcluido', 'true');
        navigate('/loading-treino');
      }
      setAnimatingStep(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      navigate(`/quiz-alimentar/${currentStep - 1}`);
    } else {
      navigate('/onboarding');
    }
  };

  if (!currentQuiz) {
    return <div>Etapa não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* Header igual ao treino */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-pink-100 z-10">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          
          <div className="text-center">
            <h1 className="text-sm font-medium text-gray-700">Anamnese Alimentar</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">Etapa</span>
              <span className="text-sm font-bold text-pink-600">{currentStep}/5</span>
            </div>
          </div>
          
          <div className="w-8" />
        </div>
        
        {/* Barra de progresso igual ao treino */}
        <div className="px-4 pb-3">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-pink-400 to-pink-600' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-6 max-w-md mx-auto">
        
        {/* Título igual ao treino */}
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 space-y-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto border border-orange-200 shadow-sm">
            <Coffee className="text-orange-500" size={24} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">{currentQuiz.emoji}</span>
              <h2 className="text-xl font-bold text-gray-800">
                {currentQuiz.title}
              </h2>
            </div>
            
            <p className="text-gray-600 text-base leading-relaxed px-2">
              {currentQuiz.subtitle}
            </p>
          </div>
          
          {/* Contador de selecionados */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            <div className="flex items-center space-x-1">
              <X size={14} className="text-red-500" />
              <span className="text-sm text-gray-600">
                {selectedItems.length} {selectedItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Grid de alimentos otimizado */}
        <motion.div 
          className="grid grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {currentQuiz.foods.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleSelection(item.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-300 group ${
                selectedItems.includes(item.id)
                  ? 'border-red-300 bg-red-50 shadow-lg scale-95'
                  : 'border-gray-200 bg-white hover:border-pink-200 hover:shadow-md hover:scale-105'
              }`}
            >
              {/* Indicador de seleção */}
              <AnimatePresence>
                {selectedItems.includes(item.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <X size={12} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="text-center space-y-2">
                <div className="text-2xl">{item.emoji}</div>
                <p className={`text-sm font-medium transition-colors ${
                  selectedItems.includes(item.id) 
                    ? 'text-red-700' 
                    : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {item.name}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Opção de pular */}
        <div className="text-center mb-6">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
          >
            {currentStep === 5 ? 'Não faço esta refeição' : 'Não tenho restrições nesta refeição'}
          </button>
        </div>

        {/* Botão igual ao treino */}
        <motion.button
          onClick={handleNext}
          disabled={animatingStep}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            animatingStep
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 hover:shadow-xl'
          }`}
        >
          {animatingStep ? (
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              <Sparkles size={18} />
              <span>{currentStep === 5 ? 'Finalizar Anamnese Alimentar' : 'Continuar'}</span>
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
        
        {/* Informação igual ao treino */}
        <p className="text-center text-xs text-gray-500 mt-4">
          🍽️ Etapa {currentStep} de 5 - Você está indo muito bem!
        </p>

      </div>
    </div>
  );
};

export default QuizAlimentar;
