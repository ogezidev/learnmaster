import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

// Suas Páginas
import LandingPage from './pages/LandingPage';
import Cadastro from './pages/Cadastro';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

// Componente Auxiliar para gerenciar o estado em cada rota
const PageWrapper = ({ children, setIsLoading }) => {
  const location = useLocation();

  useEffect(() => {
    // Esta função será chamada toda vez que a URL mudar (nova página carregar)
    // e esconderá a tela de carregamento.
    setIsLoading(false);
  }, [location.pathname]); // A dependência é a mudança de URL

  // Passa a função setIsLoading para o componente filho (a página)
  return React.cloneElement(children, { setIsLoading });
};

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Router>
      {/* A tela de carregamento será exibida sobre tudo quando isLoading for true */}
      {isLoading && <LoadingScreen />}

      <Routes>
        <Route path="/" element={<PageWrapper setIsLoading={setIsLoading}><LandingPage /></PageWrapper>} />
        <Route path="/cadastro" element={<PageWrapper setIsLoading={setIsLoading}><Cadastro /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper setIsLoading={setIsLoading}><RegisterPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper setIsLoading={setIsLoading}><LoginPage /></PageWrapper>} />
      </Routes>
    </Router>
  );
}

export default App;