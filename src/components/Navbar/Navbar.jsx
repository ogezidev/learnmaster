import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <img className="navbar-logo" src="./img/Logo.png" alt="Logo" />
        <button className="navbar-button">Crie seu flashcard</button>
      </div>
    </nav>
  );
}

export default Navbar;
