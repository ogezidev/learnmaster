import React, { useState } from 'react';
import './CreateFlashcardPage.css';

const CreateFlashcardPage = () => {
  // Estado para controlar a animação de virada
  const [isFlipped, setIsFlipped] = useState(false);

  // Função para alternar o estado
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="create-page-container">
      <div className="create-content-box">
        <h1 className="create-title">O que vamos memorizar hoje?</h1>
        <p className="create-subtitle">Crie e escolha o seu deck, e depois é só fazer o seu LearnCard!</p>

        {/* --- CONTAINER PARA A CENA 3D --- */}
        <div className="flashcard-scene">
          {/* Div que irá girar */}
          <div className={`flashcard-flipper ${isFlipped ? 'is-flipped' : ''}`}>
            
            {/* FACE DA FRENTE */}
            <div className="flashcard-face flashcard-front">
              <div className="corner-fold front-fold"></div>
              <span className="flashcard-label front-label">Frente</span>
              <textarea
                className="flashcard-input"
                placeholder="Digite aqui..."
              ></textarea>
            </div>
            
            {/* FACE DE TRÁS */}
            <div className="flashcard-face flashcard-back">
              <div className="corner-fold back-fold"></div>
              <span className="flashcard-label back-label">Atrás</span>
              <textarea
                className="flashcard-input"
                placeholder="Digite a resposta aqui..."
              ></textarea>
            </div>

          </div>
        </div>

        {/* --- BOTÕES --- */}
        <div className="create-buttons-container">
          <button className="create-btn btn-learndeck">LearnDeck</button>
          {/* O botão "Virar" agora chama a função handleFlip */}
          <button className="create-btn btn-flip" onClick={handleFlip}>Virar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcardPage;