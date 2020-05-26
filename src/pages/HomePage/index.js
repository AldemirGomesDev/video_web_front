import React, { useState, useEffect, useRef } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2, FiSearch } from 'react-icons/fi';
import ReactPlayer from "react-player";
import Modal from 'react-bootstrap/Modal';

import api from '../../services/api';
import { logout } from '../../services/auth';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [id, setId] = useState(0);
    const [search, setSearch] = useState('');

    const [titleModal, setTitleModal] = useState('');
    const [descriptionModal, setDescriptionModal] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const scrollObserve = useRef();
    const [scrollRadio, setScrollRadio] = useState(null);
    const [isFinish, setIsFinish] = useState(false);

    const [show, setShow] = useState(false);
    const [logoutModalShow, setLogoutModalShow] = useState(false);
    const [isLoading, setLoading] = useState(false);

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

    const handleClose = () => {
        setShow(false)
        if (isSuccess)
            handleDelete(id);
    };
    const handleCancel = () => {
        setShow(false)
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
        console.log(`search---------------------------`);
        setLoading(true);
        setIsFinish(false);
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

    return (
        <div className="home-container">
            <header>
                <img className="logo" src={logoImg} alt="logo heroes" />
                <span>Bem vindo, {userLoggedName}</span>
                <Link className="button" to="/video/new">
                    Cadastrar novo vídeo
                </Link>
                <button onClick={() => handleLogoutShow("Alerta", "Deseja realmente sair?")} type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Vídeos disponíveis</h1>

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
                            <p>{video.description}</p>
                        </div>

                        <button onClick={() => handleShow("Aviso", "Deseja realmente apagar esse vídeo?", video.id)} type="button">
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

            <Modal show={show} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleModal}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{descriptionModal}</p>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={handleCancel} className="btn btn-secondary">Cancelar</button>
                    <button onClick={handleClose} className="btn btn-danger">OK</button>
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