import React, { useState, useEffect, useRef } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2, FiSearch, FiEdit } from 'react-icons/fi';
import ReactPlayer from "react-player";
import Modal from 'react-bootstrap/Modal';

import api from '../../services/api';
import { logout } from '../../services/auth';
import User from '../../models/User';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [id, setId] = useState(0);
    const [search, setSearch] = useState('');
    const [idUser, setUserId] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);
    const scrollObserve = useRef();
    const [scrollRadio, setScrollRadio] = useState(null);
    const [isFinish, setIsFinish] = useState(false);
    
    const [show, setShow] = useState(false);
    const [titleModal, setTitleModal] = useState('');
    const [descriptionModal, setDescriptionModal] = useState('');
    const [showModalUser, setShowModalUser] = useState(false);
    const [logoutModalShow, setLogoutModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [modalProfileShow, setModalProfileShow] = useState(false);

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

    const handleDeleteShow = (title, description) => {
        setTitleModal(title)
        setDescriptionModal(description)
        setDeleteModalShow(true)
    };

    const handleDeleteClose = () => {
        setDeleteModalShow(false)
    };

    const handleDeleteOk = () => {
        handleDeleteClose();
        handleDelete(id);
    };

    const handleProfileShow = () => {
        setModalProfileShow(true)
    }

    const ProfileModalClose = () => {
        setModalProfileShow(false)
    }

    const handleClose = () => {
        setShow(false)
        setShowModalUser(false)
        if (isSuccess)
            handleDelete(id);
    };

    const handleCloseModalUser = () => {
        setShowModalUser(false)
        setIsSuccess(false)
        setLoading(false);
    };

    const handleCancel = () => {
        setShow(false)
        setShowModalUser(false)
    };
    const handleShow = (title, description, video_id) => {
        setTitleModal(title)
        setDescriptionModal(description)
        setId(video_id);
        setShow(true)
        if (video_id !== 0) {
            setIsSuccess(true);
        } else {
            setIsSuccess(false);
        }
    };

    const handleShowModalUser = (title, description) => {
        setTitleModal(title)
        setDescriptionModal(description)
        setShowModalUser(true)
        setIsSuccess(true);
      
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);

        const name = `${search}`;

        api.get(`users/${userLoggedId}/search/0/5`, {
            params: {
                name: name
            }
        }).then(response => {
            console.log(`quantidade ${response.data.page}`);
            setVideos(response.data.videos);
            setLoading(false);
            setIsFinish(true);
        });
    };

    const history = useHistory();

    const userLoggedId = localStorage.getItem('userLoggedId');
    const userLoggedName = localStorage.getItem('userLoggedName');
    const userLoggedToken = localStorage.getItem('userLoggedToken');

    useEffect(() => {
        setLoading(true);
        setIsFinish(false);
        setUserId(localStorage.getItem('userLoggedId'))
        setName(localStorage.getItem('userLoggedName'));
        setEmail(localStorage.getItem('userLoggedEmail'));
        setIsAdmin(localStorage.getItem('userLoggedIsAdmin'));
        intersectionOberver.observe(scrollObserve.current);

        api.get(`users/${userLoggedId}/videos/${currentPage}/5`
        ).then(response => {

            setPage(response.data.page);
            setVideos(response.data.videos);
            setCurrentPage(response.data.currentPage);
            setLoading(false);
        });
        return () => {
            intersectionOberver.disconnect();
        }
    }, [userLoggedToken]);

    useEffect(() => {
        console.log(`search: ${search}`);
        if (scrollRadio > 0 && videos != "" && !isFinish) {
            setLoading(true);
            api.get(`users/${userLoggedId}/videos/${currentPage}/5`
            ).then(response => {
                const novosVideos = [...videos];
                novosVideos.push(...response.data.videos);
                setVideos(novosVideos);
                setCurrentPage(response.data.currentPage);
                setLoading(false);

                if (response.data.videos == '' || response.data.videos == null) {
                    setIsFinish(true);
                    console.log('finalizou a busca')
                }
            });
        }
    }, [currentPage, isFinish, scrollRadio, search, userLoggedId, videos]);

    const intersectionOberver = new IntersectionObserver((entries) => {
        const radio = entries[0].intersectionRatio;
        setScrollRadio(radio);
    });

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

    function handleLogout() {
        try {
            console.log("fazendo logout");
            logout()
            history.push('/')

        } catch (err) {
            alert('Erro ao fazer logout, tente novamente');
        }
    }

    async function handleDelete(id) {
        try {
            await api.delete(`/users/${id}/videos`);

            setVideos(videos.filter(video => video.id !== id));

        } catch (err) {
            setIsSuccess(false);
            handleShow("Alerta", "Erro ao apagar vídeo!", 0);
        }
    }

    async function handleEdit(id) {
        history.push(`/video/${id}`)
    }

    return (
        <div className="home-container">
            <header>
                <img className="logo" src={logoImg} alt="logo heroes" />
                <span>Bem vindo(a), <br/> {userLoggedName}</span>
                <button className="botton-profile" onClick={() => handleProfileShow()} type="button">
                    <FiEdit size={20} color="#a8a8b3" />
                </button>
                <Link className="button" to="/video/0">
                    Cadastrar vídeo
                </Link>
                {isAdmin === 'true' ?
                    <Link className="button-user" to="/user">
                        Usuários
                    </Link> : ''
                }
                <button className="button-logout" onClick={() => handleLogoutShow("Alerta", "Deseja realmente sair?")} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>
            <h2>Vídeos disponíveis</h2>

            <form onSubmit={handleSearch} className="form-search">
                <input
                    className="input-search"
                    type="text"
                    placeholder="Procurar"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <button type="submit">
                    <FiSearch size={24} color="#333333" />
                </button>

            </form>

            <ul>
                {videos.map(video => (
                    <li key={video.id}>
                        <ReactPlayer className="react-player"
                            url={video.url}
                            controls={true} />

                        <div className="text-video">
                            <strong>{video.name}</strong>
                            <span>{video.description}</span>
                        </div>

                        <button className="button-edit" onClick={() => handleEdit(video.id)} type="button">
                            <FiEdit size={20} color="#a8a8b3" />
                        </button>

                        <button className="button-delete" onClick={() => handleDeleteShow("Aviso", "Deseja realmente apagar esse vídeo?", video.id)} type="button">
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
            <div ref={scrollObserve}></div>

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

            <Modal show={show} onHide={handleCancel}>
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

        </div >
    );
}