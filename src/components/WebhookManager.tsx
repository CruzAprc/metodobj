
import { useEffect } from 'react';
import { useUserCompleteData } from '@/hooks/useUserCompleteData';
import { toast } from 'sonner';

const WebhookManager = () => {
  const { userData, sendWebhook } = useUserCompleteData();

  useEffect(() => {
    // Verificar se todos os dados estão completos e o webhook ainda não foi enviado
    if (userData?.all_data_completed && !userData.webhook_sent) {
      console.log('Todos os dados completos, enviando webhook...');
      
      sendWebhook().then((success) => {
        if (success) {
          console.log('Webhook enviado com sucesso!');
          toast.success('Dados enviados com sucesso! 🎉');
        } else {
          console.error('Erro ao enviar webhook');
          toast.error('Erro ao enviar dados para processamento');
        }
      });
    }
  }, [userData?.all_data_completed, userData?.webhook_sent, sendWebhook]);

  return null; // Este componente não renderiza nada
};

export default WebhookManager;
