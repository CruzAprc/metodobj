
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Calendar, Weight, Ruler } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  nomeCompleto: string;
  idade: string;
  peso: string;
  altura: string;
}

interface Errors {
  nomeCompleto?: string;
  idade?: string;
  peso?: string;
  altura?: string;
}

const DadosPessoais = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    idade: '',
    peso: '',
    altura: ''
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa o erro quando o usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};
    
    switch (step) {
      case 1:
        if (!formData.nomeCompleto.trim()) {
          newErrors.nomeCompleto = 'Seu nome é importante para personalizarmos sua experiência! 💕';
        } else if (formData.nomeCompleto.trim().length < 2) {
          newErrors.nomeCompleto = 'Digite seu nome completo, querida! ✨';
        }
        break;
      case 2:
        if (!formData.idade) {
          newErrors.idade = 'Precisamos da sua idade para criar o plano perfeito! 🎂';
        } else if (Number(formData.idade) < 16 || Number(formData.idade) > 80) {
          newErrors.idade = 'Idade deve estar entre 16 e 80 anos! 💪';
        }
        break;
      case 3:
        if (!formData.peso) {
          newErrors.peso = 'Seu peso atual nos ajuda a personalizar sua dieta! ⚖️';
        } else if (Number(formData.peso) < 30 || Number(formData.peso) > 200) {
          newErrors.peso = 'Digite um peso válido entre 30kg e 200kg! 💕';
        }
        break;
      case 4:
        if (!formData.altura) {
          newErrors.altura = 'Sua altura é essencial para calcular suas necessidades! 📏';
        } else if (Number(formData.altura) < 120 || Number(formData.altura) > 220) {
          newErrors.altura = 'Digite uma altura válida entre 120cm e 220cm! ✨';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToDatabase = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Atualizar dados pessoais na tabela teste_app
      const { error } = await supabase
        .from('teste_app')
        .update({
          nome: formData.nomeCompleto,
          // Podemos adicionar idade, peso e altura se necessário na tabela
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao salvar dados:', error);
        return false;
      }

      console.log('Dados pessoais salvos com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        // Finalizar e enviar dados
        console.log('Dados coletados:', formData);
        const saved = await saveToDatabase();
        if (saved) {
          // Salvar no localStorage para usar em outras partes da aplicação
          localStorage.setItem('dadosPessoais', JSON.stringify(formData));
          navigate('/quiz-alimentar/1');
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/onboarding');
    }
  };

  const steps = [
    {
      id: 1,
      icon: <User size={32} className="text-pink-500" />,
      title: "Qual é o seu nome?",
      subtitle: "Queremos te conhecer melhor! 💕",
      field: "nomeCompleto" as keyof FormData,
      placeholder: "Digite seu nome completo",
      type: "text"
    },
    {
      id: 2,
      icon: <Calendar size={32} className="text-purple-500" />,
      title: "Quantos anos você tem?",
      subtitle: "Isso nos ajuda a personalizar seu plano! 🎂",
      field: "idade" as keyof FormData,
      placeholder: "Ex: 25",
      type: "number"
    },
    {
      id: 3,
      icon: <Weight size={32} className="text-blue-500" />,
      title: "Qual é o seu peso atual?",
      subtitle: "Sem julgamentos, apenas para criar sua dieta! ⚖️",
      field: "peso" as keyof FormData,
      placeholder: "Ex: 65",
      type: "number",
      unit: "kg"
    },
    {
      id: 4,
      icon: <Ruler size={32} className="text-green-500" />,
      title: "Qual é a sua altura?",
      subtitle: "Última informação para começarmos! 📏",
      field: "altura" as keyof FormData,
      placeholder: "Ex: 165",
      type: "number",
      unit: "cm"
    }
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Ilustrações de fundo */}
      <div className="absolute top-20 right-10 opacity-10 hidden md:block">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center">
          <span className="text-3xl">✨</span>
        </div>
      </div>
      
      <div className="absolute bottom-20 left-10 opacity-10 hidden md:block">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full flex items-center justify-center">
          <span className="text-2xl">💪</span>
        </div>
      </div>

      {/* Card principal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200/50 p-8 relative"
      >
        
        {/* Progress bar */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <motion.div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-pink-400 to-pink-500' 
                    : 'bg-gray-200'
                }`}
                animate={{
                  scale: step === currentStep ? 1.2 : 1
                }}
              />
            ))}
          </div>
        </div>

        {/* Ícone animado */}
        <motion.div 
          key={currentStep}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center border border-pink-200">
            {currentStepData.icon}
          </div>
        </motion.div>

        {/* Conteúdo do step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6"
          >
            {/* Título */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {currentStepData.subtitle}
              </p>
            </div>

            {/* Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={currentStepData.type}
                  value={formData[currentStepData.field]}
                  onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
                  placeholder={currentStepData.placeholder}
                  className={`w-full px-6 py-4 rounded-2xl text-center text-lg font-medium
                            bg-pink-50/60 border-2 transition-all duration-300
                            focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300
                            ${errors[currentStepData.field] 
                              ? 'border-red-300 bg-red-50/30' 
                              : 'border-pink-200/50'
                            }`}
                  min={currentStepData.type === 'number' ? '1' : undefined}
                />
                {currentStepData.unit && (
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                    {currentStepData.unit}
                  </span>
                )}
              </div>
              
              {/* Mensagem de erro */}
              <AnimatePresence>
                {errors[currentStepData.field] && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
                  >
                    {errors[currentStepData.field]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
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
                     bg-gradient-to-r from-pink-500 to-pink-600 text-white
                     hover:from-pink-600 hover:to-pink-700 
                     transform hover:scale-105 active:scale-95
                     transition-all duration-300 shadow-lg"
          >
            <span>{currentStep === 4 ? 'Finalizar' : 'Continuar'}</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Indicador de etapa */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Etapa {currentStep} de 4
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
        Estamos quase lá! Essas informações nos ajudam a criar o plano perfeito para você! 💕
      </motion.p>
    </div>
  );
};

export default DadosPessoais;
