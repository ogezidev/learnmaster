import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";
import axios from "axios";

import InputField from "../components/InputField/InputField";
import PasswordField from "../components/InputField/PasswordField";
import Checkbox from "../components/InputField/CheckBox";

import "./LoginPage.css";

const LoginPage = () => {
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoadingLocal(true);
    setIsLoading(true);

    try {
      const url = "http://localhost:8080/api/v1/usuario/login";

      const response = await axios.post(url, {
        email: email,
        senha: password,
      });

      const userData = response.data;
      console.log("Login bem-sucedido (Resposta da API):", userData);

      // --- Armazena os dados de autenticação ---
      
      // Limpa dados antigos primeiro para garantir um login limpo
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("loggedInUser");

      if (userData.token) {
        localStorage.setItem("userToken", userData.token);
      }

      if (userData.role) {
        localStorage.setItem("userRole", userData.role);
      }

      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      // --- Redirecionamento com base na role (Lógica de diagnóstico) ---

      // 1. Verificamos se a 'role' existe
      if (userData.role) {
        
        // 2. Usamos .trim() para remover espaços e .toUpperCase() para ignorar case
        const userRoleFormatted = userData.role.trim().toUpperCase();
        
        if (userRoleFormatted === "ADMIN") {
          console.log("DECISÃO: Role é ADMIN. Redirecionando para /crud");
          navigate("/crud");
        } else {
          console.log("DECISÃO: Role NÃO é ADMIN (" + userRoleFormatted + "). Redirecionando para /home");
          navigate("/home");
        }
      } else {
        // Se a role for nula ou indefinida
        console.log("DECISÃO: Role está nula ou indefinida. Redirecionando para /home");
        navigate("/home");
      }

    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMessage("Email ou senha inválidos. Tente novamente.");
    } finally {
      setIsLoading(false);
      setIsLoadingLocal(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="register-prompt">
          <p className="register-text">Você ainda não tem uma conta?</p>
          <Link to="/register" className="register-button">
            Crie uma conta
          </Link>
        </div>

        <div className="login-form-wrapper">
          <div className="logo-section">
            <div className="logo">
              <img
                src="/img/Logo.png"
                alt="Learn Master Logo"
                className="logo-image"
              />
            </div>
            <p className="learn-master-slogan">
              Memorize com a melhor plataforma educacional. <br />
              Seja LearnMaster.
            </p>
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
              <Link to="/forgot-password" className="forgot-password-link">
                Esqueceu a senha?
              </Link>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button type="submit" disabled={isLoadingLocal}>
              {isLoadingLocal ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>

      <div className="login-right-panel">
        <h1>
          Faça o seu login no <br /> Learn Master
        </h1>
      </div>
    </div>
  );
};

export default LoginPage;
