// src/components/Bemvindo/Bemvindo.jsx (CORRIGIDO)
import './Bemvindo.css'

// 1. Altere a linha para usar um export nomeado (Named Export)
export function Bemvindo() { 
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

// 2. REMOVA a linha 'export default Bemvindo;' se existir