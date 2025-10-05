import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingLink = ({ to, setIsLoading, children, className }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault(); // Impede a navegação padrão

    // 1. Mostra a tela de carregamento
    setIsLoading(true);

    // 2. Espera um curto período para a animação ser visível e depois navega
    setTimeout(() => {
      navigate(to);
    }, 400); // 400ms é um bom tempo para a transição
  };

  return (
    // Usamos uma tag <a>, mas o clique é controlado pelo React
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default LoadingLink;