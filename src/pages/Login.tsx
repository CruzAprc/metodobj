
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { LoginFormData } from '@/types';
import LoadingState, { LoadingButton, ImageWithLoading } from '@/components/LoadingState';
import { gradients } from '@/theme/colors';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in - SEMPRE para onboarding
  useEffect(() => {
    if (user && !loading) {
      console.log('Usuário já logado, redirecionando para onboarding...');
      navigate('/onboarding');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Por favor, preencha email e senha');
      return;
    }

    setIsSubmitting(true);
    console.log('Iniciando processo de login...');
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Erro no login:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Por favor, confirme seu email antes de fazer login');
        } else if (error.message.includes('Too many requests')) {
          toast.error('Muitas tentativas. Tente novamente em alguns minutos');
        } else {
          toast.error('Erro ao fazer login: ' + error.message);
        }
      } else {
        console.log('Login realizado com sucesso');
        toast.success('Login realizado com sucesso!');
        // Redirecionar SEMPRE para onboarding após login bem-sucedido
        navigate('/onboarding');
      }
    } catch (error: any) {
      console.error('Erro inesperado no login:', error);
      toast.error('Erro inesperado ao fazer login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <LoadingState 
        fullScreen={true} 
        message="Verificando autenticação..." 
        type="heartbeat"
        size="lg"
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: gradients.background }}>
      <div className="max-w-sm w-full mx-auto">
        <div className="fitness-card animate-slide-in-up">
          <div className="text-center mb-8">
            {/* Logo com loading otimizado */}
            <div className="flex items-center justify-center w-40 h-40 mx-auto mb-6">
              <ImageWithLoading
                src="/lovable-uploads/1880add2-ad7a-4dcf-aba6-659b952d3681.png"
                alt="Logo Juju Girl Fit"
                className="w-full h-full object-contain"
                containerClassName="w-40 h-40"
              />
            </div>
            
            <p className="text-gray-600 font-bold mb-2">Bem-vinda de volta!</p>
            <p className="text-gray-500 text-sm">
              Sua jornada fitness continua aqui!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="fitness-input" 
                placeholder="Seu email" 
                required 
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>

            <div>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="fitness-input" 
                placeholder="Sua senha" 
                required 
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            <LoadingButton
              type="submit"
              loading={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg"
            >
              Entrar
            </LoadingButton>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
              </div>
            </div>
            
            <p className="text-gray-600 mt-6 text-sm">
              Não tem conta?{' '}
              <button 
                onClick={() => navigate('/cadastro')} 
                className="font-medium text-blue-600 hover:text-blue-700 underline"
              >
                Cadastre-se grátis! 💙
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
