import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <img className="navbar-logo" src="./img/Logo.png" alt="Logo" />
        <Link to="/cadastro">
          <button className="navbar-button">
            Crie seu flashcard
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
