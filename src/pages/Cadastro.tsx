
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    console.log('Cadastro attempt:', formData);
    // Simulação de cadastro - em produção conectar com Supabase
    navigate('/onboarding');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) 9XXXX-XXXX
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

  return (
    <div className="min-h-screen juju-gradient-bg">
      <Header showBack onBack={() => navigate('/login')} />
      
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="juju-card animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">🌸</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Crie sua conta</h2>
            <p className="text-gray-600">Comece sua transformação hoje mesmo!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="juju-input"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp *
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleWhatsAppChange}
                className="juju-input"
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="juju-input"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="juju-input"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="juju-input"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="w-full juju-button">
              Criar Conta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-pink-600 font-semibold hover:text-pink-700"
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
