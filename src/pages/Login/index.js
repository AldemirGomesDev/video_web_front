import React, { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [islogged, setIsLogged] = useState(true);
    const [isLoading, setLoading] = useState(false);

    const [titleModal, setTitleModal] = useState('');
    const [descriptionModal, setDescriptionModal] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

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


    async function handleAuthenticate(e) {
        e.preventDefault();

        const data = {
            email,
            password,
            islogged,
        };

        try {
            if (email == "" || password == "") {
                setIsSuccess(false);
                handleShow("Alerta", "Campos obrigatórios vazios");
                return

            }
            setLoading(true);
            const response = await api.post('users/authenticate', data);

            localStorage.setItem('userLoggedId', response.data.userLogado.id);
            localStorage.setItem('userLoggedName', response.data.userLogado.name);
            localStorage.setItem('userLoggedToken', response.data.token);
            setIsSuccess(true);
            handleShow("Aviso", `${response.data.message}`);

        } catch (error) {
            setIsSuccess(false);
            handleShow("Aviso", "E-mail ou senha incorreto!");
        }
    }
    return (
        <div className="logon-container">
            <section className="form">
                <img className="logo" src={logoImg} alt="logo heroes" />

                <form onSubmit={handleAuthenticate}>
                    <h1>Faça seu Login</h1>

                    <input
                        placeholder="Seu E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Sua Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="button" type="submit">
                        {isLoading ?
                            <CircularProgress
                                className="circular-progress"
                                color="inherit"
                                disableShrink={false}
                                variant="indeterminate"
                                size={30}
                            /> : `Entrar`
                        }
                    </button>

                    <Link className="back-link" to="/register">
                        <FiLogIn size={16} color="#E02041" />
                        Criar nova conta
                    </Link>
                </form>
            </section>

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