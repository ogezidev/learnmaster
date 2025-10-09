import React, { useState, useEffect } from 'react';
// REMOVIDO: import { useNavigate } from 'react-router-dom';
import './CreateDeckModal.css';

// A propriedade agora se chama 'onCreate' para corresponder ao que a página pai envia.
const CreateDeckModal = ({ isOpen, mode, onClose, onCreate }) => {
  const [name, setName] = useState('');

  // Limpa o nome quando o modal é fechado ou o modo muda
  useEffect(() => {
    if (!isOpen) {
      setName('');
    }
  }, [isOpen]);

  const handleCreateClick = async () => { // Mantido async por boa prática
    if (name.trim()) {
      // Chama a função 'onCreate' que foi passada pela página pai.
      // A navegação para /vertodos será feita APENAS após o Flashcard ser salvo
      // na página DeckSelectionPage.jsx.
      await onCreate({ name });
      
      // O modal será fechado pela função onCreate da página pai (setIsModalOpen(false))
    } else {
      alert('Por favor, insira um nome.');
    }
  };

  // Se não for para estar aberto, não renderiza nada.
  if (!isOpen) return null;

  const title = mode === 'learndeck' ? 'Crie sua Categoria' : 'Crie seu Deck';
  const namePlaceholder = mode === 'learndeck' ? 'Ex: Programação' : 'Ex: JavaScript Básico';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <input
          type="text"
          className="modal-input"
          placeholder={namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="modal-buttons">
          <button className="modal-btn btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-btn btn-create" onClick={handleCreateClick}>Criar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateDeckModal;