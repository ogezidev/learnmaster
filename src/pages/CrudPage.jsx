import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CrudPage.css"; // Vamos usar o novo CSS

// Importando os ícones que você usou no Figma
import { FaTrash, FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
// Importando o ícone de 3 pontos
import { HiDotsVertical } from "react-icons/hi";

// --- ADICIONADO: Ler o nome do usuário do localStorage ---
// Lê o item 'userName' que guardámos durante o login.
// Se não encontrar, usa 'Utilizador' como fallback.
const loggedInUserName = localStorage.getItem("userName") || "Utilizador";

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
        // Status visual inicial
        initialStatus[user.id] = "ATIVO"; 
      });
      setUserStatus(initialStatus);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // A dependência vazia [] significa que isto só corre uma vez quando o componente monta
  }, []); 

  // --- LÓGICA DOS MODAIS ---
  const openActionsModal = (user) => {
    setCurrentUser(user);
    setModalState("actions");
  };

  const openEditModal = () => {
    if (!currentUser) return; // Segurança extra
    setEditNome(currentUser.nome);
    setEditCargo(currentUser.nivelAcesso || "USER"); // Valor padrão se nivelAcesso for null/undefined
    setModalState("edit");
  };

  const openDeleteModal = () => {
    setModalState("delete");
  };

  const closeModal = () => {
    setModalState(null);
    setCurrentUser(null);
    // Limpar campos de edição ao fechar qualquer modal pode ser útil
    setEditNome("");
    setEditCargo("USER");
  };

  const backToActions = () => {
     // Limpa os campos de edição ao voltar para o menu de ações
    setEditNome("");
    setEditCargo("USER");
    setModalState("actions");
  };

  // --- AÇÕES DO CRUD ---
  const handleDeleteUser = async () => {
    if (!currentUser) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/usuario/${currentUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== currentUser.id));
      // Remover o status do utilizador excluído
      const newStatus = { ...userStatus };
      delete newStatus[currentUser.id];
      setUserStatus(newStatus);
      closeModal(); 
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      alert("Erro ao excluir usuário."); // Feedback para o utilizador
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
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
      // Atualiza o currentUser no estado se ele estava selecionado
      setCurrentUser(response.data); 
      backToActions(); 
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      alert("Erro ao editar usuário."); // Feedback para o utilizador
    }
  };

  // Lógica do Status (Visual)
  const handleToggleStatus = () => {
    if (!currentUser) return;
    const currentStatus = userStatus[currentUser.id];
    const newStatus = currentStatus === "ATIVO" ? "INATIVO" : "ATIVO";
    setUserStatus({
      ...userStatus,
      [currentUser.id]: newStatus
    });
    // Nota: Esta ação não persiste no backend, é apenas visual
  };

  // --- LÓGICA DOS CHECKBOXES ---
  const handleSelectUser = (id) => {
    setSelectedUserIds(
      selectedUserIds.includes(id)
        ? selectedUserIds.filter(userId => userId !== id)
        : [...selectedUserIds, id]
    );
  };

  const handleSelectAll = (e) => { // Recebe o evento
    if (e.target.checked) { // Se o checkbox "todos" foi marcado
      setSelectedUserIds(users.map(user => user.id));
    } else { // Se foi desmarcado
      setSelectedUserIds([]);
    }
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div className="crud-container">
      {/* Sidebar - Mantida como está */}
      <nav className="crud-sidebar">
        <div className="sidebar-logo">
          <img className="logobrancacrud" src="/img/LogoBranca.png" alt="Learn Master Logo" /> 
        </div>
        <button className="sidebar-button active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z" fill="white"/>
          </svg>
          Usuários
        </button>
      </nav>

      <main className="crud-main-content">
        <header className="crud-header">
          {/* <span className="breadcrumb">home</span> */} {/* Comentado se não for necessário */}
          <div className="user-profile">
            <div className="user-avatar"></div> {/* Pode adicionar uma imagem aqui */}
            {/* --- ALTERAÇÃO PRINCIPAL AQUI --- */}
            {/* Usa a variável loggedInUserName lida do localStorage */}
            <span>{loggedInUserName}</span> 
          </div>
        </header>

        <div className="content-body">
          <h1 className="titulousuarios">Usuários</h1>
          
          <div className="table-controls">
            <input type="text" placeholder="Buscar" className="search-bar" />
            {/* Adicionar filtros de status aqui se necessário */}
          </div>

          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      // Verifica se TODOS os IDs de users estão em selectedUserIds
                      checked={users.length > 0 && selectedUserIds.length === users.length}
                      // Desabilita se não houver usuários
                      disabled={users.length === 0} 
                    />
                  </th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Data de Criação</th>
                  <th>Status</th>
                  <th>Cargo</th>
                  <th> </th> {/* Coluna para o botão de ações */}
                </tr>
              </thead>
              <tbody>
                {/* Renderização condicional se não houver usuários */}
                {users.length === 0 ? (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum usuário encontrado.</td>
                    </tr>
                ) : (
                    users.map((user) => (
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
                        {/* Formatação segura da data */}
                        <td>{user.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`status ${userStatus[user.id] === 'ATIVO' ? 'status-ativo' : 'status-inativo'}`}>
                            {userStatus[user.id] || 'N/A'} {/* Fallback se o status não existir */}
                          </span>
                        </td>
                        <td>{user.nivelAcesso || 'N/A'}</td> {/* Fallback */}
                        <td>
                          <button className="action-button" onClick={() => openActionsModal(user)}>
                            <HiDotsVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
          {/* Adicionar Paginação aqui */}
        </div>
      </main>

      {/* --- MODAIS --- */}
      {/* Modal de Ações */}
      {modalState === "actions" && currentUser && ( // Adicionado currentUser check
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
              {userStatus[currentUser.id] === 'ATIVO' ? ' Inativar' : ' Ativar'} {/* Texto mais claro */}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Excluir */}
      {modalState === "delete" && currentUser && ( // Adicionado currentUser check
        <div className="modal-overlay" onClick={backToActions}> {/* Clicar fora volta para ações */}
          <div className="modal-content modal-delete-confirm" onClick={(e) => e.stopPropagation()}>
            <h2>Tem certeza que deseja excluir {currentUser.nome}?</h2>
            <p>Esta ação não pode ser desfeita.</p> {/* Mensagem mais direta */}
             <div className="modal-delete-buttons"> {/* Container para botões */}
                <button onClick={backToActions} className="modal-btn btn-cancel"> {/* Botão Cancelar */}
                    Cancelar
                </button>
                <button onClick={handleDeleteUser} className="modal-btn btn-delete-confirm" id="confirmDeleteBtn">
                    Excluir
                </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {modalState === "edit" && currentUser && ( // Adicionado currentUser check
        <div className="modal-overlay" onClick={backToActions}> {/* Clicar fora volta para ações */}
          <div className="modal-content modal-edit-form" onClick={(e) => e.stopPropagation()}>
             <h2>Editar Utilizador</h2> {/* Título para o modal */}
            <form onSubmit={handleEditUser}>
              <div className="form-group">
                <label htmlFor="editNome">User</label>
                <input
                  type="text"
                  id="editNome"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  required // Campo obrigatório
                />
              </div>
              <div className="form-group">
                <label htmlFor="editCargo">Cargo</label>
                <select 
                  id="editCargo" 
                  value={editCargo} 
                  onChange={(e) => setEditCargo(e.target.value)}
                  required // Campo obrigatório
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="form-actions">
                 <button type="button" onClick={backToActions} className="modal-btn btn-cancel"> {/* Botão Cancelar */}
                    Cancelar
                </button>
                <button type="submit" className="modal-btn btn-edit-confirm">
                  Salvar Edição
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
