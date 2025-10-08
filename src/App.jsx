import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useLoading } from './context/LoadingContext';

// --- PÁGINAS ---
import LandingPage from './pages/LandingPage';
import Cadastro from './pages/Cadastro';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import HomePage from './pages/HomePage';
import CreateFlashcardPage from './pages/CreateFlashcardPage';
import DeckSelectionPage from './pages/DeckSelectionPage'; // Importe a nova página

// --- COMPONENTES ---
const RouteChangeHandler = () => {
  const { setIsLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(false);
  }, [location.pathname]);

  return null;
};

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userToken') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};


function App() {
  const { isLoading } = useLoading();

  return (
    <Router>
      <RouteChangeHandler />
      {isLoading && <LoadingScreen />}
      <Routes>
        {/* --- ROTAS PÚBLICAS --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* --- ROTAS PRIVADAS (PARA USUÁRIOS LOGADOS) --- */}
        <Route
          path="/home"
          element={<PrivateRoute><HomePage /></PrivateRoute>}
        />
        
        <Route
          path="/criar-flashcard"
          element={<PrivateRoute><CreateFlashcardPage /></PrivateRoute>}
        />

        {/* Rota para a nova página de seleção de decks */}
        <Route
          path="/selecionar-deck"
          element={<PrivateRoute><DeckSelectionPage /></PrivateRoute>}
        />

        {/* Rota padrão */}
        <Route 
          path="*" 
          element={
            localStorage.getItem('userToken') !== null 
              ? <Navigate to="/home" /> 
              : <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
