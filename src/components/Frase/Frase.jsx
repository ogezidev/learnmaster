import "./Frase.css";

function Frase({ text }) {
  return (
    <blockquote className="frase">
      <p className="frase-text" id="frase-text">
        {text}
        "Com o LearnMaster, a eficácia dos flashcards pode chegar a
        impressionantes 200%, ajudando você a memorizar mais rápido"
      </p>
      <div className="frase-author" id="frase-author">
        <img className="LearnScottImg" src="/img/LearnScott.png"  alt="Author" />
        <p className="LearnScott">FlipCardy</p>
        <p className="Mascote">Nosso Mascote</p>
      </div>
    </blockquote>
  );
}
export default Frase;
