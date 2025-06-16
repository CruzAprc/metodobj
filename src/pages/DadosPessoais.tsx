import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DadosPessoais = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome_completo: '',
    data_nascimento: '',
    altura: '',
    peso_atual: '',
    sexo: '',
    nivel_atividade: '',
    objetivo_principal: '',
    restricoes_alimentares: '',
    historico_medico: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirecionar imediatamente para onboarding
  useEffect(() => {
    navigate('/onboarding');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-sky-500 bg-clip-text text-transparent mb-2">
            Redirecionando...
          </h1>
          <p className="text-gray-600">
            Aguarde um momento...
          </p>
        </div>
      </div>
    </div>
  );
};

export default DadosPessoais;
