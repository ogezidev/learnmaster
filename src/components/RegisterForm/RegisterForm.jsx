import React, { useState } from 'react';
import axios from 'axios';
import InputField from '../InputField/InputField';
import Checkbox from '../InputField/CheckBox';
import PasswordField from '../InputField/PasswordField';

// Note que este componente recebe uma função 'toggleView' como propriedade
const RegisterForm = ({ toggleView }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ... (outros estados como isLoading, errorMessage)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (sua lógica de handleSubmit que já funciona)
    const novoUsuario = { nome: name, email: email, senha: password };
    try {
      await axios.post('http://localhost:8080/api/v1/usuario', novoUsuario);
      alert('Cadastro realizado com sucesso!');
      toggleView(); // Após o sucesso, troca para a tela de login
    } catch (error) {
      alert('Erro no cadastro. Verifique os dados ou se o email já existe.');
    }
  };

  return (
    <div className="form-container">
      <div className="logo-placeholder">
        <p className="learn-master-brand">Learn Master</p>
        <p className="learn-master-slogan">Memorize com a melhor plataforma educacional</p>
        <p className="learn-master-slogan">Seja LearnMaster.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <InputField label="Nome" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordField label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Checkbox label="Eu concordo com os termos LearnMaster" />
        <button type="submit">Criar conta</button>
      </form>
       <p className="toggle-link">
          Você já tem uma conta? <span onClick={toggleView}>Entre</span>
      </p>
    </div>
  );
};

export default RegisterForm;