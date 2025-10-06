import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-overlay">
      {/* 1. Trocamos o spinner pela sua imagem GIF */}
      {/* O caminho começa com "/" porque a pasta 'public' é a raiz do site */}
      <img src="/img/meu-loading.gif" alt="Carregando..." className="loading-gif" />
      
      {/* 2. O texto "Carregando..." é opcional. Você pode remover esta linha
         se o seu GIF já tiver um texto ou se preferir um visual mais limpo. */}
    </div>
  );
};

export default LoadingScreen;