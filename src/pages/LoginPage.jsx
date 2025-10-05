import React, { useState } from 'react';
import LoadingLink from '../components/LoadingLink/LoadingLink';

// Importando seus componentes de input
import InputField from '../components/InputField/InputField';
import PasswordField from '../components/InputField/PasswordField';
import Checkbox from '../components/InputField/CheckBox';

// Importando o CSS correto
import './LoginPage.css'; 

const LoginPage = ({ setIsLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  // Este é o estado local para o botão
  const [isLoadingLocal, setIsLoadingLocal] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoadingLocal(true);
    
    // Ativa a tela de carregamento global
    setIsLoading(true);

    // Simula o tempo de verificação do login
    setTimeout(() => {
      // Desativa ambas as telas de carregamento
      setIsLoading(false);
      setIsLoadingLocal(false);
      alert('Login efetuado (simulação)!');
    }, 2000);
  };

  return (
    <div className="login-container">
      {/* PAINEL ESQUERDO (BRANCO) - Com o formulário */}
      <div className="login-left-panel">
        <div className="register-prompt">
          <p className="register-text">Você ainda não tem uma conta?</p>
          <LoadingLink to="/register" className="register-button">Crie uma conta</LoadingLink>
        </div>
        
        <div className="login-form-wrapper">
          <div className="logo-section">
             <div className="logo">
                <img src="/img/Logo.png" alt="Learn Master Logo" className="logo-image" />
             </div>
             <p className="learn-master-slogan">Memorize com a melhor plataforma educacional. <br />Seja LearnMaster.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
            />
            <PasswordField
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
            />
            
            <div className="login-options">
                <Checkbox
                    label="Lembre de mim"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    id="remember"
                />
                 <LoadingLink to="/forgot-password" className="forgot-password-link">Esqueceu a senha?</LoadingLink>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* --- CORREÇÃO AQUI --- */}
            <button type="submit" disabled={isLoadingLocal}>
              {isLoadingLocal ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      {/* PAINEL DIREITO (AZUL) - Com a mensagem de boas-vindas */}
      <div className="login-right-panel">
        <h1>Faça o seu login no <br /> Learn Master</h1>
      </div>
    </div>
  );
};

export default LoginPage;