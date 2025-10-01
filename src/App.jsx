// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Suas páginas existentes
import LandingPage from "./pages/LandingPage";
import Cadastro from "./pages/Cadastro"; // A sua página de cadastro original que você quer manter

import RegisterPage from "./pages/RegisterPage"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Suas rotas existentes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;