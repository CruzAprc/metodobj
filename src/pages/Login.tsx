
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // Simulação de login - em produção conectar com Supabase
    navigate('/onboarding');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen juju-gradient-bg">
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="juju-card animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">💪</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Bem-vinda de volta!</h2>
            <p className="text-gray-600">Entre na sua conta para continuar sua jornada</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
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
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="juju-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full juju-button">
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Ainda não tem conta?{' '}
              <button 
                onClick={() => navigate('/cadastro')}
                className="text-pink-600 font-semibold hover:text-pink-700"
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
