import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbardiv">
        <img className="navbar-logo" src="./img/Logo.png" alt="Logo" /></div>
      <button className="navbar-button">Crie seu flashcard</button>
    </nav>
  );
}

export default Navbar;
