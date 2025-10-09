import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './DeckSelectionPage.css'; // Reutiliza alguns estilos
import './VerTodos.css'; // Seus estilos personalizados

// Função para pegar o usuário logado
const getLoggedInUser = () => {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
};

const VerTodos = () => {
    const [allDecks, setAllDecks] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Controla a visualização: 'decks' ou 'flashcards'
    const [currentView, setCurrentView] = useState('decks'); 
    const [selectedDeck, setSelectedDeck] = useState(null);

    // Busca os decks do usuário ao carregar a página
    useEffect(() => {
        const user = getLoggedInUser();
        if (!user) {
            setLoading(false);
            return;
        }
        fetchData(user.id);
    }, []);

    const fetchData = async (userId) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/folder/user/${userId}`);
            setAllDecks(response.data || []);
        } catch (error) {
            console.error("Erro ao buscar decks:", error);
            setAllDecks([]);
        } finally {
            setLoading(false);
        }
    };

    // --- FUNCIONALIDADE DE PESQUISA ---
    const filteredDecks = useMemo(() => {
        if (!searchTerm.trim()) {
            return allDecks; // Se a busca for vazia, mostra todos os decks
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        return allDecks.filter(deck => deck.nome.toLowerCase().includes(lowerCaseSearch));
    }, [searchTerm, allDecks]);

    // --- FUNCIONALIDADE DE EXCLUIR ---
    const handleDeleteDeck = async (deckToDelete) => {
        if (window.confirm(`Tem certeza que deseja excluir o deck "${deckToDelete.nome}"? Todos os flashcards dentro dele também serão perdidos.`)) {
            try {
                // Chama a API para deletar
                await axios.delete(`http://localhost:8080/api/v1/folder/${deckToDelete.id}`);
                // Remove o deck da lista na tela para atualização instantânea
                setAllDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckToDelete.id));
                alert("Deck excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir o deck:", error);
                alert("Não foi possível excluir o deck.");
            }
        }
    };

    // Função para ver os flashcards de um deck
    const handleDeckClick = async (deck) => {
        setSelectedDeck(deck);
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/flashcard/folder/${deck.id}`);
            setFlashcards(response.data || []);
        } catch (error) {
            setFlashcards([]);
        } finally {
            setLoading(false);
            setCurrentView('flashcards');
        }
    };
    
    // Função para voltar da visualização de flashcards para a de decks
    const handleBackClick = () => {
        setSelectedDeck(null);
        setFlashcards([]);
        setCurrentView('decks');
    };

    if (loading && currentView === 'decks') {
        return <div className="ver-todos-page-container"><p>Carregando seus decks...</p></div>;
    }

    return (
        <div className="ver-todos-page-container">
            <div className="ver-todos-content-box">
                <h1 className="deck-selection-title">
                    {currentView === 'decks' ? 'Todos os seus Decks' : `Flashcards em "${selectedDeck?.nome}"`}
                </h1>
                
                {currentView === 'decks' && (
                    <input
                        type="text"
                        placeholder="Pesquisar por nome do deck..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                )}

                <div className="decks-display-area">
                    {currentView === 'decks' ? (
                        filteredDecks.length > 0 ? filteredDecks.map(deck => (
                            <div key={deck.id} className="deck-item-wrapper">
                                <button 
                                    className="delete-deck-btn" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Impede o clique de abrir os flashcards
                                        handleDeleteDeck(deck);
                                    }}
                                >
                                    &times; {/* Símbolo "X" */}
                                </button>
                                <div className="deck-item" onClick={() => handleDeckClick(deck)}>
                                    {deck.nome}
                                </div>
                            </div>
                        )) : <p className="empty-message">Nenhum deck encontrado.</p>
                    ) : (
                        loading ? <p className="empty-message">Carregando flashcards...</p> :
                        flashcards.length > 0 ? flashcards.map(card => (
                            <div key={card.id} className="flashcard-item">
                                <p className="flashcard-side"><strong>Frente:</strong> {card.frente}</p>
                                <hr/>
                                <p className="flashcard-side"><strong>Verso:</strong> {card.verso}</p>
                            </div>
                        )) : <p className="empty-message">Nenhum flashcard neste deck.</p>
                    )}
                </div>

                <div className="deck-selection-buttons">
                    {currentView === 'flashcards' && (
                        <button className="deck-selection-btn btn-back" onClick={handleBackClick}>Voltar para Decks</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerTodos;