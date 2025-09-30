// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from "./pages/LandingPage";
import Cadastro from "./pages/Cadastro"; // 1. Importar a nova página

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cadastro" element={<Cadastro />} /> {/* 2. Adicionar a nova rota */}
      </Routes>
    </Router>
  );
}

export default App;