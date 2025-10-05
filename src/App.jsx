// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from "./pages/LandingPage";
import Cadastro from "./pages/Cadastro"; 
import RegisterPage from "./pages/RegisterPage"; 
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Suas rotas existentes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;