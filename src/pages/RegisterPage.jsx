import React, { useState } from 'react';
// 1. ADICIONEI 'useNavigate' AQUI
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingLink from '../components/LoadingLink/LoadingLink';
import InputField from '../components/InputField/InputField';
import Checkbox from '../components/InputField/CheckBox';
import PasswordField from '../components/InputField/PasswordField';
import './RegisterPage.css';

const RegisterPage = () => {
  // 2. ADICIONEI ESTA LINHA
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = 'http://localhost:8080/api/v1/usuario';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!agreedToTerms) {
      setErrorMessage('Você deve concordar com os termos LearnMaster para criar a conta.');
      return;
    }

    setIsLoading(true);
    try {
      const novoUsuario = {
        nome: name,
        email: email,
        senha: password,
      };

      const response = await axios.post(API_URL, novoUsuario);

      console.log('Cadastro realizado com sucesso:', response.data);

      // 3. ADICIONEI ESTAS DUAS LINHAS PARA SALVAR O TOKEN E REDIRECIONAR
      localStorage.setItem('userToken', response.data.token); // Guarda o token para auto-login
      navigate('/home'); // Redireciona para a página principal

    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setErrorMessage('Ocorreu um erro ao tentar criar a conta. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // NENHUMA ALTERAÇÃO NO SEU DESIGN/JSX
  return (
    <div className="register-container">
      <div className="register-left">
        <h1>Cadastre-se <br /> e seja bem vindo ao <br /> Learn Master</h1>
      </div>
      <div className="register-right">
        <div className="login-prompt">
          <p className="login-text">Você já tem uma conta?</p>
          <LoadingLink to="/login" className="login-button">Entre</LoadingLink>
        </div>
        <div className="register-form-wrapper">
          <div className="logo-placeholder">
            <div className="logo">
              <img src="/img/Logo.png" alt="Learn Master Logo" className="logo-image" />
            </div>
            <p className="learn-master-slogan">Memorize com a melhor plataforma educacional. <br />Seja LearnMaster.</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <InputField
              label="Nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
            />
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
            <Checkbox
              label="Eu concordo com os termos LearnMaster"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              id="terms"
            />

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;