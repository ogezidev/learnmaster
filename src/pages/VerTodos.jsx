import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './DeckSelectionPage.css'; // Reutiliza estilos
import './VerTodos.css'; // Seus estilos personalizados

// Função para pegar o usuário logado (essencial para a chamada da API)
const getLoggedInUser = () => {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
};

const VerTodos = () => {
    // --- ESTADO PARA GUARDAR OS DADOS VINDOS DA API ---
    const [allLearnDecks, setAllLearnDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentView, setCurrentView] = useState('learndecks');
    const [selectedLearnDeck, setSelectedLearnDeck] = useState(null);

    // --- LÓGICA PARA BUSCAR OS DADOS REAIS DO BACK-END ---
    useEffect(() => {
        const user = getLoggedInUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/folder/user/${user.id}`);
                const allDecksFromApi = response.data || [];

                // Transforma a lista de decks em uma estrutura de Categoria -> Decks
                const groupedDecks = allDecksFromApi.reduce((acc, deck) => {
                    const groupName = deck.statusPasta;
                    if (groupName && groupName !== 'ATIVO') {
                        if (!acc[groupName]) {
                            // Cria a categoria (LearnDeck) se ela não existir
                            acc[groupName] = { id: groupName, name: groupName, decks: [] };
                        }
                        // Adiciona o deck atual à sua categoria
                        acc[groupName].decks.push({ id: deck.id, name: deck.nome });
                    }
                    return acc;
                }, {});

                // Converte o objeto de grupos em um array
                const learnDecksArray = Object.values(groupedDecks);
                setAllLearnDecks(learnDecksArray);

            } catch (error) {
                if (error.response && error.response.status !== 204) {
                    console.error("Erro ao buscar decks:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Executa apenas uma vez quando a página carrega

    // A sua lógica de filtragem agora usa o estado 'allLearnDecks'
    const filteredLearnDecks = useMemo(() => {
        if (!searchTerm) {
            return allLearnDecks;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        return allLearnDecks.filter(learnDeck => 
            learnDeck.name.toLowerCase().includes(lowerCaseSearch) ||
            learnDeck.decks.some(deck => deck.name.toLowerCase().includes(lowerCaseSearch))
        );
    }, [searchTerm, allLearnDecks]);

    const handleLearnDeckClick = (learnDeck) => {
        setSelectedLearnDeck(learnDeck);
        setCurrentView('decks'); 
    };

    const handleBackClick = () => {
        setSelectedLearnDeck(null);
        setCurrentView('learndecks'); 
    };

    const renderSearchBar = () => (
        <input
            type="text"
            placeholder="Pesquisar por categoria ou deck..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
        />
    );

    if (loading) {
        return <div className="ver-todos-page-container"><p className="empty-message" style={{color: '#333'}}>Carregando seus decks...</p></div>;
    }

    return (
        <div className="ver-todos-page-container">
            <div className="ver-todos-content-box">
                <h1 className="deck-selection-title">
                    {currentView === 'learndecks' ? 'Todos os seus LearnDecks' : `Decks em ${selectedLearnDeck?.name}`}
                </h1>
                
                {currentView === 'learndecks' && renderSearchBar()}

                <div className="decks-display-area">
                    {currentView === 'learndecks' ? (
                        filteredLearnDecks.length > 0 ? (
                            filteredLearnDecks.map(learnDeck => (
                                <div 
                                    key={learnDeck.id} 
                                    className="deck-item" 
                                    onClick={() => handleLearnDeckClick(learnDeck)}
                                >
                                    {learnDeck.name}
                                </div>
                            ))
                        ) : (
                            <p className="empty-message">Nenhum resultado encontrado.</p>
                        )
                    ) : (
                        selectedLearnDeck?.decks.length > 0 ? (
                            selectedLearnDeck.decks.map(deck => (
                                <div 
                                    key={deck.id} 
                                    className="deck-item deck-item-internal"
                                    // Ação de clique futura: pode levar para a página de estudo
                                    onClick={() => alert(`Você selecionou o deck: ${deck.name}`)}
                                >
                                    {deck.name}
                                </div>
                            ))
                        ) : (
                            <p className="empty-message">Nenhum Deck encontrado nesta categoria.</p>
                        )
                    )}
                </div>

                <div className="deck-selection-buttons">
                    {currentView === 'decks' && (
                        <button className="deck-selection-btn btn-back" onClick={handleBackClick}>Voltar para Categorias</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerTodos;