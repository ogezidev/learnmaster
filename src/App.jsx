import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useLoading } from './context/LoadingContext'; // Importa nosso hook

// Suas Páginas
import LandingPage from './pages/LandingPage';
import Cadastro from './pages/Cadastro';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

// Componente que desliga o loading a cada mudança de rota
const RouteChangeHandler = () => {
  const { setIsLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(false);
  }, [location.pathname]);

  return null;
};

function App() {
  const { isLoading } = useLoading(); // Pega o estado de carregamento do contexto

  return (
    <Router>
      <RouteChangeHandler />
      {isLoading && <LoadingScreen />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;