import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate ao invés de Link
import './DeckSelectionPage.css';
import CreateDeckModal from '../components/CreateDeckModal/CreateDeckModal';

const getLoggedInUser = () => {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
};

const DeckSelectionPage = () => {
  const [learnDecks, setLearnDecks] = useState([]);
  const [decks, setDecks] = useState({});
  const [currentView, setCurrentView] = useState('learndecks');
  const [selectedLearnDeck, setSelectedLearnDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  
  const navigate = useNavigate(); // Hook para navegação programática

  useEffect(() => {
    // Seu useEffect de busca de dados está perfeito, não precisa mudar.
    const fetchData = async () => {
      const user = getLoggedInUser();
      if (!user) { setLoading(false); return; }
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/folder/user/${user.id}`);
        const allDecks = response.data || [];
        const groupedDecks = allDecks.reduce((acc, deck) => {
          const groupName = deck.statusPasta || 'Geral';
          if (!acc[groupName]) { acc[groupName] = []; }
          acc[groupName].push(deck);
          return acc;
        }, {});
        const newLearnDecks = Object.keys(groupedDecks).map(name => ({ id: name, name: name }));
        const decksByLearnDeckId = {};
        newLearnDecks.forEach(ld => { decksByLearnDeckId[ld.id] = groupedDecks[ld.name]; });
        setLearnDecks(newLearnDecks);
        setDecks(decksByLearnDeckId);
      } catch (error) {
        if (error.response && error.response.status !== 204) { console.error("Erro ao buscar decks:", error); }
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleLearnDeckClick = (learnDeck) => {
    setSelectedLearnDeck(learnDeck);
    setCurrentView('decks');
  };

  const handleBackClick = () => {
    setSelectedLearnDeck(null);
    setCurrentView('learndecks');
  };
  
  // --- NOVA FUNÇÃO PARA SELECIONAR O DECK ---
  const handleDeckSelect = (deck) => {
    // Navega de volta para a página de criação, passando o objeto 'deck' escolhido
    navigate('/criar-flashcard', { state: { selectedDeck: deck } });
  };

  const handleCreate = async ({ name }) => {
    // Sua função de criar decks também está perfeita e não precisa mudar.
    const user = getLoggedInUser();
    if (!user) { alert("Usuário não encontrado."); return; }
    if (modalMode === 'learndeck') {
        const learnDeckExists = learnDecks.some(ld => ld.name.toLowerCase() === name.toLowerCase());
        if (!learnDeckExists) {
            const newLearnDeck = { id: name, name };
            setLearnDecks([...learnDecks, newLearnDeck]);
            setDecks({ ...decks, [newLearnDeck.id]: [] });
        } else {
            alert("Já existe um LearnDeck com esse nome.");
        }
    }
    if (modalMode === 'deck') {
      if (!selectedLearnDeck) { alert("Erro: Nenhum LearnDeck selecionado."); return; }
      const newDeckData = { nome: name, statusPasta: selectedLearnDeck.name, usuario: { id: user.id } };
      try {
        const response = await axios.post('http://localhost:8080/api/v1/folder', newDeckData);
        const newDeck = response.data;
        const updatedDecksForLearnDeck = [...(decks[selectedLearnDeck.id] || []), newDeck];
        setDecks({ ...decks, [selectedLearnDeck.id]: updatedDecksForLearnDeck });
      } catch (error) { console.error("Erro ao criar o deck:", error); alert("Não foi possível criar o deck."); }
    }
    setModalMode(null);
  };

  return (
    <>
      <CreateDeckModal mode={modalMode} onClose={() => setModalMode(null)} onCreate={handleCreate} />
      <div className="deck-selection-page-container">
        <div className="deck-selection-content-box">
          <h1 className="deck-selection-title">
            {currentView === 'learndecks' ? 'Escolha seu LearnDeck!' : `Decks em ${selectedLearnDeck?.name}`}
          </h1>
          <p className="deck-selection-subtitle">
            {currentView === 'learndecks' ? 'Escolha o Deck para o seu Flashcard' : 'Selecione um Deck ou crie um novo'}
          </p>
          <div className="decks-display-area">
            {loading ? <p className="empty-message">Carregando...</p> : (
              currentView === 'learndecks' ? (
                learnDecks.length > 0 ? (
                  learnDecks.map(learnDeck => (
                    <div key={learnDeck.id} className="deck-item" onClick={() => handleLearnDeckClick(learnDeck)}>
                      {learnDeck.name}
                    </div>
                  ))
                ) : <p className="empty-message">Nenhum LearnDeck encontrado.</p>
              ) : (
                decks[selectedLearnDeck.id]?.length > 0 ? (
                  decks[selectedLearnDeck.id].map(deck => (
                    // --- MUDANÇA PRINCIPAL AQUI ---
                    // Em vez de usar <Link>, usamos um <div> com onClick que chama a nova função
                    <div key={deck.id} className="deck-item" onClick={() => handleDeckSelect(deck)}>
                      {deck.nome}
                    </div>
                  ))
                ) : <p className="empty-message">Nenhum Deck encontrado.</p>
              )
            )}
          </div>
          <div className="deck-selection-buttons">
            {currentView === 'decks' && (<button className="deck-selection-btn btn-back" onClick={handleBackClick}>Voltar</button>)}
            <button className="deck-selection-btn btn-create-new" onClick={() => setModalMode(currentView === 'learndecks' ? 'learndeck' : 'deck')}>
              {currentView === 'learndecks' ? 'Crie um LearnDeck' : 'Crie um Deck'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeckSelectionPage;