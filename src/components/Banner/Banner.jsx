import React from "react";
import "./Banner.css";

function Banner() {
  return (
    <div className="banner">
      <div className="banner-content">
        <h4 className="banner-subtitle">Plataforma de estudos</h4>
        <h1 className="banner-title">
          Crie de forma fácil flashcards para seus{" "}
          <span className="no-wrap">estudos de memorização</span>
        </h1>
        <h3 className="banner-description">
          Transforme seus estudos em algo fácil, memorável e voltado para a verdadeira maestria.
          <br />
          Transforme em <strong>LearnMaster</strong>
        </h3>
        <button className="banner-button">Crie seu flashcard</button>
      </div>

      <div className="banner-image-container">
        <img
          src="./img/Flashcardsbanner.png"
          alt="Imagem de flashcards"
          className="banner-image"
        />
      </div>
    </div>
  );
}

export default Banner;
