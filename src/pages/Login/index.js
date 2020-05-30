import React, { useState, useEffect } from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useAlert } from "react-alert";

import api from '../../services/api';
import User from '../../models/User';
import Admin from '../../models/Admin';
import { isAuthenticated } from '../../services/auth';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Login() {

    const alert = useAlert();

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
    const handleShow = (title, description, logado) => {
        
        if(logado) {
            alert.success(description);
            history.push('/home');
        }else {
            alert.error(description);
        }
        setLoading(false);
    };

    useEffect(() => {
        if(isAuthenticated()){
            history.push('/home');
        }
    }, [])


    const history = useHistory();

    async function handleAuthenticate(e) {
        e.preventDefault();

        const data = {
            email,
            password,
            islogged,
        };

        const user = new User('', email, password, islogged)
        const admin = new Admin('', email, password, islogged, '123456789')

        try {
            if (email === "" || password === "" || email === null) {
                console.log("STATUS 000")
                setIsSuccess(false);
                handleShow("Alerta", "Campos obrigatórios vazios", false);
                return

            }
            setLoading(true);
            
            const response = await api.post('users/authenticate', admin);
          
            if(response.status  === 200) {
                setDescriptionModal(response.data.message)
                setIsSuccess(true)
                localStorage.setItem('userLoggedId', response.data.userLogado.id);
                localStorage.setItem('userLoggedName', response.data.userLogado.name);
                localStorage.setItem('userLoggedEmail', response.data.userLogado.email);
                localStorage.setItem('userLoggedIsAdmin', response.data.userLogado.isadmin);
                localStorage.setItem('userLoggedToken', response.data.token);
                localStorage.setItem('userLoggedPassword', password);
                handleShow("Aviso", `${response.data.message}`, true);
            }

        } catch (error) {
            setDescriptionModal("E-mail ou senha incorreto");
            setIsSuccess(false);
            handleShow("Aviso", "E-mail ou senha incorreto!", false);
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