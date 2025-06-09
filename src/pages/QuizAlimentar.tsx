import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Heart, Apple, Utensils, Coffee } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const QuizAlimentar = () => {
  const navigate = useNavigate();
  const { etapa } = useParams();
  const { user } = useAuth();
  const [currentEtapa, setCurrentEtapa] = useState(1);
  const [respostas, setRespostas] = useState({});
  const [errors, setErrors] = useState({});

  // Usar parâmetro da URL ou padrão
  useEffect(() => {
    if (etapa) {
      setCurrentEtapa(Number(etapa));
    }
  }, [etapa]);

  const handleInputChange = (field: string, value: any) => {
    setRespostas(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEtapa = (etapa: number): boolean => {
    const newErrors: any = {};

    switch (etapa) {
      case 1:
        if (!respostas['preferenciaAlimentar']) {
          newErrors['preferenciaAlimentar'] = 'Por favor, selecione sua preferência alimentar! 💕';
        }
        break;
      case 2:
        if (!respostas['alimentosFavoritos'] || respostas['alimentosFavoritos'].length === 0) {
          newErrors['alimentosFavoritos'] = 'Selecione pelo menos um alimento favorito! ✨';
        }
        break;
      case 3:
        if (!respostas['refeicoesDiarias']) {
          newErrors['refeicoesDiarias'] = 'Informe quantas refeições você costuma fazer por dia! 💪';
        }
        break;
      case 4:
        if (!respostas['bebidaPreferida']) {
          newErrors['bebidaPreferida'] = 'Qual sua bebida preferida? ☕';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToDatabase = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('teste_app')
        .update({
          preferencia_alimentar: respostas['preferenciaAlimentar'],
          alimentos_favoritos: respostas['alimentosFavoritos'],
          refeicoes_diarias: respostas['refeicoesDiarias'],
          bebida_preferida: respostas['bebidaPreferida'],
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao salvar respostas do quiz alimentar:', error);
        return false;
      }

      console.log('Respostas do quiz alimentar salvas com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao salvar respostas do quiz alimentar:', error);
      return false;
    }
  };

  const handleNext = async () => {
    if (validateEtapa(currentEtapa)) {
      if (currentEtapa < 4) {
        const nextEtapa = currentEtapa + 1;
        setCurrentEtapa(nextEtapa);
        navigate(`/quiz-alimentar/${nextEtapa}`);
      } else {
        // Finalizar quiz
        console.log('Respostas do quiz alimentar:', respostas);
        const saved = await saveToDatabase();
        if (saved) {
          localStorage.setItem('quizAlimentar', JSON.stringify(respostas));
          navigate('/quiz-treino/1');
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentEtapa > 1) {
      const prevEtapa = currentEtapa - 1;
      setCurrentEtapa(prevEtapa);
      navigate(`/quiz-alimentar/${prevEtapa}`);
    } else {
      navigate('/dados-pessoais');
    }
  };

  const etapas = [
    {
      id: 1,
      icon: <Heart size={32} className="text-red-500" />,
      title: "Qual é a sua preferência alimentar?",
      subtitle: "Vegetariano, vegano, onívoro? 💕",
      field: "preferenciaAlimentar",
      options: [
        { value: 'vegetariano', label: 'Vegetariano' },
        { value: 'vegano', label: 'Vegano' },
        { value: 'onivoro', label: 'Onívoro' }
      ],
      type: "radio"
    },
    {
      id: 2,
      icon: <Apple size={32} className="text-orange-500" />,
      title: "Quais são seus alimentos favoritos?",
      subtitle: "Escolha seus preferidos! ✨",
      field: "alimentosFavoritos",
      options: [
        { value: 'frutas', label: 'Frutas' },
        { value: 'legumes', label: 'Legumes' },
        { value: 'carnes', label: 'Carnes' },
        { value: 'grãos', label: 'Grãos' }
      ],
      type: "checkbox"
    },
    {
      id: 3,
      icon: <Utensils size={32} className="text-yellow-500" />,
      title: "Quantas refeições você costuma fazer por dia?",
      subtitle: "Seja sincero! 💪",
      field: "refeicoesDiarias",
      options: [
        { value: '3', label: '3 refeições' },
        { value: '4', label: '4 refeições' },
        { value: '5+', label: '5+ refeições' }
      ],
      type: "radio"
    },
    {
      id: 4,
      icon: <Coffee size={32} className="text-brown-500" />,
      title: "Qual é a sua bebida preferida?",
      subtitle: "Água, café, suco? ☕",
      field: "bebidaPreferida",
      options: [
        { value: 'agua', label: 'Água' },
        { value: 'cafe', label: 'Café' },
        { value: 'suco', label: 'Suco' },
        { value: 'refrigerante', label: 'Refrigerante' }
      ],
      type: "radio"
    }
  ];

  const currentEtapaData = etapas[currentEtapa - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Ilustrações de fundo */}
      <div className="absolute top-20 right-10 opacity-10 hidden md:block">
        <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-green-400 rounded-full flex items-center justify-center">
          <span className="text-3xl">🍎</span>
        </div>
      </div>
      
      <div className="absolute bottom-20 left-10 opacity-10 hidden md:block">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-2xl">💪</span>
        </div>
      </div>

      {/* Card principal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-200/50 p-8 relative"
      >
        
        {/* Progress bar */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((etapa) => (
              <motion.div
                key={etapa}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  etapa <= currentEtapa 
                    ? 'bg-gradient-to-r from-green-400 to-green-500' 
                    : 'bg-gray-200'
                }`}
                animate={{
                  scale: etapa === currentEtapa ? 1.2 : 1
                }}
              />
            ))}
          </div>
        </div>

        {/* Ícone animado */}
        <motion.div 
          key={currentEtapa}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center border border-green-200">
            {currentEtapaData.icon}
          </div>
        </motion.div>

        {/* Conteúdo do step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEtapa}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6"
          >
            {/* Título */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentEtapaData.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {currentEtapaData.subtitle}
              </p>
            </div>

            {/* Opções */}
            <div className="space-y-4">
              {currentEtapaData.options && currentEtapaData.options.map((option) => (
                <label 
                  key={option.value}
                  className="flex items-center justify-start bg-green-50/60 rounded-2xl p-4 border border-green-200/50 hover:border-green-300 transition-colors cursor-pointer"
                >
                  <input
                    type={currentEtapaData.type}
                    name={currentEtapaData.field}
                    value={option.value}
                    checked={currentEtapaData.type === 'radio' ? respostas[currentEtapaData.field] === option.value : respostas[currentEtapaData.field]?.includes(option.value)}
                    onChange={(e) => {
                      if (currentEtapaData.type === 'radio') {
                        handleInputChange(currentEtapaData.field, option.value);
                      } else {
                        const checked = e.target.checked;
                        setRespostas(prev => {
                          let newValues = prev[currentEtapaData.field] || [];
                          if (checked) {
                            newValues = [...newValues, option.value];
                          } else {
                            newValues = newValues.filter(v => v !== option.value);
                          }
                          return { ...prev, [currentEtapaData.field]: newValues };
                        });
                      }
                    }}
                    className="mr-4 accent-green-500 h-5 w-5"
                  />
                  <span className="text-gray-700 font-medium">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Mensagem de erro */}
            <AnimatePresence>
              {errors[currentEtapaData.field] && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
                >
                  {errors[currentEtapaData.field]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Botões de navegação */}
        <div className="flex justify-between items-center mt-8 space-x-4">
          <button
            onClick={handlePrevious}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all
                     text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium
                     bg-gradient-to-r from-green-500 to-green-600 text-white
                     hover:from-green-600 hover:to-green-700 
                     transform hover:scale-105 active:scale-95
                     transition-all duration-300 shadow-lg"
          >
            <span>{currentEtapa === 4 ? 'Finalizar' : 'Continuar'}</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Indicador de etapa */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Etapa {currentEtapa} de 4
          </p>
        </div>
      </motion.div>

      {/* Mensagem motivacional */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-500 text-sm mt-6 max-w-md"
      >
        Estamos quase lá! Suas respostas nos ajudarão a personalizar seu plano alimentar! 💕
      </motion.p>
    </div>
  );
};

export default QuizAlimentar;
