
import React from 'react';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

const Header = ({ showBack, onBack, title }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b-2 border-pink-100 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        {showBack ? (
          <button 
            onClick={onBack}
            className="text-pink-600 hover:text-pink-700 transition-colors"
          >
            ← Voltar
          </button>
        ) : (
          <div />
        )}
        
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
          {title || "App da Juju"}
        </h1>
        
        <div className="w-16" />
      </div>
    </header>
  );
};

export default Header;
