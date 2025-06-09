import React from 'react';
interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}
const Header = ({
  showBack,
  onBack,
  title
}: HeaderProps) => {
  return <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        {showBack ? <button onClick={onBack} className="text-black hover:text-gray-700 transition-colors font-medium flex items-center gap-2">
            ← Voltar
          </button> : <div />}
        
        <div className="flex items-center gap-3">
          
          
        </div>
        
        <div className="w-16" />
      </div>
    </header>;
};
export default Header;