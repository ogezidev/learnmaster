import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CrudPage.css"; // Vamos usar o novo CSS

// Importando os ícones que você usou no Figma
import { FaTrash, FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
// Importando o ícone de 3 pontos
import { HiDotsVertical } from "react-icons/hi";

const CrudPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalState, setModalState] = useState(null); // null, 'actions', 'edit', 'delete'
  const [userStatus, setUserStatus] = useState({});
  const [editNome, setEditNome] = useState("");
  const [editCargo, setEditCargo] = useState("USER");

  const token = localStorage.getItem("userToken");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      const initialStatus = {};
      response.data.forEach(user => {
        // Como você pediu, o status é SÓ VISUAL e não vem do banco
        initialStatus[user.id] = "ATIVO"; 
      });
      setUserStatus(initialStatus);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 2. LÓGICA DOS MODAIS (Atualizada) ---

  const openActionsModal = (user) => {
    setCurrentUser(user);
    setModalState("actions");
  };

  const openEditModal = () => {
    setEditNome(currentUser.nome);
    setEditCargo(currentUser.nivelAcesso);
    setModalState("edit");
  };

  const openDeleteModal = () => {
    setModalState("delete");
  };

  // Fecha TODOS os modais
  const closeModal = () => {
    setModalState(null);
    setCurrentUser(null);
  };

  // Volta para o modal de ações (lógica do Figma)
  const backToActions = () => {
    setModalState("actions");
  };

  // --- 3. AÇÕES DO CRUD (Sem alteração na lógica) ---

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/usuario/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== currentUser.id));
      closeModal(); // Fecha tudo após excluir
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const updatedData = {
      nome: editNome,
      nivelAcesso: editCargo 
    };
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/usuario/${currentUser.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => 
        user.id === currentUser.id ? response.data : user
      ));
      backToActions(); // Volta para o modal de ações
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
    }
  };

  // Lógica do Status (Visual)
  const handleToggleStatus = () => {
    const currentStatus = userStatus[currentUser.id];
    const newStatus = currentStatus === "ATIVO" ? "INATIVO" : "ATIVO";
    setUserStatus({
      ...userStatus,
      [currentUser.id]: newStatus
    });
  };

  // --- 4. LÓGICA DOS CHECKBOXES (Sem alteração) ---
  
  const handleSelectUser = (id) => {
    setSelectedUserIds(
      selectedUserIds.includes(id)
        ? selectedUserIds.filter(userId => userId !== id)
        : [...selectedUserIds, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(users.map(user => user.id));
    }
  };

  // --- 5. RENDERIZAÇÃO (JSX Atualizado) ---
  return (
    <div className="crud-container">
      <nav className="crud-sidebar">
        <div className="sidebar-logo">
          <img className="logobrancacrud" src="/img/LogoBranca.png" alt="Learn Master Logo" /> 
        </div>
        <button className="sidebar-button active">
          {/* Ícone de Usuários do Figma */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z" fill="white"/>
          </svg>
          Usuários
        </button>
      </nav>

      <main className="crud-main-content">
        <header className="crud-header">
          <span className="breadcrumb">home</span>
          <div className="user-profile">
            <div className="user-avatar"></div>
            <span>Diego</span> {/* Puxar do localStorage? */}
          </div>
        </header>

        <div className="content-body">
          <h1>Usuários</h1>
          
          {/* AQUI ENTRA A BARRA DE BUSCAR E FILTROS DO FIGMA */}
          <div className="table-controls">
            <input type="text" placeholder="Buscar" className="search-bar" />
            {/* Adicionar os rádios de Ativo/Inativo aqui */}
          </div>

          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={selectedUserIds.length === users.length && users.length > 0}
                    />
                  </th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Data de Criação</th>
                  <th>Status</th>
                  <th>Cargo</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input 
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td>{user.nome}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.dataCadastro).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${userStatus[user.id] === 'ATIVO' ? 'status-ativo' : 'status-inativo'}`}>
                        {userStatus[user.id]}
                      </span>
                    </td>
                    <td>{user.nivelAcesso}</td>
                    <td>
                      <button className="action-button" onClick={() => openActionsModal(user)}>
                        <HiDotsVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Adicionar Paginação aqui */}
        </div>
      </main>

      {/* --- MODAIS (Estrutura do Figma) --- */}

      {/* Modal de Ações (Frame 5) */}
      {modalState === "actions" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-actions-menu" onClick={(e) => e.stopPropagation()}>
            <button className="modal-btn btn-delete" onClick={openDeleteModal}>
              <FaTrash /> Excluir
            </button>
            <button className="modal-btn btn-edit" onClick={openEditModal}>
              <FaPencilAlt /> Editar
            </button>
            <button 
              className={`modal-btn btn-status ${userStatus[currentUser.id] === 'ATIVO' ? 'btn-status-inativo' : 'btn-status-ativo'}`}
              onClick={handleToggleStatus}
            >
              {userStatus[currentUser.id] === 'ATIVO' ? <FaToggleOn /> : <FaToggleOff />}
              {userStatus[currentUser.id] === 'ATIVO' ? 'Inativo' : 'Ativo'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Excluir (Frame 6) */}
      {modalState === "delete" && (
        <div className="modal-overlay" onClick={backToActions}>
          <div className="modal-content modal-delete-confirm" onClick={(e) => e.stopPropagation()}>
            <h2>Tem certeza que deseja excluir {currentUser.nome}?</h2>
            <p>Você pode inativar ao invés de excluir o usuário.</p>
            <button onClick={handleDeleteUser} className="modal-btn btn-delete-confirm" id="confirmDeleteBtn">
              Excluir
            </button>
          </div>
        </div>
      )}

      {/* Modal de Editar (Frame 7) */}
      {modalState === "edit" && (
        <div className="modal-overlay" onClick={backToActions}>
          <div className="modal-content modal-edit-form" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleEditUser}>
              <div className="form-group">
                <label htmlFor="editNome">User</label>
                <input
                  type="text"
                  id="editNome"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="editCargo">Cargo</label>
                <select 
                  id="editCargo" 
                  value={editCargo} 
                  onChange={(e) => setEditCargo(e.target.value)}
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="modal-btn btn-edit-confirm">
                  Editar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudPage;