import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext'; // Importa nosso hook

const LoadingLink = ({ to, children, className }) => {
  const { setIsLoading } = useLoading(); // Pega a função do contexto
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setIsLoading(true); // Liga a tela de carregamento
    setTimeout(() => {
      navigate(to); // Navega após um pequeno atraso
    }, 2400); 
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default LoadingLink;