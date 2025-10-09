import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useLocation
import axios from 'axios';
import './CreateFlashcardPage.css';

const CreateFlashcardPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [frente, setFrente] = useState('');
  const [verso, setVerso] = useState('');
  
  // Estado para guardar o deck que o usuário escolheu
  const [selectedDeck, setSelectedDeck] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation(); // Hook para ler os dados da navegação

  // Este `useEffect` é executado quando a página carrega ou quando você volta da página de seleção.
  useEffect(() => {
    // Se a navegação tiver um "state" com o deck selecionado, nós o guardamos.
    if (location.state && location.state.selectedDeck) {
      setSelectedDeck(location.state.selectedDeck);
    }
  }, [location.state]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSaveFlashcard = async () => {
    // 1. Validação: Se nenhum deck foi selecionado, exibe um alerta.
    if (!selectedDeck) {
      alert('Por favor, escolha um Deck antes de salvar. Clique no botão "Escolher Deck".');
      return;
    }

    if (!frente.trim() || !verso.trim()) {
      alert('Por favor, preencha a frente e o verso do card.');
      return;
    }

    const newFlashcard = {
      frente: frente,
      verso: verso,
      folder: {
        id: selectedDeck.id, // Usa o ID do deck que foi guardado no estado
      },
    };

    try {
      await axios.post('http://localhost:8080/api/v1/flashcard', newFlashcard);
      alert('Flashcard criado com sucesso!');
      setFrente('');
      setVerso('');
      setIsFlipped(false);
      // Opcional: limpar o deck selecionado para o próximo card
      // setSelectedDeck(null); 
    } catch (error) {
      console.error("Erro ao criar flashcard:", error);
      alert('Não foi possível criar o flashcard.');
    }
  };

  return (
    <div className="create-page-container">
      <div className="create-content-box">
        <h1 className="create-title">O que vamos memorizar hoje?</h1>
        <p className="create-subtitle">
          {/* Mostra o nome do deck selecionado ou uma mensagem para escolher um */}
          {selectedDeck 
            ? `Salvando no Deck: "${selectedDeck.nome}"`
            : "Primeiro, clique em 'Escolher Deck' para começar."
          }
        </p>

        {/* --- CONTAINER PARA A CENA 3D --- */}
        <div className="flashcard-scene">
          <div className={`flashcard-flipper ${isFlipped ? 'is-flipped' : ''}`}>
            {/* FACE DA FRENTE */}
            <div className="flashcard-face flashcard-front">
              <div className="corner-fold front-fold"></div>
              <span className="flashcard-label front-label">Frente</span>
              <textarea
                className="flashcard-input"
                placeholder="Digite aqui..."
                value={frente}
                onChange={(e) => setFrente(e.target.value)}
              ></textarea>
            </div>
            {/* FACE DE TRÁS */}
            <div className="flashcard-face flashcard-back">
              <div className="corner-fold back-fold"></div>
              <span className="flashcard-label back-label">Atrás</span>
              <textarea
                className="flashcard-input"
                placeholder="Digite a resposta aqui..."
                value={verso}
                onChange={(e) => setVerso(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>

        {/* --- BOTÕES CORRIGIDOS PARA O FLUXO CORRETO --- */}
        <div className="create-buttons-container">
          {/* Este botão leva o usuário para a página de seleção de decks */}
          <button 
            className="create-btn btn-learndeck" 
            onClick={() => navigate('/selecionar-deck')}
          >
            {selectedDeck ? 'Trocar Deck' : 'Escolher Deck'}
          </button>
          
          <button className="create-btn btn-flip" onClick={handleFlip}>Virar</button>
          
          {/* O botão de salvar agora é separado */}
          <button className="create-btn-btn-save" onClick={handleSaveFlashcard}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFlashcardPage;