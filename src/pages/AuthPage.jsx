import React, { useState } from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import RegisterForm from '../components/RegisterForm/RegisterForm';
import './AuthPage.css'; // O CSS que fará a mágica da animação

const AuthPage = () => {
  // O "interruptor": 'true' mostra Login, 'false' mostra Cadastro
  const [isLoginView, setIsLoginView] = useState(false);

  // Função para trocar a visualização
  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>
          {isLoginView
            ? 'Bem-vindo de volta ao Learn Master'
            : 'Cadastre-se e seja bem vindo ao Learn Master'}
        </h1>
      </div>
      <div className="auth-right">
        {/* O container da animação */}
        <div className={`form-flipper ${isLoginView ? 'show-login' : 'show-register'}`}>
          <div className="form-panel register-panel">
            <RegisterForm toggleView={toggleView} />
          </div>
          <div className="form-panel login-panel">
            <LoginForm toggleView={toggleView} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;