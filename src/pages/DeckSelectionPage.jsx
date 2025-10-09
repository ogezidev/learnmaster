import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  // Pega os dados do flashcard (frente e verso) que vieram da página anterior
  const { frente, verso } = location.state || {};

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) { setLoading(false); return; }

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/folder/user/${user.id}`);
        const allDecks = response.data || [];
        
        // Agrupa os decks por categoria (statusPasta), ignorando 'ATIVO'
        const groupedDecks = allDecks.reduce((acc, deck) => {
          const groupName = deck.statusPasta;
          // Ignora qualquer deck que tenha 'ATIVO' ou não tenha categoria definida
          if (groupName && groupName !== 'ATIVO') {
            if (!acc[groupName]) { acc[groupName] = []; }
            acc[groupName].push(deck);
          }
          return acc;
        }, {});

        const newLearnDecks = Object.keys(groupedDecks).map(name => ({ id: name, name: name }));
        setLearnDecks(newLearnDecks);
        setDecks(groupedDecks);
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

  // --- FUNÇÃO FINAL: SELECIONA O DECK E SALVA O FLASHCARD ---
  const handleDeckSelectAndSave = async (deck) => {
    if (!frente || !verso) {
      alert("Erro: Dados do flashcard não encontrados. Volte e tente novamente.");
      return;
    }
    const newFlashcard = { frente, verso, folder: { id: deck.id } };
    try {
      await axios.post('http://localhost:8080/api/v1/flashcard', newFlashcard);
      alert('Flashcard criado com sucesso!');
      navigate('/home'); // VOLTA PARA A HOME
    } catch (error) {
      console.error("Erro ao criar flashcard:", error);
      alert('Não foi possível criar o flashcard.');
    }
  };

  const handleCreate = async ({ name }) => {
    const user = getLoggedInUser();
    if (!user) { alert("Usuário não encontrado."); return; }

    if (modalMode === 'learndeck') {
      const learnDeckExists = learnDecks.some(ld => ld.name.toLowerCase() === name.toLowerCase());
      if (learnDeckExists) {
        alert("Já existe um LearnDeck com esse nome.");
        return;
      }
      const newLearnDeck = { id: name, name };
      setLearnDecks([...learnDecks, newLearnDeck]);
      setDecks({ ...decks, [newLearnDeck.id]: [] });
    }

    if (modalMode === 'deck') {
      if (!selectedLearnDeck) { alert("Selecione um LearnDeck primeiro."); return; }
      const newDeckData = { nome: name, usuario: { id: user.id }, statusPasta: selectedLearnDeck.name };
      try {
        const response = await axios.post('http://localhost:8080/api/v1/folder', newDeckData);
        const newDeck = response.data;
        const updatedDecks = { ...decks };
        if (!updatedDecks[selectedLearnDeck.id]) { updatedDecks[selectedLearnDeck.id] = []; }
        updatedDecks[selectedLearnDeck.id].push(newDeck);
        setDecks(updatedDecks);
      } catch (error) {
        console.error("Erro ao criar o deck:", error);
        alert("Não foi possível criar o deck. Verifique se o nome do LearnDeck é válido.");
      }
    }
    setModalMode(null);
  };

  return (
    <>
      <CreateDeckModal isOpen={modalMode !== null} mode={modalMode} onClose={() => setModalMode(null)} onCreate={handleCreate} />
      <div className="deck-selection-page-container">
        <div className="deck-selection-content-box">
          <h1 className="deck-selection-title">
            {currentView === 'learndecks' ? 'Escolha a Categoria' : `Decks em "${selectedLearnDeck?.name}"`}
          </h1>
          <p className="deck-selection-subtitle">Selecione o deck final para salvar seu flashcard.</p>

          <div className="decks-display-area">
            {loading ? <p className="empty-message">Carregando...</p> : 
              (currentView === 'learndecks' ? (
                learnDecks.length > 0 ? learnDecks.map(learnDeck => (
                  <div key={learnDeck.id} className="deck-item" onClick={() => handleLearnDeckClick(learnDeck)}>
                    {learnDeck.name}
                  </div>
                )) : <p className="empty-message">Nenhum LearnDeck encontrado. Crie um!</p>
              ) : (
                decks[selectedLearnDeck?.id]?.length > 0 ? decks[selectedLearnDeck.id].map(deck => (
                  <div key={deck.id} className="deck-item" onClick={() => handleDeckSelectAndSave(deck)}>
                    {deck.nome}
                  </div>
                )) : <p className="empty-message">Nenhum deck neste Learndeck. Crie um!</p>
              ))
            }
          </div>
          <div className="deck-selection-buttons">
            {currentView === 'decks' && <button className="deck-selection-btn btn-back" onClick={handleBackClick}>Voltar</button>}
            <button className="deck-selection-btn btn-create-new" onClick={() => setModalMode(currentView === 'learndecks' ? 'learndeck' : 'deck')}>
              {currentView === 'learndecks' ? 'Criar Categoria' : 'Criar Deck'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeckSelectionPage;