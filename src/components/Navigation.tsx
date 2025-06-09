
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const routes = [
    { path: '/login', label: 'Login' },
    { path: '/cadastro', label: 'Cadastro' },
    { path: '/onboarding', label: 'Onboarding' },
    { path: '/dados-pessoais', label: 'Dados Pessoais' },
    { path: '/quiz-alimentar/1', label: 'Quiz Alimentar' },
    { path: '/quiz-treino/1', label: 'Quiz Treino' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/avaliacao', label: 'Avaliação' }
  ];

  return (
    <nav className="fixed top-0 right-0 z-50">
      {/* Botão toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="m-4 p-2 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Menu de navegação */}
      {isOpen && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-xl border border-gray-200 min-w-48 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
              Páginas Disponíveis
            </div>
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                  location.pathname === route.path || 
                  (route.path.includes('quiz-alimentar') && location.pathname.includes('quiz-alimentar')) ||
                  (route.path.includes('quiz-treino') && location.pathname.includes('quiz-treino'))
                    ? 'bg-pink-100 text-pink-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 p-2">
            <div className="text-xs text-gray-500 px-2">
              Página atual: {location.pathname}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
