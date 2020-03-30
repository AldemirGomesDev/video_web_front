import React, { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [islogged, setIsLogged] = useState(true);

    const history = useHistory();


    async function handleAuthenticate(e) {
        e.preventDefault();

        const data = {
            email,
            password,
            islogged,
        };

        try {
            const response = await api.post('users/authenticate', data);

            localStorage.setItem('userLoggedId', response.data.userLogado.id);
            localStorage.setItem('userLoggedName', response.data.userLogado.name);
            localStorage.setItem('userLoggedToken', response.data.token);
            alert(`${response.data.message}`);

            history.push('/home');

        } catch (error) {
            alert(`E-mail ou senha incorreto! ${error}`);
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
                    <button className="button" type="submit">Entrar</button>

                    <Link className="back-link" to="/register">
                        <FiLogIn size={16} color="#E02041" />
                        Criar nova conta
                    </Link>
                </form>
            </section>

        </div>
    );
}