import React from "react";
// 1. Importe o 'Link' padrão do react-router-dom
import { Link } from 'react-router-dom'; 

import "./SignUp.css";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";

// Removida a necessidade de importar LoadingLink por enquanto

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="left-panel">
        <h1>Cadastre-se e seja bem vindo ao Learn Master</h1>
      </div>
      <div className="right-panel">
        <div className="login-prompt">
          <p className="login-text">Você já tem uma conta?</p>
          {/* 2. Usar Link padrão para /login */}
          <Link to="/login" className="login-button">
            Entre
          </Link>
        </div>

        <div className="form-container">
          <div className="logo">
            <img
              src="/img/Logo.png" // Certifique-se que a pasta 'public/img' existe ou ajuste o caminho
              alt="Learn Master Logo"
              className="logo-image"
            />
          </div>

          <p className="subtitle">
            Memorize com a melhor plataforma educacional.
            <br /> Seja LearnMaster.
          </p>

          {/* Botões sociais (ainda sem funcionalidade) */}
          <button className="social-button google-button">
            <FcGoogle size={22} />
            <span className="google-text">Entre com o Google</span>
          </button>

          <button className="social-button microsoft-button">
            <FaMicrosoft size={20} color="#5E5E5E" />
            <span className="microsoft-text">Entre com a Microsoft</span>
          </button>

          <div className="separator">
            <span>OU</span>
          </div>

          {/* 3. Usar Link padrão para /register */}
          {/* - Mantém a mesma className para o estilo */}
          <Link to="/register" className="email-button">
            Cadastre-se com Email
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default SignUp;