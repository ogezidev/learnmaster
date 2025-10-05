import React, { useState } from 'react';
import InputField from '../InputField/InputField';
import PasswordField from '../InputField/PasswordField';
import Checkbox from '../InputField/CheckBox';

// Este componente também recebe 'toggleView'
const LoginForm = ({ toggleView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // AQUI ENTRARÁ A LÓGICA DE LOGIN NO FUTURO
    alert('Lógica de login ainda não implementada.');
  };

  return (
    <div className="form-container">
      <div className="logo-placeholder">
        <p className="learn-master-brand">Learn Master</p>
        <p className="learn-master-slogan">Memorize com a melhor plataforma educacional</p>
        <p className="learn-master-slogan">Seja LearnMaster.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <PasswordField label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="login-options">
          <Checkbox label="Lembre de mim" />
          <a href="#">Esqueceu a senha?</a>
        </div>
        <button type="submit">Entrar</button>
      </form>
       <p className="toggle-link">
          Não tem uma conta? <span onClick={toggleView}>Crie uma</span>
      </p>
    </div>
  );
};

export default LoginForm;