
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import { toast } from 'sonner';

const Cadastro = () => {
  const navigate = useNavigate();
  const { signUp, user, loading } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        formData.nome, 
        formData.whatsapp
      );
      
      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('Este email já está cadastrado');
        } else {
          toast.error('Erro ao criar conta: ' + error.message);
        }
      } else {
        toast.success('Conta criada com sucesso!');
        navigate('/onboarding');
      }
    } catch (error) {
      toast.error('Erro inesperado ao criar conta');
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

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setFormData({
      ...formData,
      whatsapp: formatted
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
      <Header showBack onBack={() => navigate('/login')} />
      
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="gym-card animate-slide-in-bottom">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-black rounded-2xl mx-auto mb-6 flex items-center justify-center animate-power-pulse">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Comece agora</h2>
            <p className="text-gray-600 font-medium">Sua transformação começa aqui!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="gym-input"
                placeholder="Seu nome completo"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                WhatsApp *
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleWhatsAppChange}
                className="gym-input"
                placeholder="(11) 99999-9999"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email *
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
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Senha *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="gym-input"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Confirmar Senha *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="gym-input"
                placeholder="••••••••"
                required
                minLength={6}
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit" 
              className="w-full gym-button text-lg py-4 mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
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
              Já tem uma conta?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-black font-semibold hover:text-gray-700 underline"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
