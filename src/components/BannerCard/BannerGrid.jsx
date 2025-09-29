import BannerCard from "./BannerCard.jsx";

export default function BannerGrid() {
  return (
    <div className="banner-grid">
      {/* Card 1: imagem esquerda, texto direita */}
      <div className="banner-row" id="cardbannerfaculdade">
        <img
          src="/img/CardFaculdade.png"
          alt="Faculdade"
          className="banner-img"
          id="cardfaculdade"
        />
        <div className="banner-text" id="faculdade-texto">
          <span className="banner-category">Educação</span>
          <h3 className="banner-title2">
            Em faculdades renomadas, o uso de{" "}
            <span className="no-wrap">flashcards são comuns.</span>
          </h3>
          <p className="banner-subtitle2" id="faculdade-subtitle">
            <span className="no-wrap">Pesquisas mostram que faculdades</span>
            <br />
            reforçam alunos com flashcards.
          </p>
        </div>
      </div>

      {/* Card 2: texto esquerda, imagem direita */}
      <div className="banner-row reverse" id="cardbannercriança">
        <div className="banner-text" id="crianca-texto">
          <span className="banner-category">Memorização</span>
          <h3 className="banner-title2">
            Flashcards desde a infância já são praticados.
          </h3>
          <p className="banner-subtitle2">
            Crianças brincam com o jogo da memória, tornando diversão uma forma
            de aprendizagem.
          </p>
        </div>
        <img
          src="/img/CardCriança.png"
          alt="Criança"
          className="banner-img"
          id="cardcrianca"
        />
      </div>

      {/* Card 3: imagem esquerda, texto direita */}
      <div className="banner-row" id="cardbannercartao">
        <img
          src="/img/CardCartão.png"
          alt="Cartão"
          className="banner-img"
          id="cardcartao"
        />
        <div className="banner-text" id="cartao-texto">
          <span className="banner-category">Learn Master</span>
          <h3 className="banner-title2" id="cartao-title">Educação & Resultados</h3>
          <p className="banner-subtitle2">
            Pequenas ações geram grandes mudanças. Com o uso dos flashcards
            diariamente, você transforma pouco tempo de estudo em resultados
            duradouros.
          </p>
        </div>
      </div>
    </div>
  );
}
