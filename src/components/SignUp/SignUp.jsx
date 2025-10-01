import React from 'react';
// 1. Importe o 'Link' do react-router-dom
import { Link } from 'react-router-dom'; 
import './SignUp.css';
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
          
          {/* 2. Substitua o <button> por um <Link>.
            - O 'to="/register"' aponta para a rota da página que criei.
            - Mantive a mesma className "email-button" para que o visual não mude.
          */}
          <Link to="/register" className="email-button">
            Entre com um email
          </Link>

        </div>
      </div>
    </div>
  );
};

export default SignUp;