// src/components/Bemvindo/Bemvindo.jsx (CORRIGIDO)
import './Bemvindo.css'

// 1. Remova o 'export' da função
function Bemvindo() { 
  return (
    <div className="bemvindo-container">
      <h1 className="bemvindo-title">Bem-vindo ao LearnMaster!</h1>
      <p className="bemvindo-text">
        Sua jornada de aprendizado começa aqui. Explore cursos, conecte-se com
        instrutores e alcance seus objetivos educacionais.
      </p>
    </div>
  );
}

// 2. Use 'export default' apenas no final
export default Bemvindo;