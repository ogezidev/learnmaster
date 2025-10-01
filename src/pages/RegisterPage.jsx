import React, { useState } from 'react';
import axios from 'axios';
import InputField from '../components/InputField/InputField'; 
import Checkbox from '../components/InputField/CheckBox';
import PasswordField from '../components/InputField/PasswordField'; 
import './RegisterPage.css'; 

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = 'Db_learnmaster.mssql.somee.com'; 

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
      const response = await axios.post(API_URL, {
        name,
        email,
        password,
      });
      console.log('Cadastro realizado com sucesso:', response.data);
      setSuccessMessage('Conta criada com sucesso! Redirecionando...');
    
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Ocorreu um erro ao tentar criar a conta. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1>Cadastre-se <br /> e seja bem vindo ao <br /> Learn Master</h1>
      </div>
      <div className="register-right">
        <div className="login-prompt">
          <p>Você já tem uma conta?</p>
          <a href="/login">Entre</a>
        </div>
        <div className="register-form-wrapper">
          <div className="logo-placeholder">
          
            <p className="learn-master-brand">Learn Master</p>
            <p className="learn-master-slogan">Memorize com a melhor plataforma educacional</p>
            <p className="learn-master-slogan">Seja LearnMaster.</p>
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

            <button type="submit" disabled={!agreedToTerms || isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;