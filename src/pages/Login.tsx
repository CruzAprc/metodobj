import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const {
    signIn,
    user,
    loading
  } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload da imagem para garantir carregamento instantâneo
  useEffect(() => {
    const imageUrl = "/lovable-uploads/1880add2-ad7a-4dcf-aba6-659b952d3681.png";
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = imageUrl;
    
    // Adicionar preload no head
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

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
      const {
        error
      } = await signIn(formData.email, formData.password);
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
    return <div className="min-h-screen fitness-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>;
  }

  return <div className="min-h-screen flex flex-col items-center justify-center fitness-gradient-bg relative overflow-hidden">
      <div className="max-w-sm w-full mx-4">
        <div className="fitness-card animate-slide-in-up">
          <div className="text-center mb-8">
            {/* Logo otimizada e maior */}
            <div className="flex items-center justify-center w-40 h-40 mx-auto mb-6">
              <img 
                src="/lovable-uploads/1880add2-ad7a-4dcf-aba6-659b952d3681.png" 
                alt="Logo" 
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                onLoad={() => setImageLoaded(true)}
                style={{
                  contentVisibility: 'auto',
                  containIntrinsicSize: '160px 160px'
                }}
              />
              {!imageLoaded && (
                <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl animate-pulse absolute" />
              )}
            </div>
            
            <p className="text-gray-600 font-medium mb-2">Bem-vinda de volta!</p>
            <p className="text-gray-500 text-sm">
              Sua jornada fitness continua aqui!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="fitness-input" placeholder="Seu email" required disabled={isSubmitting} />
            </div>

            <div>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="fitness-input" placeholder="Sua senha" required disabled={isSubmitting} />
            </div>

            <button type="submit" className="w-full fitness-button text-lg" disabled={isSubmitting}>
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
              <button onClick={() => navigate('/cadastro')} className="font-medium text-pink-600 hover:text-pink-700 underline">
                Cadastre-se grátis! 💕
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>;
};

export default Login;
