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
  const [decks, setDecks] = useState([]); // Agora é um array simples de decks
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { frente, verso } = location.state || {};

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) { setLoading(false); return; }

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/folder/user/${user.id}`);
        setDecks(response.data || []); // Salva a lista de decks diretamente
      } catch (error) {
        if (error.response && error.response.status !== 204) {
          console.error("Erro ao buscar decks:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeckSelectAndSave = async (deck) => {
    if (!frente || !verso) {
      alert("Erro: Dados do flashcard não encontrados. Volte e tente novamente.");
      navigate('/criar-flashcard');
      return;
    }
    const newFlashcard = { frente, verso, folder: { id: deck.id } };
    try {
      await axios.post('http://localhost:8080/api/v1/flashcard', newFlashcard);
      alert('Flashcard criado com sucesso!');
      // CORREÇÃO FINAL: Redireciona para o INÍCIO (/home) conforme solicitado.
      navigate('/home'); 
    } catch (error) {
      console.error("Erro ao criar flashcard:", error);
      alert('Não foi possível criar o flashcard.');
    }
  };

  const handleCreate = async ({ name }) => {
    const user = getLoggedInUser();
    if (!user) { alert("Usuário não encontrado."); return; }

    // O back-end vai salvar 'statusPasta' como 'ATIVO' por padrão
    const newDeckData = { nome: name, usuario: { id: user.id } };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/folder', newDeckData);
      const newDeck = response.data;
      setDecks(prevDecks => [...prevDecks, newDeck]);
      // Permanece na página de seleção para o usuário clicar no novo deck.
    } catch (error) {
      console.error("Erro ao criar o deck:", error);
      alert("Não foi possível criar o deck.");
    }
    setIsModalOpen(false); // Fecha o modal
  };

  return (
    <>
      <CreateDeckModal
        isOpen={isModalOpen}
        mode="deck" // O modal sempre será para criar um Deck
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreate}
      />
      <div className="deck-selection-page-container">
        <div className="deck-selection-content-box">
          <h1 className="deck-selection-title">Escolha o Deck</h1>
          <p className="deck-selection-subtitle">Selecione o deck final para salvar seu flashcard.</p>

          <div className="decks-display-area">
            {loading ? <p className="empty-message">Carregando...</p> : (
              decks.length > 0 ? decks.map(deck => (
                <div key={deck.id} className="deck-item" onClick={() => handleDeckSelectAndSave(deck)}>
                  {deck.nome}
                </div>
              )) : <p className="empty-message">Nenhum deck encontrado. Crie um!</p>
            )}
          </div>
          <div className="deck-selection-buttons">
            <button className="deck-selection-btn btn-create-new" onClick={() => setIsModalOpen(true)}>
              Criar Novo Deck
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeckSelectionPage;