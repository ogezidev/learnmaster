import React, { useState } from 'react';
// 1. Importe o useNavigate para poder navegar entre as páginas
import { useNavigate } from 'react-router-dom';
import './CreateFlashcardPage.css';

const CreateFlashcardPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  // 2. Crie a função de navegação
  const navigate = useNavigate();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // 3. Crie a função para navegar para a seleção de deck
  const goToDeckSelection = () => {
    navigate('/selecionar-deck');
  };

  return (
    <div className="create-page-container">
      <div className="create-content-box">
        <h1 className="create-title">O que vamos memorizar hoje?</h1>
        <p className="create-subtitle">Crie e escolha o seu deck, e depois é só fazer o seu LearnCard!</p>

        <div className="flashcard-scene">
          <div className={`flashcard-flipper ${isFlipped ? 'is-flipped' : ''}`}>
            
            <div className="flashcard-face flashcard-front">
              <div className="corner-fold front-fold"></div>
              <span className="flashcard-label front-label">Frente</span>
              <textarea
                className="flashcard-input"
                placeholder="Digite aqui..."
              ></textarea>
            </div>
            
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

        <div className="create-buttons-container">
          {/* 4. Adicione o onClick ao botão LearnDeck */}
          <button className="create-btn btn-learndeck" onClick={goToDeckSelection}>LearnDeck</button>
          <button className="create-btn btn-flip" onClick={handleFlip}>Virar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcardPage;