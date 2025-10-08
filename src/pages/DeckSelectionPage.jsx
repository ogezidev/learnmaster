import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './DeckSelectionPage.css';
import CreateDeckModal from '../components/CreateDeckModal/CreateDeckModal';

// Função auxiliar para obter dados do usuário do localStorage
const getLoggedInUser = () => {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
};

const DeckSelectionPage = () => {
  // --- ESTADOS DINÂMICOS ---
  const [learnDecks, setLearnDecks] = useState([]);
  const [decks, setDecks] = useState({}); // Objeto para guardar os decks de cada LearnDeck

  // --- ESTADOS PARA CONTROLAR A UI ---
  const [currentView, setCurrentView] = useState('learndecks');
  const [selectedLearnDeck, setSelectedLearnDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- ESTADO PARA CONTROLAR O MODAL ---
  const [modalMode, setModalMode] = useState(null); // 'learndeck', 'deck', ou null (fechado)

  // --- EFEITO PARA BUSCAR DADOS DA API NA INICIALIZAÇÃO ---
  useEffect(() => {
    const fetchData = async () => {
      const user = getLoggedInUser();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/folder/user/${user.id}`);
        const allDecks = response.data || [];

        // Processa os decks para agrupar por 'learnDeck'
        const groupedDecks = allDecks.reduce((acc, deck) => {
          const groupName = deck.learnDeck || 'Geral'; // Categoria padrão
          if (!acc[groupName]) {
            acc[groupName] = [];
          }
          acc[groupName].push(deck);
          return acc;
        }, {});

        // Cria a lista de LearnDecks (as categorias) a partir dos grupos encontrados
        const newLearnDecks = Object.keys(groupedDecks).map(name => ({
          id: name, // Usamos o próprio nome como ID único para a categoria no front-end
          name: name
        }));

        // Mapeia os decks para seus respectivos LearnDecks
        const decksByLearnDeckId = {};
        newLearnDecks.forEach(ld => {
          decksByLearnDeckId[ld.id] = groupedDecks[ld.name];
        });

        setLearnDecks(newLearnDecks);
        setDecks(decksByLearnDeckId);

      } catch (error) {
        // Ignora o erro 204 (No Content), que significa que o usuário não tem decks
        if (error.response && error.response.status !== 204) {
             console.error("Erro ao buscar decks:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- FUNÇÕES DE NAVEGAÇÃO NA PÁGINA ---
  const handleLearnDeckClick = (learnDeck) => {
    setSelectedLearnDeck(learnDeck);
    setCurrentView('decks');
  };

  const handleBackClick = () => {
    setSelectedLearnDeck(null);
    setCurrentView('learndecks');
  };

  // --- FUNÇÃO ÚNICA PARA CRIAR LEARNDECK E DECK ---
  const handleCreate = async ({ name }) => {
    const user = getLoggedInUser();
    if (!user) {
      alert("Usuário não encontrado. Faça login novamente.");
      return;
    }

    // --- ROTA 1: CRIAR UM NOVO LEARNDECK (CATEGORIA VISUAL) ---
    if (modalMode === 'learndeck') {
      const learnDeckExists = learnDecks.some(ld => ld.name.toLowerCase() === name.toLowerCase());

      if (!learnDeckExists) {
        const newLearnDeck = { id: name, name }; 
        setLearnDecks([...learnDecks, newLearnDeck]); // Adiciona a nova categoria à lista
        setDecks({ ...decks, [newLearnDeck.id]: [] }); // Inicializa a lista de decks para a nova categoria
      } else {
        alert("Já existe um LearnDeck com esse nome.");
      }
    }

    // --- ROTA 2: CRIAR UM NOVO DECK DENTRO DE UM LEARNDECK (SALVAR NO BANCO) ---
    if (modalMode === 'deck') {
      if (!selectedLearnDeck) {
        alert("Erro: Nenhum LearnDeck selecionado.");
        return;
      }
      
      const newDeckData = {
        nome: name,
        learnDeck: selectedLearnDeck.name, // Associa ao grupo (LearnDeck)
        usuario: { id: user.id }
      };

      try {
        const response = await axios.post('http://localhost:8080/api/v1/folder', newDeckData);
        const newDeck = response.data;

        // Atualiza o estado local para o feedback ser instantâneo
        const updatedDecksForLearnDeck = [...decks[selectedLearnDeck.id], newDeck];
        setDecks({ ...decks, [selectedLearnDeck.id]: updatedDecksForLearnDeck });

      } catch (error) {
        console.error("Erro ao criar o deck:", error);
        alert("Não foi possível criar o deck.");
      }
    }
    
    setModalMode(null); // Fecha o modal após a criação
  };


  return (
    <>
      {/* O Modal é renderizado aqui, mas só aparece quando 'modalMode' não é nulo */}
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
            {loading ? <p className="empty-message">Carregando...</p> : (
              currentView === 'learndecks' ? (
                // Mostra os LearnDecks (categorias)
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
                    <Link to={`/criar-flashcard/${deck.id}`} key={deck.id} className="deck-item">
                      {deck.nome}
                    </Link>
                  ))
                ) : (
                  <p className="empty-message">Nenhum Deck encontrado. Crie um novo!</p>
                )
              )
            )}
          </div>

          <div className="deck-selection-buttons">
            {currentView === 'decks' && (
              <button className="deck-selection-btn btn-back" onClick={handleBackClick}>Voltar</button>
            )}
            {/* Botão dinâmico que abre o modal no modo correto */}
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