
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirecionar automaticamente para a página de login
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Index;
