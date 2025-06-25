
import React, { useState, useEffect } from 'react';
import LoadingAnimation from '@/components/LoadingAnimation';

const LoadingTreino = () => {
  const [userName, setUserName] = useState('');

  // Recuperar o nome do usuário
  useEffect(() => {
    const dadosPessoais = localStorage.getItem('dadosPessoais');
    if (dadosPessoais) {
      const dados = JSON.parse(dadosPessoais);
      setUserName(dados.nomeCompleto.split(' ')[0]);
    }
  }, []);

  return (
    <LoadingAnimation
      type="treino"
      userName={userName}
      redirectTo="/quiz-treino/1"
    />
  );
};

export default LoadingTreino;
