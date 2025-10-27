import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// CORRIGIDO: Caminho para LoadingContext (assumindo LoginPage em src/pages)
import { useLoading } from "../../context/LoadingContext";
import axios from "axios";

// CORRIGIDO: Caminhos para Componentes (assumindo LoginPage em src/pages)
import InputField from "../InputField/InputField";
import PasswordField from "../InputField/PasswordField";
import Checkbox from "../InputField/CheckBox";

// CORRIGIDO: Importar o CSS correto
import "./SignUp.css";

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
    setIsLoading(true); // Ativa loading global

    try {
      const url = "http://localhost:8080/api/v1/usuario/login";

      const response = await axios.post(url, {
        email: email,
        senha: password, // Campo 'senha'
      });

      const userData = response.data;
      console.log("[DEBUG LoginPage] Resposta COMPLETA da API:", JSON.stringify(userData, null, 2));

      // --- Limpeza ---
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userName");
      console.log("[DEBUG LoginPage] localStorage limpo antes de guardar.");

      let userNameToStore = 'Utilizador'; // Valor padrão

      // --- Guardar Token e Role ---
      if (userData.token) {
        localStorage.setItem("userToken", userData.token);
        console.log("[DEBUG LoginPage] Token guardado:", userData.token);
      } else {
        console.warn("[DEBUG LoginPage] Token NÃO encontrado na resposta.");
      }
      if (userData.role) {
        localStorage.setItem("userRole", userData.role);
        console.log("[DEBUG LoginPage] Role guardada:", userData.role);
      } else {
        console.warn("[DEBUG LoginPage] Role NÃO encontrada na resposta.");
      }

      // --- Extração e Armazenamento do Nome ---
      console.log("[DEBUG LoginPage] Verificando campo 'nome' em userData:", userData ? userData.nome : 'userData é nulo/undefined');
      // A condição abaixo assume que o nome vem como 'nome'.
      if (userData && userData.nome) {
          userNameToStore = userData.nome;
          console.log(`[DEBUG LoginPage] Campo 'nome' encontrado. Valor: "${userNameToStore}"`);
      } else {
          console.warn("[DEBUG LoginPage] Campo 'nome' NÃO encontrado ou vazio. Usando valor padrão 'Utilizador'.");
      }

      // Guarda o nome
      console.log(`[DEBUG LoginPage] Tentando guardar userName: "${userNameToStore}"`);
      localStorage.setItem("userName", userNameToStore);
      const storedName = localStorage.getItem("userName"); // Verifica imediatamente
      // !! ESTE É O LOG MAIS IMPORTANTE !!
      console.log(`[DEBUG LoginPage] Valor EFETIVAMENTE guardado em localStorage['userName']: "${storedName}"`);

      // Guarda o objeto completo do utilizador
      localStorage.setItem("loggedInUser", JSON.stringify(userData));
      console.log("[DEBUG LoginPage] loggedInUser guardado.");

      // --- Redirecionamento ---
      if (userData.role) {
        const userRoleFormatted = userData.role.trim().toUpperCase();
        if (userRoleFormatted === "ADMIN") {
           // Log antes da navegação
          console.log(`[DEBUG LoginPage] ANTES DE NAVEGAR para /crud. localStorage['userName'] é: "${localStorage.getItem("userName")}"`);
          console.log("[DEBUG LoginPage] Redirecionando para /crud (ADMIN)");
          navigate("/crud");
        } else {
           // Log antes da navegação
           console.log(`[DEBUG LoginPage] ANTES DE NAVEGAR para /home. localStorage['userName'] é: "${localStorage.getItem("userName")}"`);
          console.log("[DEBUG LoginPage] Redirecionando para /home (não ADMIN)");
          navigate("/home");
        }
      } else {
         // Log antes da navegação
         console.log(`[DEBUG LoginPage] ANTES DE NAVEGAR para /home (sem role). localStorage['userName'] é: "${localStorage.getItem("userName")}"`);
        console.log("[DEBUG LoginPage] Role não definida. Redirecionando para /home");
        navigate("/home");
      }

    } catch (error) {
      console.error("[DEBUG LoginPage] Erro no bloco try/catch:", error.response || error.message || error);
      setErrorMessage(error.response?.data?.message || "Email ou senha inválidos.");
      setIsLoading(false); // Garante desativação do loading global em erro
    } finally {
      setIsLoadingLocal(false);
    }
  };

  // --- JSX ---
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
              required
            />
            <PasswordField
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              required
            />
            <div className="login-options">
              <Checkbox
                label="Lembre de mim"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                id="remember"
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" disabled={isLoadingLocal} className="login-submit-button">
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