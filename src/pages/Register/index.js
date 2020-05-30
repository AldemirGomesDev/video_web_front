import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

import api from '../../services/api';
import User from '../../models/User';
import Admin from '../../models/Admin';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [islogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [registration, setRegistration] = useState();

    const [isLoading, setLoading] = useState(false);

    const [titleModal, setTitleModal] = useState('');
    const [descriptionModal, setDescriptionModal] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false)
        setLoading(false);
        if (isSuccess)
            history.push('/');
    };
    const handleShow = (title, description) => {
        setTitleModal(title)
        setDescriptionModal(description)
        setShow(true)
    };

    function handleInputChange(event) {
        const target = event.target;
        const value = target.name === 'isadmin' ? target.checked : target.value;
        setIsAdmin(value)
      }

    const history = useHistory();

    async function handleRegister(e) {
        e.preventDefault();

        let data = {}
        const user = new User(name, email, password, islogged, isAdmin);
        const admin = new Admin(name, email, password, islogged, isAdmin, registration);

        if(isAdmin) {
            data = admin
        }else {
            data = user
        }

        try {
            if (name == "" || email == "" || password == "") {
                setIsSuccess(false);
                handleShow("Alerta", "Campos obrigatórios vazios");
                return

            }
            setLoading(true);
            const response = await api.post('users', data);

            setIsSuccess(true);
            handleShow("Aviso", `${response.data.message}`);


        } catch (error) {
            setIsSuccess(false);
            handleShow("Aviso", "Erro no cadastro, tente novamente.");
        }
    }
    return (
        <div className="register-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="logo video" />

                    <h1>Faça seu Cadastro</h1>

                </section>

                <form onSubmit={handleRegister}>
                    <input
                        placeholder="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <label>
                        Administrador:
                        </label>
                    <input
                        name="isadmin"
                        type="checkbox"
                        checked={isAdmin}
                        onChange={e => handleInputChange(e)} />

                    {isAdmin ?
                        <input
                            placeholder="Matrícula"
                            value={registration}
                            onChange={e => setRegistration(e.target.value)}
                        /> : ''
                    }

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
                    <Link className="back-link" to="/">
                        <FiArrowLeft size={16} color="#E02041" />
                        Voltar para o Login
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