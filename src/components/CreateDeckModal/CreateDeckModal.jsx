import React, { useState } from 'react';
import axios from 'axios'; // 1. Importe o axios
import './CreateDeckModal.css';

// 2. Adicione a função para pegar o usuário
const getLoggedInUser = () => {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
};

// 3. Receba uma nova prop `onDeckCreated` para atualizar a lista de decks na página anterior
function CreateDeckModal({ isOpen, onClose, onDeckCreated }) {
  const [deckName, setDeckName] = useState('');
  const [error, setError] = useState('');

  // 4. Crie a função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!deckName.trim()) {
      setError('O nome do deck não pode estar vazio.');
      return;
    }

    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      setError('Você precisa estar logado para criar um deck.');
      return;
    }

    // 5. Monte o objeto que será enviado para a API
    const newDeckData = {
      nome: deckName,
      usuario: {
        id: loggedInUser.id, // Associa o deck ao usuário logado
      },
    };

    try {
      // 6. Faça a requisição POST para o back-end
      const response = await axios.post('http://localhost:8080/api/v1/folder', newDeckData);
      
      // 7. Se deu certo:
      onDeckCreated(response.data); // Executa a função do componente pai para atualizar a lista
      setDeckName(''); // Limpa o input
      onClose(); // Fecha o modal
    } catch (err) {
      setError('Ocorreu um erro ao criar o deck. Tente novamente.');
      console.error(err);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Criar Novo Deck</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome do Deck"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="submit" className="create-button">Criar</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDeckModal;