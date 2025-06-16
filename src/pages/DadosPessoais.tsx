import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Target, Calendar, Weight, Ruler } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FormData {
  nomeCompleto: string;
  idade: string;
  peso: string;
  altura: string;
}

interface FormErrors {
  nomeCompleto?: string;
  idade?: string;
  peso?: string;
  altura?: string;
}

const DadosPessoais = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    idade: '',
    peso: '',
    altura: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa o erro quando o usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
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
        } else if (parseInt(formData.idade) < 16 || parseInt(formData.idade) > 80) {
          newErrors.idade = 'Idade deve estar entre 16 e 80 anos! 💪';
        }
        break;
      case 3:
        if (!formData.peso) {
          newErrors.peso = 'Seu peso atual nos ajuda a personalizar sua dieta! ⚖️';
        } else if (parseFloat(formData.peso) < 30 || parseFloat(formData.peso) > 200) {
          newErrors.peso = 'Digite um peso válido entre 30kg e 200kg! 💕';
        }
        break;
      case 4:
        if (!formData.altura) {
          newErrors.altura = 'Sua altura é essencial para calcular suas necessidades! 📏';
        } else if (parseFloat(formData.altura) < 140 || parseFloat(formData.altura) > 220) {
          newErrors.altura = 'Digite uma altura válida entre 140cm e 220cm! ✨';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToDatabase = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não encontrado. Faça login novamente.');
      return false;
    }

    try {
      console.log('Salvando dados pessoais para o usuário:', user.id);
      console.log('Dados a serem salvos:', formData);

      // Salvar na tabela user_personal_data
      const personalData = {
        user_id: user.id,
        nome_completo: formData.nomeCompleto,
        idade: parseInt(formData.idade),
        peso: parseFloat(formData.peso),
        altura: parseFloat(formData.altura),
        completed_at: new Date().toISOString()
      };

      // Verificar se já existe um registro
      const { data: existingPersonalData, error: checkPersonalError } = await supabase
        .from('user_personal_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkPersonalError && checkPersonalError.code !== 'PGRST116') {
        console.error('Erro ao verificar dados pessoais existentes:', checkPersonalError);
        toast.error('Erro ao verificar dados existentes');
        return false;
      }

      let personalResult;
      if (existingPersonalData) {
        // Atualizar registro existente
        personalResult = await supabase
          .from('user_personal_data')
          .update({
            nome_completo: formData.nomeCompleto,
            idade: parseInt(formData.idade),
            peso: parseFloat(formData.peso),
            altura: parseFloat(formData.altura),
            updated_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Criar novo registro
        personalResult = await supabase
          .from('user_personal_data')
          .insert(personalData);
      }

      if (personalResult.error) {
        console.error('Erro ao salvar dados pessoais:', personalResult.error);
        toast.error('Erro ao salvar dados pessoais: ' + personalResult.error.message);
        return false;
      }

      // Atualizar também a tabela teste_app para manter compatibilidade
      const { data: existingTesteApp, error: checkTesteError } = await supabase
        .from('teste_app')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkTesteError && checkTesteError.code !== 'PGRST116') {
        console.error('Erro ao verificar teste_app existente:', checkTesteError);
      } else {
        let testeAppResult;
        if (existingTesteApp) {
          // Atualizar registro existente
          testeAppResult = await supabase
            .from('teste_app')
            .update({
              nome: formData.nomeCompleto,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);
        } else {
          // Criar novo registro
          testeAppResult = await supabase
            .from('teste_app')
            .insert({
              user_id: user.id,
              nome: formData.nomeCompleto,
              email: user.email || '',
              whatsapp: ''
            });
        }

        if (testeAppResult.error) {
          console.warn('Aviso ao salvar em teste_app:', testeAppResult.error);
          // Não bloqueia o processo se houver erro aqui
        }
      }

      // Log do evento - converter FormData para objeto JSON compatível
      try {
        const eventData = {
          nomeCompleto: formData.nomeCompleto,
          idade: formData.idade,
          peso: formData.peso,
          altura: formData.altura
        };

        await supabase.rpc('log_user_event', {
          p_user_id: user.id,
          p_event_type: 'personal_data_completed',
          p_event_data: eventData,
          p_table_reference: 'user_personal_data'
        });
      } catch (logError) {
        console.warn('Erro ao registrar evento:', logError);
        // Não bloqueia o processo se houver erro no log
      }

      console.log('Dados pessoais salvos com sucesso!');
      toast.success('Dados pessoais salvos com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro inesperado ao salvar dados pessoais:', error);
      toast.error('Erro inesperado ao salvar dados');
      return false;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar e enviar dados
      setIsSubmitting(true);
      try {
        console.log('Finalizando dados pessoais:', formData);
        
        const saved = await saveToDatabase();
        if (saved) {
          // Salvar no localStorage para usar em outras partes da aplicação
          localStorage.setItem('dadosPessoais', JSON.stringify(formData));
          
          toast.success('Dados pessoais salvos! Redirecionando...');
          
          // Aguardar um pouco antes de redirecionar
          setTimeout(() => {
            navigate('/loading');
          }, 1000);
        }
      } catch (error) {
        console.error('Erro no processo final:', error);
        toast.error('Erro ao finalizar dados pessoais');
      } finally {
        setIsSubmitting(false);
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
      icon: <Target size={32} className="text-blue-600" />,
      title: "Qual é o seu nome?",
      subtitle: "Queremos te conhecer melhor! 💕",
      field: "nomeCompleto" as keyof FormData,
      placeholder: "Digite seu nome completo",
      type: "text"
    },
    {
      id: 2,
      icon: <Calendar size={32} className="text-blue-600" />,
      title: "Quantos anos você tem?",
      subtitle: "Isso nos ajuda a personalizar seu plano! 🎂",
      field: "idade" as keyof FormData,
      placeholder: "Ex: 25",
      type: "number"
    },
    {
      id: 3,
      icon: <Weight size={32} className="text-blue-600" />,
      title: "Qual é o seu peso atual?",
      subtitle: "Sem julgamentos, apenas para criar sua dieta! ⚖️",
      field: "peso" as keyof FormData,
      placeholder: "Ex: 65",
      type: "number",
      unit: "kg"
    },
    {
      id: 4,
      icon: <Ruler size={32} className="text-blue-600" />,
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
        
        {/* Progress bar */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <motion.div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step <= currentStep 
                    ? 'bg-blue-600 w-6' 
                    : 'bg-slate-300 w-2'
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center border-2 border-blue-200">
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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                {currentStepData.title}
              </h2>
              <p className="text-slate-600 text-sm">
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
                            bg-blue-50/60 border-2 transition-all duration-300
                            focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300
                            ${errors[currentStepData.field] 
                              ? 'border-red-300 bg-red-50/30' 
                              : 'border-blue-200/50'
                            }`}
                  min={currentStepData.type === 'number' ? '1' : undefined}
                  disabled={isSubmitting}
                />
                {currentStepData.unit && (
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
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
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all
                     text-slate-600 hover:text-slate-800 hover:bg-slate-100
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium
                     bg-gradient-to-r from-blue-600 to-blue-800 text-white
                     hover:from-blue-700 hover:to-blue-900 
                     transform hover:scale-105 active:scale-95
                     transition-all duration-300 shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span>
              {isSubmitting 
                ? 'Salvando...' 
                : currentStep === 4 
                  ? 'Finalizar' 
                  : 'Continuar'
              }
            </span>
            {!isSubmitting && <ArrowRight size={18} />}
          </button>
        </div>

        {/* Indicador de etapa */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Etapa {currentStep} de 4
          </p>
        </div>

        {/* Mensagem motivacional */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-500 text-sm mt-6"
        >
          Estamos quase lá! Essas informações nos ajudam a criar o plano perfeito para você! 💕
        </motion.p>
      </div>
    </div>
  );
};

export default DadosPessoais;
