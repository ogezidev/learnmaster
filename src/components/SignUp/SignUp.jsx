import React from 'react';
import './SignUp.css';
// Importe os ícones que vamos usar. Instale com: npm install react-icons
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="left-panel">
        <h1>Cadastre-se e seja bem vindo ao Learn Master</h1>
      </div>
      <div className="right-panel">
        <div className="login-link">
          <span>Você já tem uma conta?</span>
          <a href="#">Entre</a>
        </div>
        <div className="form-container">
          <div className="logo">
            <img src="/img/Logo.png" alt="Learn Master Logo" className="logo-image" />
          </div>

          <p className="subtitle">Memorize com a melhor plataforma educacional.<br /> Seja LearnMaster.</p>

          <button className="social-button google-button">
            <FcGoogle size={22} />
            <span className='google-text'>Entre com o Google</span>
          </button>

          <button className="social-button microsoft-button">
            <FaMicrosoft size={20} color="#5E5E5E" />
            <span className='microsoft-text'>Entre com a Microsoft</span>
          </button>

          <div className="separator">
            <span>OU</span>
          </div>

          <button className="email-button">
            Entre com um email
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;