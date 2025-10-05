import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext'; // <-- 1. IMPORTE O HOOK DO CONTEXTO

// Importando seus componentes
import InputField from '../components/InputField/InputField';
import PasswordField from '../components/InputField/PasswordField';
import Checkbox from '../components/InputField/CheckBox';

// Importando o CSS
import './LoginPage.css'; 

const LoginPage = () => { // <-- 2. REMOVA A PROP setIsLoading DAQUI
  const { setIsLoading } = useLoading(); // <-- 3. PEGUE A FUNÇÃO DIRETAMENTE DO CONTEXTO
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoadingLocal(true);
    
    // Agora o setIsLoading funciona porque veio do contexto
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsLoadingLocal(false);
      alert('Login efetuado (simulação)!');
    }, 2000);
  };

  return (
    // Seu JSX continua exatamente o mesmo
    <div className="login-container">
      <div className="login-left-panel">
        <div className="register-prompt">
          <p className="register-text">Você ainda não tem uma conta?</p>
          <Link to="/register" className="register-button">Crie uma conta</Link>
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
                 <Link to="/forgot-password" className="forgot-password-link">Esqueceu a senha?</Link>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button type="submit" disabled={isLoadingLocal}>
              {isLoadingLocal ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      <div className="login-right-panel">
        <h1>Faça o seu login no <br /> Learn Master</h1>
      </div>
    </div>
  );
};

export default LoginPage;