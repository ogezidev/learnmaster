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
import CrudPage from "./pages/CrudPage";
// NOTA: A rota /admin abaixo vai falhar
// porque 'AdminPage' não está importado aqui.

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

        {/* 3. ROTA CRUD ADICIONADA: Mapeia /crud para o componente CrudPage */}
        <Route
          path="/crud"
          element={
            <PrivateRoute>
              <CrudPage />
            </PrivateRoute>
          }
        />

        {/* Rota de Admin (COMENTADA)
            Eu comentei esta rota porque 'AdminPage' não foi importado
            no topo do arquivo e isso causaria um erro.
            Descomente quando você importar o componente AdminPage.
        */}
        {/* <Route
          path="/admin"
          element={
            <PrivateRoute role="ADMIN">
              <AdminPage />
            </PrivateRoute>
          }
        /> */}

        {/* Rota padrão (Curinga) */}
        {/* É uma boa prática deixar a rota "*" por último */}
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
