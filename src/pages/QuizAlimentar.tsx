import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, CheckCircle, Apple, 
  Target, Utensils, Heart, Clock, Activity, 
  AlertTriangle, Pill, Calendar, DollarSign
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';
import { gradients, colors } from '@/theme/colors';
import LoadingState, { LoadingButton } from '@/components/LoadingState';

interface QuizData {
  objetivo: string;
  restricoes: string[];
  frequenciaRefeicoes: string;
  nivelAtividade: string;
  suplementos: string[];
  orcamento: string;
}

const quizSteps = [
  {
    pergunta: 1,
    titulo: 'Qual é o seu principal objetivo?',
    subtitulo: 'Queremos criar uma dieta personalizada para seus sonhos',
    icon: <Target className="w-6 h-6" />,
    opcoes: [
      { id: 'Perder peso', texto: 'Perder Peso', subtexto: 'Reduzir medidas e peso', emoji: '⚖️', color: 'from-pink-400 to-rose-500' },
      { id: 'Ganhar massa muscular', texto: 'Ganhar Massa', subtexto: 'Aumentar músculos', emoji: '💪', color: 'from-pink-400 to-rose-500' },
      { id: 'Manter o peso atual', texto: 'Manter Peso', subtexto: 'Equilíbrio saudável', emoji: '⚖️', color: 'from-pink-400 to-rose-500' },
      { id: 'Melhorar a saúde geral', texto: 'Saúde Geral', subtexto: 'Bem-estar completo', emoji: '❤️', color: 'from-pink-400 to-rose-500' },
      { id: 'Aumentar energia e disposição', texto: 'Mais Energia', subtexto: 'Vitalidade diária', emoji: '⚡', color: 'from-pink-400 to-rose-500' }
    ],
    campo: 'objetivo' as keyof QuizData
  },
  {
    pergunta: 2,
    titulo: 'Você tem alguma restrição ou alergia alimentar?',
    subtitulo: 'Vamos adaptar sua dieta às suas necessidades e garantir sua segurança',
    icon: <AlertTriangle className="w-6 h-6" />,
    opcoes: [
      { id: 'vegetariano', texto: 'Vegetariano', subtexto: 'Não consumo carne', emoji: '🥬', color: 'from-pink-400 to-rose-500' },
      { id: 'vegano', texto: 'Vegano', subtexto: 'Nada de origem animal', emoji: '🌱', color: 'from-pink-400 to-rose-500' },
      { id: 'sem-gluten', texto: 'Sem Glúten', subtexto: 'Livre de glúten', emoji: '🚫', color: 'from-pink-400 to-rose-500' },
      { id: 'sem-lactose', texto: 'Sem Lactose', subtexto: 'Intolerante à lactose', emoji: '🥛', color: 'from-pink-400 to-rose-500' },
      { id: 'oleaginosas', texto: 'Alergia a Oleaginosas', subtexto: 'Castanhas, amendoim', emoji: '🥜', color: 'from-pink-400 to-rose-500' },
      { id: 'frutos-mar', texto: 'Alergia a Frutos do Mar', subtexto: 'Camarão, caranguejo', emoji: '🦐', color: 'from-pink-400 to-rose-500' },
      { id: 'ovos', texto: 'Alergia a Ovos', subtexto: 'Alergia a ovos', emoji: '🥚', color: 'from-pink-400 to-rose-500' },
      { id: 'low-carb', texto: 'Low Carb', subtexto: 'Baixo carboidrato', emoji: '🥩', color: 'from-pink-400 to-rose-500' },
      { id: 'nenhuma', texto: 'Nenhuma', subtexto: 'Posso comer de tudo', emoji: '✅', color: 'from-pink-400 to-rose-500' }
    ],
    campo: 'restricoes' as keyof QuizData,
    multipla: true
  },
  {
    pergunta: 3,
    titulo: 'Quantas refeições você faz por dia?',
    subtitulo: 'Vamos organizar sua rotina alimentar ideal',
    icon: <Utensils className="w-6 h-6" />,
    opcoes: [
      { id: '3', texto: '3 refeições', subtexto: 'Básico tradicional', emoji: '🍽️', color: 'from-pink-400 to-rose-500' },
      { id: '4', texto: '4 refeições', subtexto: 'Mais equilibrado', emoji: '🥗', color: 'from-pink-400 to-rose-500' },
      { id: '5', texto: '5 refeições', subtexto: 'Metabolismo ativo', emoji: '🍎', color: 'from-pink-400 to-rose-500' },
      { id: '6+', texto: '6+ refeições', subtexto: 'Alta frequência', emoji: '⏰', color: 'from-pink-400 to-rose-500' }
    ],
    campo: 'frequenciaRefeicoes' as keyof QuizData
  },
  {
    pergunta: 4,
    titulo: 'Qual seu nível de atividade física?',
    subtitulo: 'Precisamos ajustar suas calorias à sua rotina',
    icon: <Activity className="w-6 h-6" />,
    opcoes: [
      { id: 'sedentario', texto: 'Sedentário', subtexto: 'Pouca atividade', emoji: '📺', color: 'from-pink-400 to-rose-500' },
      { id: 'levemente-ativo', texto: 'Levemente Ativo', subtexto: '1-3 dias/semana', emoji: '🚶', color: 'from-pink-400 to-rose-500' },
      { id: 'moderadamente-ativo', texto: 'Moderado', subtexto: '3-5 dias/semana', emoji: '🏃', color: 'from-pink-400 to-rose-500' },
      { id: 'altamente-ativo', texto: 'Muito Ativo', subtexto: '6-7 dias/semana', emoji: '🏋️', color: 'from-pink-400 to-rose-500' }
    ],
    campo: 'nivelAtividade' as keyof QuizData
  },
  {
    pergunta: 5,
    titulo: 'Você usa algum suplemento?',
    subtitulo: 'Vamos incluir seus suplementos no plano alimentar',
    icon: <Pill className="w-6 h-6" />,
    opcoes: [
      { id: 'whey', texto: 'Whey Protein', subtexto: 'Proteína do soro', emoji: '🥤', color: 'from-pink-400 to-rose-500' },
      { id: 'creatina', texto: 'Creatina', subtexto: 'Para performance', emoji: '💪', color: 'from-pink-400 to-rose-500' },
      { id: 'vitaminas', texto: 'Vitaminas', subtexto: 'Complexos vitamínicos', emoji: '💊', color: 'from-pink-400 to-rose-500' },
      { id: 'omega3', texto: 'Ômega 3', subtexto: 'Ácidos graxos', emoji: '🐟', color: 'from-pink-400 to-rose-500' },
      { id: 'bcaa', texto: 'BCAA', subtexto: 'Aminoácidos', emoji: '⚡', color: 'from-pink-400 to-rose-500' },
      { id: 'nenhum', texto: 'Nenhum', subtexto: 'Não uso suplementos', emoji: '🚫', color: 'from-pink-400 to-rose-500' }
    ],
    campo: 'suplementos' as keyof QuizData,
    multipla: true
  },
  {
    pergunta: 6,
    titulo: 'Qual seu orçamento mensal para alimentação?',
    subtitulo: 'Vamos criar um plano que cabe no seu bolso',
    icon: <DollarSign className="w-6 h-6" />,
    opcoes: [
      { id: 'ate-300', texto: 'Até R$ 300', subtexto: 'Econômico', emoji: '💵', color: 'from-pink-400 to-rose-500' },
      { id: '300-500', texto: 'R$ 300-500', subtexto: 'Moderado', emoji: '💶', color: 'from-pink-400 to-rose-500' },
      { id: '500-800', texto: 'R$ 500-800', subtexto: 'Confortável', emoji: '💷', color: 'from-pink-400 to-rose-500' },
      { id: '800-1200', texto: 'R$ 800-1200', subtexto: 'Amplo', emoji: '💴', color: 'from-pink-400 to-rose-500' },
      { id: 'acima-1200', texto: 'Acima R$ 1200', subtexto: 'Premium', emoji: '💎', color: 'from-pink-400 to-rose-500' },
      { id: 'sem-limite', texto: 'Sem Limite', subtexto: 'Investimento total', emoji: '🏆', color: 'from-pink-400 to-rose-500' }
    ],
    campo: 'orcamento' as keyof QuizData
  }
];

const QuizAlimentar = () => {
  const navigate = useNavigate();
  const { pergunta } = useParams<{ pergunta: string }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);
  const [quizData, setQuizData] = useState<QuizData>({
    objetivo: '',
    restricoes: [],
    frequenciaRefeicoes: '',
    nivelAtividade: '',
    suplementos: [],
    orcamento: ''
  });

  const currentPergunta = parseInt(pergunta || '1');
  const currentStep = quizSteps.find(step => step.pergunta === currentPergunta);
  const progress = (currentPergunta / quizSteps.length) * 100;

  // TODOS OS HOOKS DEVEM ESTAR AQUI - ANTES DE QUALQUER LÓGICA CONDICIONAL
  const isMultipleChoice = currentStep?.multipla || false;
  const currentValue = currentStep ? quizData[currentStep.campo] : '';
  
  // Validação mais robusta para verificar se há seleção
  const hasSelection = React.useMemo(() => {
    if (!currentStep) return false;
    
    if (isMultipleChoice) {
      return Array.isArray(currentValue) && currentValue.length > 0;
    } else {
      return currentValue !== '' && currentValue !== null && currentValue !== undefined;
    }
  }, [currentValue, isMultipleChoice, currentStep]);

  useEffect(() => {
    const checkQuizCompletion = async () => {
      if (!user) {
        console.log('Quiz Alimentar: Usuário não logado');
        setIsCheckingExisting(false);
        return;
      }

      try {
        console.log('Quiz Alimentar: Verificando quiz existente...', {
          userId: user.id,
          currentRoute: window.location.pathname,
          isSpecificQuestion: !!pergunta
        });
        
        const { data: existingQuiz, error } = await supabase
          .from('user_quiz_data')
          .select('*')
          .eq('user_id', user.id)
          .eq('quiz_type', 'alimentar')
          .maybeSingle();

        console.log('Quiz Alimentar: Resultado da verificação:', {
          data: existingQuiz,
          error: error,
          hasCompletedAt: !!existingQuiz?.completed_at,
          isAccessingSpecificQuestion: !!pergunta
        });

        if (error && error.code !== 'PGRST116') {
          console.error('Quiz Alimentar: Erro ao verificar quiz existente:', error);
          setIsCheckingExisting(false);
          return;
        }

        if (!pergunta && existingQuiz && existingQuiz.completed_at) {
          console.log('Quiz Alimentar: Quiz completado + acesso sem pergunta específica -> redirecionando para quiz-treino');
          navigate('/quiz-treino/1');
          return;
        }

        console.log('Quiz Alimentar: Permitindo preenchimento do quiz');
        
        if (existingQuiz && existingQuiz.quiz_data) {
          console.log('Quiz Alimentar: Carregando dados existentes para edição');
          const data = existingQuiz.quiz_data as any;
          if (data && typeof data === 'object') {
            // Unir alergias antigas com restrições para manter compatibilidade
            const restricoesExistentes = Array.isArray(data.restricoes) ? data.restricoes : [];
            const alergiasExistentes = Array.isArray(data.alergias) ? data.alergias : [];
            const todasRestricoes = [...new Set([...restricoesExistentes, ...alergiasExistentes])];
            
            setQuizData({
              objetivo: data.objetivo || '',
              restricoes: todasRestricoes,
              frequenciaRefeicoes: data.frequenciaRefeicoes || '',
              nivelAtividade: data.nivelAtividade || '',
              suplementos: Array.isArray(data.suplementos) ? data.suplementos : [],
              orcamento: data.orcamento || ''
            });
          }
        }

        setIsCheckingExisting(false);
      } catch (error) {
        console.error('Quiz Alimentar: Erro inesperado ao verificar quiz:', error);
        setIsCheckingExisting(false);
      }
    };

    checkQuizCompletion();
  }, [user, navigate, pergunta]);

  const handleOptionSelect = (opcaoId: string) => {
    if (!currentStep) return;

    const { campo, multipla } = currentStep;
    
    console.log('handleOptionSelect - Debug:', {
      opcaoId,
      campo,
      multipla,
      currentQuizData: quizData[campo]
    });

    if (multipla) {
      setQuizData(prev => {
        const currentValues = prev[campo] as string[];
        const newValues = currentValues.includes(opcaoId)
          ? currentValues.filter(id => id !== opcaoId)
          : [...currentValues, opcaoId];
        
        console.log('Multipla escolha - Novos valores:', newValues);
        
        return { ...prev, [campo]: newValues };
      });
    } else {
      console.log('Escolha única - Definindo valor:', opcaoId);
      setQuizData(prev => ({ ...prev, [campo]: opcaoId }));
    }
  };

  const updateCompleteProfile = async (quizData: QuizData) => {
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    try {
      console.log('📝 Processando dados para perfil completo:', quizData);

      // Extrair alergias das restrições para manter compatibilidade
      const restricoes = quizData.restricoes || [];
      const alergiaIds = ['oleaginosas', 'frutos-mar', 'ovos', 'sem-lactose', 'sem-gluten'];
      const alergiasSelecionadas = restricoes.filter(restricao => alergiaIds.includes(restricao));
      const restricoesPuras = restricoes.filter(restricao => !alergiaIds.includes(restricao));

      const profileData = {
        user_id: user.id,
        objetivo_alimentar: quizData.objetivo,
        restricoes_alimentares: restricoesPuras,
        preferencias_alimentares: [], // Valor padrão para campo removido
        frequencia_refeicoes: quizData.frequenciaRefeicoes,
        nivel_atividade: quizData.nivelAtividade,
        alergias: alergiasSelecionadas, // Mantém alergias separadas para webhook
        suplementos: quizData.suplementos,
        horario_preferencia: 'flexivel', // Valor padrão para campo removido
        orcamento: quizData.orcamento,
        quiz_alimentar_completed: true,
        updated_at: new Date().toISOString()
      };

      console.log('📝 Dados do perfil a serem salvos:', profileData);

      // Verificar se perfil já existe
      const { data: existingProfile } = await supabase
        .from('user_complete_profile')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      let error = null;

      if (existingProfile) {
        // Atualizar perfil existente
        const result = await supabase
          .from('user_complete_profile')
          .update(profileData)
          .eq('user_id', user.id);
        error = result.error;
      } else {
        // Inserir novo perfil
        const result = await supabase
          .from('user_complete_profile')
          .insert(profileData);
        error = result.error;
      }

      if (error) {
        console.error('❌ Erro ao atualizar perfil consolidado:', error);
        throw new Error(`Erro ao atualizar perfil: ${error.message}`);
      }

      console.log('✅ Perfil consolidado atualizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro crítico ao atualizar perfil consolidado:', error);
      throw new Error(`Falha ao atualizar perfil: ${error.message}`);
    }
  };

  const sendCompleteDataToWebhook = async () => {
    if (!user) return;

    try {
      console.log('Verificando se todos os dados estão completos para envio ao webhook...');
      
      const { data: completeProfile, error } = await supabase
        .from('user_complete_profile')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil completo:', error);
        return;
      }

      if (completeProfile && completeProfile.all_data_completed && !completeProfile.webhook_sent) {
        console.log('Todos os dados completos! Enviando para webhook...');
        
        const { data: userData } = await supabase
          .from('teste_app')
          .select('email, nome')
          .eq('user_id', user.id)
          .single();

        const webhookPayload = {
          user_id: user.id,
          universal_id: completeProfile.universal_id,
          email: userData?.email || user.email,
          nome: userData?.nome || completeProfile.nome_completo,
          dados_completos: {
            dados_pessoais: {
              nome_completo: completeProfile.nome_completo,
              data_nascimento: completeProfile.data_nascimento,
              altura: completeProfile.altura,
              peso_atual: completeProfile.peso_atual,
              sexo: completeProfile.sexo
            },
            quiz_alimentar: {
              objetivo: completeProfile.objetivo_alimentar,
              restricoes: completeProfile.restricoes_alimentares,
              preferencias: completeProfile.preferencias_alimentares,
              frequencia_refeicoes: completeProfile.frequencia_refeicoes,
              nivel_atividade: completeProfile.nivel_atividade,
              alergias: completeProfile.alergias,
              suplementos: completeProfile.suplementos,
              horario_preferencia: completeProfile.horario_preferencia,
              orcamento: completeProfile.orcamento
            },
            quiz_treino: {
              experiencia: completeProfile.experiencia_treino,
              frequencia: completeProfile.frequencia_treino,
              objetivo: completeProfile.objetivo_treino,
              limitacoes: completeProfile.limitacoes_fisicas,
              preferencias: completeProfile.preferencias_treino,
              tempo_disponivel: completeProfile.tempo_disponivel
            }
          },
          timestamp: new Date().toISOString()
        };

        console.log('Enviando dados completos para webhook:', webhookPayload);

        const webhookResponse = await fetch('https://webhook.sv-02.botfai.com.br/webhook/1613f464-324c-494d-945a-efedd0a0dbd5', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });

        let webhookResult = null;
        if (webhookResponse.ok) {
          webhookResult = await webhookResponse.json();
          console.log('Dados enviados com sucesso para o webhook');
          
          await supabase
            .from('user_complete_profile')
            .update({
              webhook_sent: true,
              webhook_sent_at: new Date().toISOString(),
              webhook_response: webhookResult
            })
            .eq('user_id', user.id);
            
          toast.success('Dados completos enviados com sucesso!');
        } else {
          console.error('Erro no webhook:', webhookResponse.statusText);
          toast.error('Erro ao enviar dados completos');
        }
      }
    } catch (error) {
      console.error('Erro ao enviar dados completos para webhook:', error);
    }
  };

  const handleSubmit = async (data: QuizData) => {
    if (!user) {
      console.error('Usuário não logado');
      return;
    }

    console.log('🔍 Dados para submissão:', data);

    // Verificar se campos obrigatórios estão preenchidos
    const requiredFields = ['objetivo', 'frequenciaRefeicoes', 'nivelAtividade', 'orcamento'];
    const missingFields = requiredFields.filter(field => !data[field as keyof QuizData]);
    
    if (missingFields.length > 0) {
      console.error('Campos obrigatórios faltando:', missingFields);
      toast.error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('💾 Salvando no banco de dados...');
      const universalId = crypto.randomUUID();

      // Primeiro, verificar se já existe um registro
      const { data: existingRecord } = await supabase
        .from('user_quiz_data')
        .select('id')
        .eq('user_id', user.id)
        .eq('quiz_type', 'alimentar')
        .single();

      let dbError = null;

      if (existingRecord) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('user_quiz_data')
          .update({
            quiz_data: data as any,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('quiz_type', 'alimentar');
        dbError = error;
      } else {
        // Inserir novo registro
        const { error } = await supabase
          .from('user_quiz_data')
          .insert({
            user_id: user.id,
            quiz_type: 'alimentar',
            quiz_data: data as any,
            universal_id: universalId,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        dbError = error;
      }

      if (dbError) {
        console.error('❌ Erro ao salvar no banco:', dbError);
        throw new Error(`Erro no banco de dados: ${dbError.message}`);
      }
      console.log('✅ Salvo no banco com sucesso');

      console.log('📝 Atualizando perfil completo...');
      await updateCompleteProfile(data);
      console.log('✅ Perfil atualizado com sucesso');

      console.log('🌐 Enviando para webhook...');
      await sendCompleteDataToWebhook();
      console.log('✅ Webhook enviado com sucesso');

      console.log('📊 Logando evento...');
      await supabase.rpc('log_user_event', {
        p_user_id: user.id,
        p_event_type: 'quiz_alimentar_completed',
        p_event_data: JSON.parse(JSON.stringify(data))
      });
      console.log('✅ Evento logado com sucesso');

      toast.success('Dados alimentares salvos com sucesso!');
      navigate('/quiz-treino/1');
      
    } catch (error: any) {
      console.error('❌ Erro detalhado ao salvar:', {
        message: error.message,
        error: error,
        stack: error.stack
      });
      toast.error(`Erro ao salvar dados: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!currentStep) return;

    const { campo, multipla } = currentStep;
    const value = quizData[campo];
    
    console.log('handleNext - Debug:', {
      campo,
      multipla,
      value,
      valueType: typeof value,
      isArray: Array.isArray(value),
      arrayLength: Array.isArray(value) ? value.length : 'N/A',
      currentPergunta,
      totalSteps: quizSteps.length
    });
    
    // Validação mais específica
    let hasValidSelection = false;
    
    if (multipla) {
      hasValidSelection = Array.isArray(value) && value.length > 0;
    } else {
      hasValidSelection = value !== '' && value !== null && value !== undefined;
    }
    
    console.log('hasValidSelection:', hasValidSelection);
    
    if (!hasValidSelection) {
      toast.error('Por favor, selecione uma opção antes de continuar');
      return;
    } 
    if (currentPergunta < quizSteps.length) {
      console.log('Navegando para próxima pergunta:', currentPergunta + 1);
      navigate(`/quiz-alimentar/${currentPergunta + 1}`);
    } else {
      console.log('Finalizando quiz...');
      await handleSubmit(quizData);
    }
  };

  const handlePrevious = () => {
    if (currentPergunta > 1) {
      navigate(`/quiz-alimentar/${currentPergunta - 1}`);
    } else {
      navigate('/dados-pessoais');
    }
  };

  if (isCheckingExisting) {
    return (
      <LoadingState 
        fullScreen={true} 
        message="Verificando dados..." 
        type="heartbeat"
        size="lg"
      />
    );
  }


  
  console.log('Render - Debug Estado:', {
    currentStep: currentStep?.campo,
    currentValue,
    isMultipleChoice,
    hasSelection,
    pergunta: currentPergunta
  });

  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: gradients.background }}>
        <div className="text-center">
          <p className="text-red-500 mb-4">Pergunta não encontrada</p>
          <button 
            onClick={() => navigate('/quiz-alimentar/1')}
            className="text-pink-600 underline"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4" style={{ background: gradients.background }}>
      <div className="w-full max-w-2xl">
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-pink-200/30 p-3 sm:p-6 mb-3 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white">
                {currentStep.icon}
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-pink-700">
                  Alimentação - Juju
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Pergunta {currentPergunta} de {quizSteps.length}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-bold text-pink-600">
                {Math.round(progress)}%
              </div>
              <div className="text-xs text-gray-500">Completo</div>
            </div>
          </div>

          <div className="w-full bg-pink-100 rounded-full h-2 sm:h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-pink-200/30 p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPergunta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 sm:space-y-8"
            >
              
              <div className="text-center space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-700 leading-tight">
                  {currentStep.titulo}
                </h2>
                <p className="text-gray-600 text-base sm:text-lg px-2">
                  {currentStep.subtitulo}
                </p>
                <div className="text-sm text-gray-500">
                  {isMultipleChoice ? '✨ Selecione todas que se aplicam' : '🎯 Escolha uma opção'}
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                {currentStep.opcoes.map((opcao, index) => {
                  const isSelected = isMultipleChoice
                    ? Array.isArray(currentValue) && currentValue.includes(opcao.id)
                    : currentValue === opcao.id;

                  return (
                    <motion.button
                      key={opcao.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionSelect(opcao.id)}
                      className={`relative group p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden min-h-[80px] sm:min-h-[100px] ${
                        isSelected
                          ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md'
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`absolute inset-0 bg-gradient-to-br ${opcao.color} opacity-10`}
                        />
                      )}
                      
                      <div className="relative flex items-center space-x-3 sm:space-x-4">
                        <div className={`text-2xl sm:text-3xl transform transition-transform duration-300 flex-shrink-0 ${
                          isSelected ? 'scale-110' : 'group-hover:scale-105'
                        }`}>
                          {opcao.emoji}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold text-base sm:text-lg mb-1 leading-tight ${
                            isSelected ? 'text-pink-700' : 'text-gray-800'
                          }`}>
                            {opcao.texto}
                          </div>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            {opcao.subtexto}
                          </div>
                        </div>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-pink-500 flex-shrink-0"
                          >
                            <CheckCircle size={20} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-4 sm:mt-8 gap-3 sm:gap-4">
          <button
            onClick={handlePrevious}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300
                     text-gray-600 hover:text-gray-800 hover:bg-white/50 backdrop-blur-sm
                     disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 text-sm sm:text-base min-h-[48px] flex-1 max-w-[140px]"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </button>

          <LoadingButton
            onClick={handleNext}
            loading={isSubmitting}
            disabled={!hasSelection}
            className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-medium
                     transition-all duration-300 shadow-lg flex-1 text-sm sm:text-base min-h-[48px]
                     ${hasSelection 
                       ? 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white transform hover:scale-105 active:scale-95' 
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
          >
            <span>
              {hasSelection 
                ? (currentPergunta === quizSteps.length ? 'Finalizar' : 'Continuar')
                : 'Selecione uma opção'
              }
            </span>
            {!isSubmitting && hasSelection && <ArrowRight size={16} />}
          </LoadingButton>
        </div>

        <div className="text-center mt-4 sm:mt-6 space-y-2">
          <div className="flex justify-center gap-1 sm:gap-2">
            {quizSteps.map((_, index) => (
              <motion.div
                key={index}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  index + 1 <= currentPergunta 
                    ? 'bg-pink-400 w-6 sm:w-8' 
                    : 'bg-gray-300 w-1.5 sm:w-2'
                }`}
                animate={{
                  scale: index + 1 === currentPergunta ? 1.2 : 1
                }}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 px-4">
            🌸 Alimentação - Juju • Próximo: Treino
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizAlimentar;
