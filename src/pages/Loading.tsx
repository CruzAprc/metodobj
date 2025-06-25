
import React, { useState, useEffect } from 'react';
import LoadingAnimation from '@/components/LoadingAnimation';

const Loading = () => {
  const [userName, setUserName] = useState('');

  // Recuperar o nome do usuário do localStorage
  useEffect(() => {
    const dadosPessoais = localStorage.getItem('dadosPessoais');
    if (dadosPessoais) {
      const dados = JSON.parse(dadosPessoais);
      setUserName(dados.nomeCompleto.split(' ')[0]); // Pega apenas o primeiro nome
    }
  }, []);

  return (
    <LoadingAnimation
      type="dieta"
      userName={userName}
      redirectTo="/quiz-alimentar/1"
    />
  );
};

export default Loading;
