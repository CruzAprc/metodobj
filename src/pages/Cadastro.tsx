
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
      <div className="min-h-screen fitness-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center fitness-gradient-bg relative overflow-hidden py-8">
      {/* Botão voltar */}
      <div className="max-w-sm w-full mx-4 mb-4">
        <button 
          onClick={() => navigate('/login')}
          className="text-pink-600 hover:text-pink-700 transition-colors font-medium flex items-center gap-2"
        >
          ← Voltar
        </button>
      </div>
      
      <div className="max-w-sm w-full mx-4">
        <div className="fitness-card animate-slide-in-up">
          <div className="text-center mb-8">
            {/* Logo atualizada */}
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6">
              <img 
                src="/lovable-uploads/573712ac-9063-4efa-ab2c-2291286e6046.png" 
                alt="App da Juju Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <h2 className="text-3xl font-bold fitness-text mb-3">
              App da Juju
            </h2>
            <p className="text-gray-600 font-medium mb-2">Comece agora!</p>
            <p className="text-gray-500 text-sm">
              Sua transformação começa aqui!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="fitness-input"
                placeholder="Nome Completo"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleWhatsAppChange}
                className="fitness-input"
                placeholder="WhatsApp"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="fitness-input"
                placeholder="Email"
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
                placeholder="Senha"
                required
                minLength={6}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="fitness-input"
                placeholder="Confirmar Senha"
                required
                minLength={6}
                disabled={isSubmitting}
              />
            </div>

            <button 
              type="submit" 
              className="w-full fitness-button text-lg mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
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
              Já tem uma conta?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="font-medium text-pink-600 hover:text-pink-700 underline"
              >
                Faça login! 💕
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
