import React, { useState } from 'react';
import './CreateDeckModal.css';

// O Modal recebe props para controlar sua visibilidade, o que ele deve criar e as funções para fechar e criar.
const CreateDeckModal = ({ mode, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (name.trim()) { // Só cria se o nome não estiver vazio
      onCreate({ name, description });
      onClose(); // Fecha o modal após a criação
    } else {
      alert('Por favor, insira um nome.');
    }
  };

  // Não renderiza nada se não for para estar aberto
  if (!mode) return null;

  const title = mode === 'learndeck' ? 'Crie seu LearnDeck' : 'Crie seu Deck';
  const namePlaceholder = mode === 'learndeck' ? 'Ex: Programação' : 'Ex: JavaScript';
  const descPlaceholder = mode === 'learndeck' ? 'Fale sobre o seu LearnDeck (opcional)' : 'Fale sobre o seu Deck (opcional)';

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
        />
        <textarea
          className="modal-textarea"
          placeholder={descPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="modal-buttons">
          <button className="modal-btn btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="modal-btn btn-create" onClick={handleCreate}>Criar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateDeckModal;