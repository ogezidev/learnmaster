import React, { useState } from 'react';
// 1. ADICIONEI 'useNavigate' AQUI
import { Link, useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import axios from 'axios';

// Seus componentes de input
import InputField from '../components/InputField/InputField';
import PasswordField from '../components/InputField/PasswordField';
import Checkbox from '../components/InputField/CheckBox';

// Seu CSS
import './LoginPage.css'; 

const LoginPage = () => {
  const { setIsLoading } = useLoading();
  // 2. ADICIONEI ESTA LINHA
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoadingLocal(true);
    setIsLoading(true);

    try {
      const url = 'http://localhost:8080/api/v1/usuario/login';
      
      const response = await axios.post(url, {
        email: email,
        senha: password
      });

      console.log('Login bem-sucedido:', response.data);
      
      // 3. ADICIONEI ESTAS DUAS LINHAS PARA SALVAR O TOKEN E REDIRECIONAR
      localStorage.setItem('userToken', response.data.token); // Guarda o token para manter o login
      navigate('/home'); // Redireciona para a página principal

    } catch (error) {
      console.error('Erro no login:', error);
      setErrorMessage('Email ou senha inválidos. Tente novamente.');
    } finally {
      setIsLoading(false);
      setIsLoadingLocal(false);
    }
  };

  // NENHUMA ALTERAÇÃO NO SEU DESIGN/JSX
  return (
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