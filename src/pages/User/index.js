import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2, FiArrowLeft, FiEdit } from 'react-icons/fi';
import Modal from 'react-bootstrap/Modal';

import api from '../../services/api';
import { logout } from '../../services/auth';
import User from '../../models/User';
import Admin from '../../models/Admin';
import './styles.css';

import logoImg from '../../assets/logo.png'

export default function Home() {
  const history = useHistory();
  const userLoggedName = localStorage.getItem('userLoggedName');

  if(localStorage.getItem('userLoggedIsAdmin') === "false") {
    history.push('/')
}

  const [users, setUsers ] = useState([]);
  const [idUser, setUserId] = useState(0);
  const [idUserSelected, setUserIdSelected] = useState(0);
  const [nameUserSelected, setNameUserSelected] = useState('');
  const [emailUserSelected, setEmailUserSelected] = useState('');
  const [nameUserLogged, setNameUserLogged] = useState('');
  const [emailUserLogged, setEmailUserLogged] = useState('');
  const [passwordUserLogged, setPasswordUserLogged] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  //validate admin
  const [registration, setRegistration] = useState();
  const [enableInput, setEnableInput] = useState(true);
  const [isValidate, setIsValidate] = useState(false);
  const [validateShow, setValidateShow] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [validateAdmin, setValidateAdmin] = useState('');

  const [titleModal, setTitleModal] = useState('');
  const [descriptionModal, setDescriptionModal] = useState('');
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [modalProfileShow, setModalProfileShow] = useState(false);
  const [showModalUser, setShowModalUser] = useState(false);

  const [isLoading, setLoading] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [show, setShow] = useState(false);

  function handleInputChange(event) {
    setValidateShow(true);
    const target = event.target;
    const value = target.name === 'isadmin' ? target.checked : target.value;
    setIsAdmin(value)
}

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
    setUserIdSelected(user_id);
    setTitleModal(title)
    setDescriptionModal(description)
    setDeleteModalShow(true)
};

const handleProfileShow = () => {
    setModalProfileShow(true)
}

const validateShowClose = () => {
    setValidateShow(false);
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

const handleShow = (title, description) => {
    setTitleModal(title)
    setDescriptionModal(description)
    setShow(true)
};

const handleClose = () => {
    setShow(false)
    setLoading(false);
    if (isSuccess)
        history.push('/');
};

const handleDeleteOk = () => {
    handleDeleteClose();
    handleDeleteUser(idUserSelected);
};

const getUserSelect = async (id) => {
    try {
       const response = await api.get(`/user/${id}`);
  
        if(!response) {
            return
        }
        console.log(`Usuario encontrado ${response.data.user.name}`);
        setNameUserSelected(response.data.user.name);
        setEmailUserSelected(response.data.user.email);
        setUserIdSelected(response.data.user.id);
        setIsValidate(response.data.user.isadmin);
        if(response.data.user.isadmin){
            setRegistration(response.data.user.registration);
            setEnableInput(false);
        }else{
            setRegistration('')
            setEnableInput(true);
        }

        handleProfileShow()
  
    } catch (err) {
        handleLogout()
        alert('Erro ao fazer logout, tente novamente');
    }
}

async function handleLogout() {
  try {
      const user = new User(nameUserLogged, emailUserLogged, passwordUserLogged, false)
      logout()
      await api.post(`/users/${idUser}/logout`, user);

      history.push('/')

  } catch (err) {
      alert('Erro ao fazer logout, tente novamente');
  }
}

async function handleUpdate(e) {
     e.preventDefault();

    let data = {}
    const user = new User(nameUserSelected, emailUserSelected, password, false, isAdmin);
    const admin = new Admin(nameUserSelected, emailUserSelected, password, false, isAdmin, registration);
    
    if(isAdmin) {
        data = admin
    }else {
        data = user
    }
   
    try {
        if (nameUserSelected == "" || emailUserSelected == "" || password == "") {
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
        console.log(`idUserSelected=> ${idUserSelected}`);
        const response = await api.put(`users/${idUserSelected}`, data);
        setPassword('');
        setPasswordConfirm('');

        setUsers(users);

        setIsSuccess(true);
        setModalProfileShow(false)
        handleShowModalUser("Aviso", `${response.data.message}`);


    } catch (error) {
        setIsSuccess(false);
        setPassword('');
        setPasswordConfirm('');
        handleShowModalUser("Aviso", "Erro ao atualizar, tente novamente.");
        handleLogout()
    }
}

async function handleDeleteUser(id) {
    try {
        await api.delete(`/users/${id}`);

        setUsers(users.filter(user => user.id !== id));

    } catch (err) {
        // handleShow("Alerta", "Erro ao apagar usuário!", 0);
        handleLogout()
    }
}

useEffect(() => {
    setLoading(true);
    setIsFinish(false);
    setUserId(localStorage.getItem('userLoggedId'))
    setNameUserLogged(localStorage.getItem('userLoggedName'));
    setEmailUserLogged(localStorage.getItem('userLoggedEmail'));
    setPasswordUserLogged(localStorage.getItem('userLoggedPassword'));
    
    api.get(`users/0/50`
    ).then(response => {
        setLoading(false);

        if(response.status === 200){
            setUsers(response.data.user);
        }else {
            handleLogout()
        }
    }).catch(function(error) {
        setLoading(false);
        handleLogout()
      });
 
}, []);

const handleValidateAdmin = () => {
    try{
        if(!validateAdmin) {
            handleShow('Alerta', 'Digite sua matrícula para continuar!')
            return 
        }
        api.get(`user/admin/${validateAdmin}`)
        .then(response => {
            console.log(`quantidade ${response.status}`);
            if(response.status === 200) {
                if(isAdmin) {
                    setEnableInput(false) 
                    setIsValidate(true)
                }else {
                    setEnableInput(true)
                    setIsValidate(false)
                }
                setValidateShow(false);
                setValidateAdmin('')
                setLoading(false);
            }else {
                setValidateAdmin('')
                handleShow('Alerta', 'Você não tem permissão de Administrador!')
                setLoading(false); 
            }
        }).catch(function(error) {
            setValidateAdmin('')
            handleShow('Alerta', 'Você não tem permissão de Administrador!')
            setLoading(false);
            handleLogout()
          });
    }catch(e){
        handleLogout()
        setLoading(false);
    }
}

  return (
    <div className="user-container">
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
      <div className="user-container-users">
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
                        <p>{
                            user.isadmin ? 'Administrador' : 'Usuário Comum'
                        }</p>
                    </div>

                    <button className="button-edit" onClick={() => getUserSelect(user.id)} type="button">
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
      </div>

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
                            value={nameUserSelected}
                            onChange={e => setNameUserSelected(e.target.value)}
                        />
                        <input
                            placeholder="E-mail"
                            value={emailUserSelected}
                            descriptionModal
                            onChange={e => setEmailUserSelected(e.target.value)}
                        />
                        <div className="checkbox">
                            <label>
                                Administrador:
                            </label>
                            <input
                                name="isadmin"
                                type="checkbox"
                                checked={isValidate}
                                onChange={e => handleInputChange(e)} />
                        </div>
                        <input
                            disabled={enableInput}
                            placeholder="Matrícula"
                            value={registration}
                            onChange={e => setRegistration(e.target.value)}
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
      <Modal show={validateShow} onHide={validateShowClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleModal}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <input
                    className="modal-validate"
                    type="text"
                    placeholder="Matrícula"
                    value={validateAdmin}
                    onChange={e => setValidateAdmin(e.target.value)}
                />
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={handleValidateAdmin} className="btn btn-danger">Validar</button>
                </Modal.Footer>
            </Modal>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleModal}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{descriptionModal}</p>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={handleClose} className="btn btn-danger">OK</button>
                </Modal.Footer>
            </Modal>
    </div>
  )
}