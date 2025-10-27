import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CrudPage.css"; // Certifique-se que este ficheiro existe

import { FaTrash, FaPencilAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";

// Removida a leitura do localStorage daqui

const CrudPage = () => {
    // --- ADICIONADO: Estado para guardar o nome do utilizador ---
    const [userName, setUserName] = useState("Utilizador"); // Inicia com o valor padrão

    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [modalState, setModalState] = useState(null);
    const [userStatus, setUserStatus] = useState({});
    const [editNome, setEditNome] = useState("");
    const [editCargo, setEditCargo] = useState("USER");

    const token = localStorage.getItem("userToken");

     // --- ADICIONADO: useEffect para ler o nome do localStorage ---
    useEffect(() => {
        const nameFromStorage = localStorage.getItem("userName");
        if (nameFromStorage) {
            console.log("[DEBUG CrudPage] Nome lido do localStorage:", nameFromStorage);
            setUserName(nameFromStorage); // Atualiza o estado se encontrar o nome
        } else {
            console.warn("[DEBUG CrudPage] 'userName' não encontrado no localStorage.");
        }
    }, []); // Array vazio significa que corre apenas uma vez, quando o componente monta

    const fetchUsers = async () => {
        // ... (lógica fetchUsers - sem alterações)
        try {
            const response = await axios.get("http://localhost:8080/api/v1/usuario", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const usersData = Array.isArray(response.data) ? response.data : [];
            setUsers(usersData);
            const initialStatus = {};
            usersData.forEach(user => { initialStatus[user.id] = "ATIVO"; });
            setUserStatus(initialStatus);
        } catch (error) { console.error("Erro ao buscar usuários:", error.response || error); setUsers([]); }
    };

    useEffect(() => {
        // ... (lógica useEffect para fetchUsers - sem alterações)
        if (token) {
            fetchUsers();
        } else {
            console.warn("Token não encontrado, não é possível buscar utilizadores.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    // --- LÓGICA DOS MODAIS (sem alterações) ---
    const openActionsModal = (user) => { setCurrentUser(user); setModalState("actions"); };
    const openEditModal = () => { if (!currentUser) return; setEditNome(currentUser.nome || ''); setEditCargo(currentUser.nivelAcesso || "USER"); setModalState("edit"); };
    const openDeleteModal = () => { setModalState("delete"); };
    const closeModal = () => { setModalState(null); setCurrentUser(null); setEditNome(""); setEditCargo("USER"); };
    const backToActions = () => { setEditNome(""); setEditCargo("USER"); setModalState("actions"); };

    // --- AÇÕES DO CRUD (sem alterações) ---
    const handleDeleteUser = async () => { /* ... sua lógica ... */
        if (!currentUser) return;
        try {
            await axios.delete(`http://localhost:8080/api/v1/usuario/${currentUser.id}`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(prevUsers => prevUsers.filter(user => user.id !== currentUser.id));
            setUserStatus(prevStatus => { const newStatus = { ...prevStatus }; delete newStatus[currentUser.id]; return newStatus; });
            setSelectedUserIds(prevSelected => prevSelected.filter(id => id !== currentUser.id));
            closeModal();
        } catch (error) { console.error("Erro ao excluir usuário:", error.response || error); alert("Erro ao excluir usuário."); }
     };
    const handleEditUser = async (e) => { /* ... sua lógica ... */
        e.preventDefault();
        if (!currentUser) return;
        const updatedData = { nome: editNome, nivelAcesso: editCargo };
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/usuario/${currentUser.id}`, updatedData, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(prevUsers => prevUsers.map(user => user.id === currentUser.id ? response.data : user ));
            setCurrentUser(response.data);
            backToActions();
        } catch (error) { console.error("Erro ao editar usuário:", error.response || error); alert("Erro ao editar usuário."); }
    };
    const handleToggleStatus = () => { /* ... sua lógica ... */
        if (!currentUser) return;
        const currentStatus = userStatus[currentUser.id];
        const newStatus = currentStatus === "ATIVO" ? "INATIVO" : "ATIVO";
        setUserStatus({ ...userStatus, [currentUser.id]: newStatus });
        closeModal();
     };

    // --- LÓGICA DOS CHECKBOXES (sem alterações) ---
    const handleSelectUser = (id) => { /* ... sua lógica ... */
        setSelectedUserIds(prevSelected => prevSelected.includes(id) ? prevSelected.filter(userId => userId !== id) : [...prevSelected, id] );
     };
    const handleSelectAll = (e) => { /* ... sua lógica ... */
        if (e.target.checked) { setSelectedUserIds(users.map(user => user.id)); } else { setSelectedUserIds([]); }
     };

    // --- RENDERIZAÇÃO ---
    return (
        <div className="crud-container">
            {/* Sidebar */}
            <nav className="crud-sidebar">
                {/* ... conteúdo da sidebar ... */}
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

            {/* Conteúdo Principal */}
            <main className="crud-main-content">
                <header className="crud-header">
                    <div className="user-profile">
                        <div className="user-avatar"></div>
                        {/* --- ALTERADO: Usa o estado 'userName' --- */}
                        <span>{userName}</span>
                    </div>
                </header>

                <div className="content-body">
                    {/* ... resto do conteúdo body (tabela, etc) ... */}
                     <h1 className="titulousuarios">Usuários</h1>
                    <div className="table-controls">
                        <input type="text" placeholder="Buscar" className="search-bar" />
                    </div>
                    <div className="table-wrapper">
                        <table className="users-table">
                             <thead>
                                <tr>
                                    <th><input type="checkbox" onChange={handleSelectAll} checked={users.length > 0 && selectedUserIds.length === users.length} disabled={users.length === 0} /></th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Data de Criação</th>
                                    <th>Status</th>
                                    <th>Cargo</th>
                                    <th> </th>
                                </tr>
                            </thead>
                             <tbody>
                                {!users || users.length === 0 ? (
                                    <tr><td colSpan="7" style={{ textAlign: 'center' }}>Nenhum usuário encontrado ou erro ao carregar.</td></tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td><input type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={() => handleSelectUser(user.id)}/></td>
                                            <td>{user.nome || 'N/A'}</td>
                                            <td>{user.email || 'N/A'}</td>
                                            <td>{user.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString() : 'N/A'}</td>
                                            <td><span className={`status ${userStatus[user.id] === 'ATIVO' ? 'status-ativo' : 'status-inativo'}`}>{userStatus[user.id] || 'N/A'}</span></td>
                                            <td>{user.nivelAcesso || 'N/A'}</td>
                                            <td><button className="action-button" onClick={() => openActionsModal(user)}><HiDotsVertical size={20} /></button></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- MODAIS (sem alterações) --- */}
            {modalState === "actions" && currentUser && ( /* ... modal actions ... */
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content modal-actions-menu" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-btn btn-delete" onClick={openDeleteModal}><FaTrash /> Excluir</button>
                        <button className="modal-btn btn-edit" onClick={openEditModal}><FaPencilAlt /> Editar</button>
                        <button className={`modal-btn btn-status ${userStatus[currentUser.id] === 'ATIVO' ? 'btn-status-inativo' : 'btn-status-ativo'}`} onClick={handleToggleStatus}>
                            {userStatus[currentUser.id] === 'ATIVO' ? <FaToggleOn /> : <FaToggleOff />}
                            {userStatus[currentUser.id] === 'ATIVO' ? ' Inativar' : ' Ativar'}
                        </button>
                    </div>
                </div>
             )}
            {modalState === "delete" && currentUser && ( /* ... modal delete ... */
                 <div className="modal-overlay" onClick={backToActions}>
                    <div className="modal-content modal-delete-confirm" onClick={(e) => e.stopPropagation()}>
                        <h2>Tem certeza que deseja excluir {currentUser.nome}?</h2>
                        <p>Esta ação não pode ser desfeita.</p>
                        <div className="modal-delete-buttons">
                            <button type="button" onClick={backToActions} className="modal-btn btn-cancel">Cancelar</button>
                            <button onClick={handleDeleteUser} className="modal-btn btn-delete-confirm" id="confirmDeleteBtn">Excluir</button>
                        </div>
                    </div>
                </div>
             )}
            {modalState === "edit" && currentUser && ( /* ... modal edit ... */
                <div className="modal-overlay" onClick={backToActions}>
                    <div className="modal-content modal-edit-form" onClick={(e) => e.stopPropagation()}>
                        <h2>Editar Utilizador</h2>
                        <form onSubmit={handleEditUser}>
                            <div className="form-group">
                                <label htmlFor="editNome">User</label>
                                <input type="text" id="editNome" value={editNome} onChange={(e) => setEditNome(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="editCargo">Cargo</label>
                                <select id="editCargo" value={editCargo} onChange={(e) => setEditCargo(e.target.value)} required>
                                    <option value="USER">Usuario</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={backToActions} className="modal-btn btn-cancel">Cancelar</button>
                                <button type="submit" className="modal-btn btn-edit-confirm">Salvar Edição</button>
                            </div>
                        </form>
                    </div>
                </div>
             )}
        </div>
    );
};

export default CrudPage;