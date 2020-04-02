import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'
import CircularProgress from '@material-ui/core/CircularProgress';

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function NewVideo() {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescriptionVideo] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [descriptionModal, setDescriptionModal] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
        if (isSuccess)
            history.push('/home');
        setLoading(false);
    };
    const handleShow = (title, description) => {
        setTitleModal(title)
        setDescriptionModal(description)
        setShow(true)
    };

    const history = useHistory();

    const userLoggedId = localStorage.getItem('userLoggedId');

    async function handleRegister(e) {
        e.preventDefault();

        const data = {
            name,
            url,
            description,
        };
        console.log(`data: ${data}`);
        try {

            if (name == "" || url == "" || description == "") {
                setIsSuccess(false);
                handleShow("Alerta", "Campos obrigatórios vazios");
                return

            }
            setLoading(true);
            const response = await api.post(`users/${userLoggedId}/videos`, data);
            setIsSuccess(true);
            handleShow("Alerta", `${response.data.message}`);

        } catch (error) {
            setIsSuccess(false);
            handleShow("Alerta", 'Erro no cadastro, tente novamente' + error);
        }
    }

    return (
        <div className="new-video-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="logo video" />

                    <h1>Cadastrar novo vídeo</h1>

                </section>

                <form onSubmit={handleRegister}>
                    <input
                        placeholder="Título do Vídeo"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        placeholder="URL do Vídeo"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                    <textarea
                        placeholder="Descrição"
                        value={description}
                        onChange={e => setDescriptionVideo(e.target.value)}
                    />

                    <button className="button" type="submit">
                        {isLoading ?
                            <CircularProgress
                                className="circular-progress"
                                color="inherit"
                                disableShrink={false}
                                variant="indeterminate"
                                size={30}
                            /> : `Cadastrar`
                        }
                    </button>
                    <Link className="back-link" to="/home">
                        <FiArrowLeft size={16} color="#E02041" />
                        Voltar para o Home
                    </Link>
                </form>
            </div>
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
    );
}