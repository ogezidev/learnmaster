import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateFlashcardPage.css';

const CreateFlashcardPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [frente, setFrente] = useState('');
  const [verso, setVerso] = useState('');
  const [hasFlippedOnce, setHasFlippedOnce] = useState(false);
  const navigate = useNavigate();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!hasFlippedOnce) {
      setHasFlippedOnce(true);
    }
  };

  const handleChooseDeck = () => {
    // Validação final antes de prosseguir
    if (!frente.trim() || !verso.trim() || !hasFlippedOnce) {
      alert('Por favor, preencha a frente, vire o card e preencha o verso antes de continuar.');
      return;
    }
    // Navega para a página de seleção, levando os dados do card junto
    navigate('/selecionar-deck', { state: { frente: frente, verso: verso } });
  };

  return (
    <div className="create-page-container">
      <div className="create-content-box">
        <h1 className="create-title">Crie seu LearnCard</h1>
        <p className="create-subtitle">Preencha os dois lados do card e depois prossiga.</p>
        <div className="flashcard-scene">
          <div className={`flashcard-flipper ${isFlipped ? 'is-flipped' : ''}`}>
            <div className="flashcard-face flashcard-front">
              <textarea
                className="flashcard-input"
                placeholder="Digite a pergunta..."
                value={frente}
                onChange={(e) => setFrente(e.target.value)}
              ></textarea>
            </div>
            <div className="flashcard-face flashcard-back">
              <textarea
                className="flashcard-input"
                placeholder="Digite a resposta..."
                value={verso}
                onChange={(e) => setVerso(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="create-buttons-container">
          <button className="create-btn btn-flip" onClick={handleFlip}>Virar</button>
          <button className="create-btn btn-learndeck" onClick={handleChooseDeck}>
            Selecionar Deck e Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcardPage;