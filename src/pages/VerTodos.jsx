import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DeckSelectionPage.css'; // Reutiliza alguns estilos
import './VerTodos.css'; // Seus estilos personalizados

// Função para pegar o usuário logado
const getLoggedInUser = () => {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
};

// --- COMPONENTE: VISUALIZADOR DE FLASHCARD EM TELA CHEIA (COM NAVEGAÇÃO) ---
const FlashcardViewer = ({ flashcards, currentIndex, onNext, onPrevious, onClose }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const card = flashcards[currentIndex];
    
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === flashcards.length - 1;

    // Reseta o flip ao mudar de card
    useEffect(() => {
        setIsFlipped(false);
    }, [currentIndex]);

    if (!card) return null;

    return (
        <div className="flashcard-viewer-overlay" onClick={onClose}>
            <div className="flashcard-viewer-content" onClick={(e) => e.stopPropagation()}>
                
                {/* Botão de Fechar */}
                <button className="viewer-close-btn" onClick={onClose}>&times;</button>
                
                {/* Título/Contagem */}
                <div className="viewer-header">
                    <p>{currentIndex + 1} / {flashcards.length}</p>
                </div>

                {/* BOTÃO ANTERIOR */}
                <button 
                    className="viewer-nav-btn prev-btn" 
                    onClick={onPrevious} 
                    disabled={isFirst}
                >
                    &lt;
                </button>
                
                {/* CARD FLIPÁVEL */}
                <div className="flashcard-scene-fullscreen" onClick={() => setIsFlipped(!isFlipped)}>
                    <div className={`flashcard-flipper-fullscreen ${isFlipped ? 'is-flipped' : ''}`}>
                        <div className="flashcard-face-fullscreen flashcard-front-fullscreen">
                            <p className="card-text-fullscreen">{card.frente}</p>
                            <span className="card-hint">Clique para virar</span>
                        </div>
                        <div className="flashcard-face-fullscreen flashcard-back-fullscreen">
                            <p className="card-text-fullscreen">{card.verso}</p>
                            <span className="card-hint">Clique para voltar</span>
                        </div>
                    </div>
                </div>

                {/* BOTÃO PRÓXIMO */}
                <button 
                    className="viewer-nav-btn next-btn" 
                    onClick={onNext} 
                    disabled={isLast}
                >
                    &gt;
                </button>

            </div>
        </div>
    );
};
// --- FIM: FLASHCARD VIEWER ---


const VerTodos = () => {
    const [allDecks, setAllDecks] = useState([]);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- ESTADOS PARA EXCLUSÃO MULTI-SELEÇÃO ---
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedDecks, setSelectedDecks] = useState([]);
    // --- ESTADO PARA SEQUÊNCIA DE ESTUDO ---
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(null); 

    const [currentView, setCurrentView] = useState('decks'); 
    const [selectedDeck, setSelectedDeck] = useState(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        const user = getLoggedInUser();
        if (!user) {
            setLoading(false);
            navigate('/login'); 
            return;
        }
        fetchData(user.id);
    }, [navigate]);

    // --- LÓGICA DE PESQUISA ---
    const filteredDecks = useMemo(() => {
        if (!searchTerm.trim()) {
            return allDecks;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        return allDecks.filter(deck => deck.nome.toLowerCase().includes(lowerCaseSearch));
    }, [searchTerm, allDecks]);

    // --- LÓGICA DE EXCLUSÃO MULTI-SELEÇÃO (omitida por brevidade, mas mantida) ---
    const handleDeckSelection = (deckId) => {
        setSelectedDecks(prevSelected => {
            if (prevSelected.includes(deckId)) {
                return prevSelected.filter(id => id !== deckId);
            } else {
                return [...prevSelected, deckId];
            }
        });
    };

    const handleMassDelete = async () => {
        if (selectedDecks.length === 0) {
            alert("Nenhum deck selecionado para exclusão.");
            setIsDeleteMode(false);
            return;
        }

        if (!window.confirm(`Tem certeza que deseja excluir ${selectedDecks.length} deck(s) selecionado(s)?`)) {
            return;
        }

        const deletePromises = selectedDecks.map(deckId => 
            axios.delete(`http://localhost:8080/api/v1/folder/${deckId}`).catch(error => {
                console.error(`Falha ao excluir o deck ID ${deckId}:`, error.response || error.message);
                return { id: deckId, success: false }; 
            })
        );

        await Promise.all(deletePromises);
        
        setAllDecks(prevDecks => prevDecks.filter(deck => !selectedDecks.includes(deck.id)));
        alert(`${selectedDecks.length} deck(s) processado(s) para exclusão.`);
        
        setSelectedDecks([]);
        setIsDeleteMode(false);
    };

    const handleToggleDeleteMode = () => {
        if (isDeleteMode) {
            if (selectedDecks.length > 0) {
                handleMassDelete();
            } else {
                setIsDeleteMode(false);
                setSelectedDecks([]);
            }
        } else {
            setIsDeleteMode(true);
            alert("Modo de exclusão ativado. Clique nos cards para selecionar.");
        }
    };
    
    // --- LÓGICA DE ESTUDO SEQUENCIAL ---

    const handleNext = (e) => {
        e.stopPropagation(); 
        if (currentFlashcardIndex < flashcards.length - 1) {
            setCurrentFlashcardIndex(prevIndex => prevIndex + 1);
        }
    };
    
    const handlePrevious = (e) => {
        e.stopPropagation();
        if (currentFlashcardIndex > 0) {
            setCurrentFlashcardIndex(prevIndex => prevIndex - 1);
        }
    };
    
    const handleCloseFullscreen = () => {
        setCurrentFlashcardIndex(null);
    };

    const handleStartSequence = () => {
        if (flashcards.length === 0) {
            alert("Não há flashcards neste deck para iniciar o estudo.");
            return;
        }
        // Inicia a sequência no primeiro card
        setCurrentFlashcardIndex(0);
    };

    // --- LÓGICA DE CLIQUE NO DECK E FLASHCARD ---
    
    const handleDeckClick = async (deck) => {
        if (isDeleteMode) {
            handleDeckSelection(deck.id);
            return;
        }
        
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
    
    const handleFlashcardClick = (card) => {
        // Encontra o índice do card clicado para iniciar a sequência a partir dele
        const index = flashcards.findIndex(f => f.id === card.id);
        if (index !== -1) {
            setCurrentFlashcardIndex(index);
        }
    };
    
    const handleBackClick = () => {
        setSelectedDeck(null);
        setFlashcards([]);
        setCurrentView('decks');
    };

    // Renderização de Loading
    if (loading && currentView === 'decks') {
        return <div className="ver-todos-page-container"><p>Carregando seus decks...</p></div>;
    }

    return (
        <div className="ver-todos-page-container">
            {/* 1. VISUALIZADOR DE FLASHCARD EM TELA CHEIA */}
            {currentFlashcardIndex !== null && flashcards.length > 0 && (
                <FlashcardViewer 
                    flashcards={flashcards}
                    currentIndex={currentFlashcardIndex}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onClose={handleCloseFullscreen} 
                />
            )}

            <div className="ver-todos-content-box">
                <h1 className="deck-selection-title">
                    {currentView === 'decks' 
                        ? 'Todos os seus Decks' 
                        : `Flashcards em "${selectedDeck?.nome}"`
                    }
                </h1>
                
                {currentView === 'decks' && (
                    <>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome do deck..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            disabled={isDeleteMode}
                        />
                        
                        <div className="control-buttons">
                            <button
                                className={`delete-mode-btn ${isDeleteMode ? 'active-mode' : ''} ${selectedDecks.length > 0 ? 'has-selection' : ''}`}
                                onClick={handleToggleDeleteMode}
                                disabled={loading}
                            >
                                {isDeleteMode 
                                    ? selectedDecks.length > 0
                                        ? `Excluir Selecionados (${selectedDecks.length})` 
                                        : 'Cancelar Exclusão'
                                    : 'Excluir Decks'
                                }
                            </button>
                        </div>
                    </>
                )}

                <div className="decks-display-area">
                    {currentView === 'decks' ? (
                        filteredDecks.length > 0 ? filteredDecks.map(deck => {
                            const isSelected = selectedDecks.includes(deck.id);
                            
                            return (
                                <div 
                                    key={deck.id} 
                                    className={`deck-item-wrapper ${isDeleteMode ? 'delete-mode' : ''}`}
                                >
                                    <div 
                                        className={`deck-item ${isSelected ? 'selected-for-delete' : ''} ${isDeleteMode ? 'delete-mode-cursor' : ''}`} 
                                        onClick={() => handleDeckClick(deck)}
                                    >
                                        {deck.nome}
                                        {isSelected && 
                                            <span className="selection-indicator">&#10003;</span>
                                        }
                                    </div>
                                </div>
                            );
                        }) : <p className="empty-message">Nenhum deck encontrado.</p>
                    ) : (
                        <>
                            {/* 2. NOVO BOTÃO INICIAR ESTUDO */}
                            <div className="sequence-control-area">
                                <button
                                    className="start-sequence-btn"
                                    onClick={handleStartSequence}
                                    disabled={loading || flashcards.length === 0}
                                >
                                    Iniciar Estudo ({flashcards.length} Cards)
                                </button>
                            </div>
                            
                            {/* LISTA DE FLASHCARDS */}
                            {loading ? <p className="empty-message">Carregando flashcards...</p> :
                            flashcards.length > 0 ? flashcards.map(card => (
                                <div 
                                    key={card.id} 
                                    className="flashcard-item"
                                    onClick={() => handleFlashcardClick(card)} 
                                >
                                    <p className="flashcard-side-preview"><strong>Frente:</strong> {card.frente}</p>
                                    <hr/>
                                    <p className="flashcard-side-preview"><strong>Verso:</strong> {card.verso}</p>
                                </div>
                            )) : <p className="empty-message">Nenhum flashcard neste deck.</p>
                            }
                        </>
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