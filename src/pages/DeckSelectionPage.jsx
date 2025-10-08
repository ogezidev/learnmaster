import React, { useState } from 'react';
import './DeckSelectionPage.css';
// 1. Importe o novo componente de modal
import CreateDeckModal from '../components/CreateDeckModal/CreateDeckModal';

const DeckSelectionPage = () => {
  // --- ESTADOS DINÂMICOS (COMEÇAM VAZIOS) ---
  const [learnDecks, setLearnDecks] = useState([]);
  const [decks, setDecks] = useState({}); // Objeto para guardar os decks de cada LearnDeck

  // Estados para controlar a UI
  const [currentView, setCurrentView] = useState('learndecks');
  const [selectedLearnDeck, setSelectedLearnDeck] = useState(null);
  
  // Estado para controlar o modal de criação
  const [modalMode, setModalMode] = useState(null); // 'learndeck', 'deck', ou null (fechado)

  const handleLearnDeckClick = (learnDeck) => {
    setSelectedLearnDeck(learnDeck);
    setCurrentView('decks');
  };

  const handleBackClick = () => {
    setSelectedLearnDeck(null);
    setCurrentView('learndecks');
  };

  // Função chamada pelo modal para criar um novo item
  const handleCreate = ({ name, description }) => {
    if (modalMode === 'learndeck') {
      const newLearnDeck = { id: Date.now(), name }; // Usa timestamp como ID temporário
      setLearnDecks([...learnDecks, newLearnDeck]);
      setDecks({...decks, [newLearnDeck.id]: []}); // Inicializa a lista de decks para este novo LearnDeck
    }
    if (modalMode === 'deck') {
      const newDeck = { id: Date.now(), name };
      const updatedDecksForLearnDeck = [...decks[selectedLearnDeck.id], newDeck];
      setDecks({ ...decks, [selectedLearnDeck.id]: updatedDecksForLearnDeck });
    }
  };


  return (
    <>
      {/* O Modal só é renderizado quando o modo de criação é ativado */}
      <CreateDeckModal 
        mode={modalMode} 
        onClose={() => setModalMode(null)} 
        onCreate={handleCreate} 
      />

      <div className="deck-selection-page-container">
        <div className="deck-selection-content-box">
          
          <h1 className="deck-selection-title">
            {currentView === 'learndecks' ? 'Escolha seu LearnDeck!' : `Decks em ${selectedLearnDeck?.name}`}
          </h1>
          <p className="deck-selection-subtitle">
            {currentView === 'learndecks' ? 'Escolha o Deck para o seu Flashcard' : 'Selecione um Deck ou crie um novo'}
          </p>

          <div className="decks-display-area">
            {currentView === 'learndecks' ? (
              // Mostra os LearnDecks do estado
              learnDecks.length > 0 ? (
                learnDecks.map(learnDeck => (
                  <div key={learnDeck.id} className="deck-item" onClick={() => handleLearnDeckClick(learnDeck)}>
                    {learnDeck.name}
                  </div>
                ))
              ) : (
                <p className="empty-message">Nenhum LearnDeck encontrado. Crie um novo!</p>
              )
            ) : (
              // Mostra os Decks do LearnDeck selecionado
              decks[selectedLearnDeck.id]?.length > 0 ? (
                decks[selectedLearnDeck.id].map(deck => (
                  <div key={deck.id} className="deck-item">
                    {deck.name}
                  </div>
                ))
              ) : (
                <p className="empty-message">Nenhum Deck encontrado. Crie um novo!</p>
              )
            )}
          </div>

          <div className="deck-selection-buttons">
            {currentView === 'decks' && (
              <button className="deck-selection-btn btn-back" onClick={handleBackClick}>Voltar</button>
            )}
            {/* O botão de criar agora abre o modal */}
            <button 
              className="deck-selection-btn btn-create-new" 
              onClick={() => setModalMode(currentView === 'learndecks' ? 'learndeck' : 'deck')}
            >
              {currentView === 'learndecks' ? 'Crie um LearnDeck' : 'Crie um Deck'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default DeckSelectionPage;