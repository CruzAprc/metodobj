
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserProgress = async () => {
      if (!user) {
        console.log('Onboarding: Usuário não logado, redirecionando para login');
        navigate('/login');
        return;
      }

      try {
        console.log('Onboarding: Verificando progresso do usuário:', {
          userId: user.id,
          email: user.email
        });

        // Verificar dados pessoais
        const { data: personalData, error: personalError } = await supabase
          .from('user_personal_data')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('Onboarding: Dados pessoais:', { personalData, personalError });

        if (!personalData && (!personalError || personalError.code === 'PGRST116')) {
          console.log('Onboarding: Dados pessoais não encontrados, redirecionando para dados-pessoais');
          navigate('/dados-pessoais');
          return;
        }

        // Verificar quiz alimentar
        const { data: dietQuiz, error: dietError } = await supabase
          .from('user_quiz_data')
          .select('*')
          .eq('user_id', user.id)
          .eq('quiz_type', 'alimentar')
          .maybeSingle();

        console.log('Onboarding: Quiz alimentar:', { dietQuiz, dietError });

        if (!dietQuiz && (!dietError || dietError.code === 'PGRST116')) {
          console.log('Onboarding: Quiz alimentar não encontrado, redirecionando para quiz-alimentar');
          navigate('/quiz-alimentar/1');
          return;
        }

        // Verificar quiz de treino
        const { data: workoutQuiz, error: workoutError } = await supabase
          .from('user_quiz_data')
          .select('*')
          .eq('user_id', user.id)
          .eq('quiz_type', 'treino')
          .maybeSingle();

        console.log('Onboarding: Quiz treino:', { workoutQuiz, workoutError });

        if (!workoutQuiz && (!workoutError || workoutError.code === 'PGRST116')) {
          console.log('Onboarding: Quiz treino não encontrado, redirecionando para quiz-treino');
          navigate('/quiz-treino/1');
          return;
        }

        // Se chegou até aqui, tudo está completo
        console.log('Onboarding: Todos os dados completos, redirecionando para dashboard');
        navigate('/dashboard');

      } catch (error) {
        console.error('Onboarding: Erro ao verificar progresso:', error);
        // Em caso de erro, redirecionar para dados pessoais por segurança
        navigate('/dados-pessoais');
      } finally {
        setIsChecking(false);
      }
    };

    checkUserProgress();
  }, [user, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-sky-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full mx-auto"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">💪</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent">
              Verificando seu progresso...
            </h2>
            <p className="text-gray-600">
              Estamos checando onde você parou para continuar sua jornada!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Este return nunca deveria ser alcançado, mas é necessário para o TypeScript
  return null;
};

export default Onboarding;
