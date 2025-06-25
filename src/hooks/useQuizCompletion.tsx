import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UseQuizCompletionOptions {
  quizType: 'alimentar' | 'treino';
  redirectOnComplete?: string;
  redirectOnIncomplete?: string;
}

export const useQuizCompletion = (options: UseQuizCompletionOptions) => {
  const { quizType, redirectOnComplete, redirectOnIncomplete } = options;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const checkQuizCompletion = async () => {
    if (!user?.id) {
      setIsCheckingExisting(false);
      return false;
    }

    try {
      setIsCheckingExisting(true);
      
      // Verificar na tabela user_complete_data
      const field = quizType === 'alimentar' ? 'quiz_alimentar_completed' : 'quiz_treino_completed';
      
      const { data, error } = await supabase
        .from('user_complete_data')
        .select(field)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error(`Erro ao verificar ${quizType}:`, error);
        setIsCheckingExisting(false);
        return false;
      }

      const completed = !!(data && data[field as keyof typeof data]);
      setIsCompleted(completed);

      // Redirecionar se necessário
      if (completed && redirectOnComplete) {
        console.log(`Quiz ${quizType} já completo, redirecionando para ${redirectOnComplete}`);
        navigate(redirectOnComplete, { replace: true });
        return true;
      }

      if (!completed && redirectOnIncomplete) {
        console.log(`Quiz ${quizType} incompleto, redirecionando para ${redirectOnIncomplete}`);
        navigate(redirectOnIncomplete, { replace: true });
        return false;
      }

      setIsCheckingExisting(false);
      return completed;

    } catch (error) {
      console.error(`Erro inesperado ao verificar quiz ${quizType}:`, error);
      setIsCheckingExisting(false);
      return false;
    }
  };

  // Verificar automaticamente ao montar o componente
  useEffect(() => {
    checkQuizCompletion();
  }, [user?.id, quizType]);

  return {
    isCheckingExisting,
    isCompleted,
    checkQuizCompletion,
    refetch: checkQuizCompletion
  };
}; 