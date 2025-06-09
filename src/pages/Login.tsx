
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
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
      <div className="min-h-screen gym-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gym-gradient-bg">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="gym-card animate-slide-in-bottom">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-black rounded-2xl mx-auto mb-6 flex items-center justify-center animate-power-pulse">
              <span className="text-3xl">🏋️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vinda de volta!</h2>
            <p className="text-gray-600 font-medium">Entre na sua conta para continuar evoluindo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="gym-input"
                placeholder="seu@email.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="gym-input"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit" 
              className="w-full gym-button text-lg py-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">ou</span>
              </div>
            </div>
            
            <p className="text-gray-600 mt-6">
              Ainda não tem conta?{' '}
              <button 
                onClick={() => navigate('/cadastro')}
                className="text-black font-semibold hover:text-gray-700 underline"
              >
                Cadastre-se aqui
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
