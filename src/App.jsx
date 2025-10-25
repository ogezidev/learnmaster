import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useLoading } from "./context/LoadingContext";

// --- PÁGINAS ---
import LandingPage from "./pages/LandingPage";
import Cadastro from "./pages/Cadastro";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import HomePage from "./pages/HomePage";
import CreateFlashcardPage from "./pages/CreateFlashcardPage";
import DeckSelectionPage from "./pages/DeckSelectionPage";
// 1. IMPORTAÇÃO ADICIONADA:
import VerTodos from "./pages/VerTodos";

// --- COMPONENTES ---
const RouteChangeHandler = () => {
  const { setIsLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(false);
  }, [location.pathname]);

  return null;
};

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/home" />; // ou para uma página "Acesso negado"
  }

  return children;
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

        {/* --- ROTAS PRIVADAS --- */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/criar-flashcard"
          element={
            <PrivateRoute>
              <CreateFlashcardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/selecionar-deck"
          element={
            <PrivateRoute>
              <DeckSelectionPage />
            </PrivateRoute>
          }
        />

        {/* 2. ROTA ADICIONADA: Mapeia /vertodos para o componente VerTodos */}
        <Route
          path="/vertodos"
          element={
            <PrivateRoute>
              <VerTodos />
            </PrivateRoute>
          }
        />

        {/* Rota padrão */}
        <Route
          path="*"
          element={
            localStorage.getItem("userToken") !== null ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      
      </Routes>
    </Router>
  );
}

export default App;
