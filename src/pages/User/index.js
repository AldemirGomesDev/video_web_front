import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2, FiArrowLeft, FiEdit } from 'react-icons/fi';
import Modal from 'react-bootstrap/Modal';

import api from '../../services/api';
import { logout } from '../../services/auth';
import User from '../../models/User';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Home() {
  const history = useHistory();
  const userLoggedName = localStorage.getItem('userLoggedName');

  const [users, setUsers ] = useState([]);
  const [idUser, setUserId] = useState(0);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [titleModal, setTitleModal] = useState('');
  const [descriptionModal, setDescriptionModal] = useState('');
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [modalProfileShow, setModalProfileShow] = useState(false);
  const [showModalUser, setShowModalUser] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogoutOk = () => {
    setLogoutModalShow(false);
    handleLogout();
};

const handleLogoutClose = () => {
    setLogoutModalShow(false)
};

  const handleLogoutShow = (title, description) => {
    setTitleModal(title)
    setDescriptionModal(description)
    setLogoutModalShow(true)
};

const handleShowModalUser = (title, description) => {
    setTitleModal(title)
    setDescriptionModal(description)
    setShowModalUser(true)
    setIsSuccess(true);
  
};

const handleDeleteShow = (title, description, user_id) => {
    setId(user_id);
    setTitleModal(title)
    setDescriptionModal(description)
    setDeleteModalShow(true)
};

const handleProfileShow = () => {
    setModalProfileShow(true)
}

const ProfileModalClose = () => {
    setModalProfileShow(false)
}
const handleCancel = () => {
    setShowModalUser(false)
};

const handleCloseModalUser = () => {
    setShowModalUser(false)
    setIsSuccess(false)
    setLoading(false);
};

const handleDeleteClose = () => {
    setDeleteModalShow(false)
};

const handleDeleteOk = () => {
    handleDeleteClose();
    handleDeleteUser(id);
};

async function handleLogout() {
  try {
      const user = new User(name, email, password, false)
      logout()
      await api.post(`/users/${idUser}/logout`, user);

      history.push('/')

  } catch (err) {
      alert('Erro ao fazer logout, tente novamente');
  }
}

async function handleUpdate(e) {
    e.preventDefault();

    const user = new User(name, email, password, true)

    try {
        if (name == "" || email == "" || password == "") {
            setIsSuccess(false);
            handleShowModalUser("Alerta", "Campos obrigatórios vazios");
            return
        }

        if(password !== passwordConfirm) {
            setIsSuccess(false);
            handleShowModalUser("Alerta", "As senhas não conferem, tente novamente");
            return
        }
        setLoading(true);
        const response = await api.put(`users/${idUser}`, user);

        setIsSuccess(true);
        setModalProfileShow(false)
        handleShowModalUser("Aviso", `${response.data.message}`);


    } catch (error) {
        setIsSuccess(false);
        handleShowModalUser("Aviso", "Erro ao atualizar, tente novamente.");
    }
}

async function handleDeleteUser(id) {
    try {
        await api.delete(`/users/${id}`);

        setUsers(users.filter(user => user.id !== id));

    } catch (err) {
        // handleShow("Alerta", "Erro ao apagar usuário!", 0);
    }
}

useEffect(() => {
    setLoading(true);
    setIsFinish(false);
    setUserId(localStorage.getItem('userLoggedId'))
    setName(localStorage.getItem('userLoggedName'));
    setEmail(localStorage.getItem('userLoggedEmail'));
    setPassword(localStorage.getItem('userLoggedPassword'));

    api.get(`users/0/5`
    ).then(response => {

      setUsers(response.data.user);
    
      setLoading(false);
    });
 
}, []);

  return (
    <div className="home-container">
      <header>
          <img className="logo" src={logoImg} alt="logo heroes" />
          <span>Bem vindo(a),<br/> {userLoggedName}</span>
          <Link className="button" to="/video/0">
              Cadastrar novo vídeo
          </Link>
          <Link className="back-link" to="/home">
            <FiArrowLeft size={16} color="#E02041" />
            Voltar para o home
        </Link>
          <button className="button-logout" onClick={() => handleLogoutShow("Alerta", "Deseja realmente sair?")} type="button">
              <FiPower size={18} color="#E02041" />
          </button>
      </header>
      <h2>Usuários</h2>

      <ul>
          {users.map(user => (
              <li key={user.id}>
                  <div className="text-video">
                      <strong>Nome: {user.name}</strong>
                      <p>Email: {user.email}</p>
                      <p>{
                        user.islogged ? 'Logado: Sim' : 'Logado: Não'
                      }</p>
                  </div>

                  <button className="button-edit" onClick={() => handleProfileShow()} type="button">
                      <FiEdit size={20} color="#a8a8b3" />
                  </button>

                  <button className="button-delete" onClick={() => handleDeleteShow("Alerta", "Deseja realmente apagar esse usuário?", user.id)} type="button">
                      <FiTrash2 size={20} color="#a8a8b3" />
                  </button>
              </li>
          ))}
          <div className="circular-progress">
              {isLoading ?
                  <CircularProgress
                      color="inherit"
                      disableShrink={false}
                      variant="indeterminate"
                      size={30}
                  /> : ''
              }

          </div>

      </ul>

      <Modal show={modalProfileShow} onHide={ProfileModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Atualizar usuário</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <div className="content">
                    <form onSubmit={handleUpdate} >
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <input
                            placeholder="E-mail"
                            value={email}
                            descriptionModal
                            disabled={true}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            required={true}
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <input
                            required={true}
                            type="password"
                            placeholder="Confirme sua senha"
                            value={passwordConfirm}
                            onChange={e => setPasswordConfirm(e.target.value)}
                        />
                        <div className="bottom-modal">
                            <button 
                            type="reset"
                            onClick={ProfileModalClose} 
                            className="btn btn-secondary">Cancelar</button>
                            <button 
                            type="submit" 
                            className="btn btn-danger"
                            >
                                {isLoading ?
                                    <CircularProgress
                                        className="circular-progress-profile"
                                        color="inherit"
                                        disableShrink={false}
                                        variant="indeterminate"
                                        size={30}
                                    /> : `Atualizar`
                                }
                            </button>
                        </div>
                     
                    </form>
                </div>
                </Modal.Body>
            </Modal>

            <Modal show={showModalUser} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleModal}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{descriptionModal}</p>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={handleCloseModalUser} className="btn btn-danger">OK</button>
                </Modal.Footer>
            </Modal>

      <Modal show={deleteModalShow} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleModal}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{descriptionModal}</p>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={handleDeleteClose} className="btn btn-secondary">Cancelar</button>
                    <button onClick={handleDeleteOk} className="btn btn-danger">OK</button>
                </Modal.Footer>
            </Modal>

      <Modal show={logoutModalShow} onHide={handleLogoutClose}>
          <Modal.Header closeButton>
              <Modal.Title>{titleModal}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <p>{descriptionModal}</p>
          </Modal.Body>

          <Modal.Footer>
              <button onClick={handleLogoutClose} className="btn btn-secondary">Cancelar</button>
              <button onClick={handleLogoutOk} className="btn btn-danger">OK</button>
          </Modal.Footer>
      </Modal>
    </div>
  )
}