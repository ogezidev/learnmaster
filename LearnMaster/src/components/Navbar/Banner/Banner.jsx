import React from "react";
import "./Banner.css";

function Banner() {
  return (
    <div className="banner">
      <div className="banner-content">
        <h4 className="banner-subtitle">Plataforma de estudos</h4>
        <h1 className="banner-title">
          Crie de forma fácil<br /> flashcards para seus<br /> estudos de memorização
        </h1>
        <h3 className="banner-description">
         Transforme seus estudos em algo fácil, memorável e direcionado para a verdadeira maestria. Cada etapa do seu aprendizado pode ser leve, eficiente e cheia de propósito.
<br />Transforme-se em <strong>LearnMaster.</strong>
        </h3>
        <button className="banner-button">Crie seu flashcard</button>
      </div>
      <div className="banner-image-container">
        <img
          src="./img/Flashcardsbanner.png"
          alt="imgbanner"
          className="banner-image"
        />
      </div>
    </div>
  );
}

export default Banner;
