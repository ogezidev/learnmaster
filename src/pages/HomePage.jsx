import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-left-section">
        <img src="/img/LogoBranca.png" alt="LearnMaster Logo" className="home-logo" />
        <h1 className="home-title">Crie agora mesmo o seu LearnCard!</h1>
        <p className="home-subtitle">
          Memorize mais rápido e de forma duradoura com o método de Flashcards, o mais eficaz para estudos acadêmicos.
        </p>
        <div className="home-buttons">
          {/* --- CORREÇÃO 1: Botão "Estudar" AGORA SEM LINK --- */}
          <button className="home-btn btn-study">Estudar LearnDeck</button>
          
          {/* CORREÇÃO 2: Botão "Criar" leva para a página de criação de flashcard */}
          <Link to="/criar-flashcard" className="home-btn btn-create">Crie seu flashcard</Link>
          
          {/* Botão "Ver todos" leva para a seleção de decks */}
          <Link to="/vertodos" className="home-btn btn-view-all">Ver todos</Link>
        </div>
      </div>
      
      <div className="home-right-section">
        <div className="card-stack-container">
          
          <div className="card card-back-2"></div>
          <div className="card card-back-1"></div>
          <div className="card card-middle"></div>
          
          <div className="card card-front">
            
            <div className="card-image-container">
              <img src="/img/LearnDeck.png" alt="Meu Deck" className="main-image" />
            </div>

            <div className="card-footer">
              <div className="footer-text-group">
                <span className="footer-label">LearnDeck</span>
                <span className="footer-title">Matematica</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;