
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UserCompleteData {
  id?: string;
  universal_id?: string;
  user_id: string;
  nome_completo?: string;
  idade?: number;
  peso?: number;
  altura?: number;
  quiz_alimentar_data?: any;
  quiz_alimentar_completed_at?: string;
  quiz_treino_data?: any;
  quiz_treino_completed_at?: string;
  dados_pessoais_completed?: boolean;
  quiz_alimentar_completed?: boolean;
  quiz_treino_completed?: boolean;
  all_data_completed?: boolean;
  webhook_sent?: boolean;
  webhook_sent_at?: string;
  webhook_response?: any;
  created_at?: string;
  updated_at?: string;
}

export const useUserCompleteData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserCompleteData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_complete_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar dados do usuário:', error);
        return;
      }

      setUserData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const createOrUpdateUserData = async (updates: Partial<UserCompleteData>) => {
    if (!user) return false;

    setLoading(true);
    try {
      if (userData?.id) {
        // Atualizar registro existente
        const { data, error } = await supabase
          .from('user_complete_data')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Erro ao atualizar dados:', error);
          toast.error('Erro ao salvar dados');
          return false;
        }

        setUserData(data);
      } else {
        // Criar novo registro
        const { data, error } = await supabase
          .from('user_complete_data')
          .insert({
            user_id: user.id,
            ...updates
          })
          .select()
          .single();

        if (error) {
          console.error('Erro ao criar dados:', error);
          toast.error('Erro ao salvar dados');
          return false;
        }

        setUserData(data);
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error('Erro ao salvar dados');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDadosPessoais = async (nome: string, idade: number, peso: number, altura: number) => {
    return await createOrUpdateUserData({
      nome_completo: nome,
      idade,
      peso,
      altura,
      dados_pessoais_completed: true
    });
  };

  const updateQuizAlimentar = async (quizData: any) => {
    return await createOrUpdateUserData({
      quiz_alimentar_data: quizData,
      quiz_alimentar_completed: true,
      quiz_alimentar_completed_at: new Date().toISOString()
    });
  };

  const updateQuizTreino = async (quizData: any) => {
    return await createOrUpdateUserData({
      quiz_treino_data: quizData,
      quiz_treino_completed: true,
      quiz_treino_completed_at: new Date().toISOString()
    });
  };

  const sendWebhook = async () => {
    if (!userData?.universal_id || userData.webhook_sent) return false;

    try {
      const webhookUrl = 'https://webhook.sv-02.botfai.com.br/webhook/1613f464-324c-494d-945a-efedd0a0dbd5';
      
      const payload = {
        universal_id: userData.universal_id,
        user_id: userData.user_id,
        dados_pessoais: {
          nome_completo: userData.nome_completo,
          idade: userData.idade,
          peso: userData.peso,
          altura: userData.altura
        },
        quiz_alimentar: userData.quiz_alimentar_data,
        quiz_treino: userData.quiz_treino_data,
        completed_at: new Date().toISOString()
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.text();

      // Marcar webhook como enviado
      await createOrUpdateUserData({
        webhook_sent: true,
        webhook_sent_at: new Date().toISOString(),
        webhook_response: {
          status: response.status,
          data: responseData
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
      return false;
    }
  };

  return {
    userData,
    loading,
    updateDadosPessoais,
    updateQuizAlimentar,
    updateQuizTreino,
    sendWebhook,
    loadUserData
  };
};
