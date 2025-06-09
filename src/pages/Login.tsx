
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      navigate('/onboarding');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error('Erro ao fazer login: ' + error.message);
        }
      } else {
        toast.success('Login realizado com sucesso!');
        navigate('/onboarding');
      }
    } catch (error) {
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
      <div className="min-h-screen fitness-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center fitness-gradient-bg relative overflow-hidden">
      <div className="max-w-sm w-full mx-4">
        <div className="fitness-card animate-slide-in-up">
          <div className="text-center mb-8">
            {/* Logo com imagem */}
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6">
              <img 
                src="/lovable-uploads/af8f94bb-3ae5-412a-8ba9-17df5ae3e849.png" 
                alt="App da Juju Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <h2 className="text-3xl font-bold fitness-text mb-3">
              App da Juju
            </h2>
            <p className="text-gray-600 font-medium mb-2">Bem-vinda de volta!</p>
            <p className="text-gray-500 text-sm">
              Sua jornada fitness continua aqui! 💪✨
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
              />
            </div>

            <button 
              type="submit" 
              className="w-full fitness-button text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pink-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
              </div>
            </div>
            
            <p className="text-gray-600 mt-6 text-sm">
              Não tem conta?{' '}
              <button 
                onClick={() => navigate('/cadastro')}
                className="font-medium text-pink-600 hover:text-pink-700 underline"
              >
                Cadastre-se grátis! 💕
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
