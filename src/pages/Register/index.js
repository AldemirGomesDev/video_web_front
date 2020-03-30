import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [islogged, setIsLogged] = useState(false);

    const history = useHistory();

    async function handleRegister(e) {
        e.preventDefault();

        const data = {
            name,
            email,
            password,
            islogged,
        };

        try {
            if (name == "" || email == "" || password == "") {
                alert('Campos obrigatório vazios!');
                return

            }
            const response = await api.post('users', data);

            alert(`${response.data.message}`);

            history.push('/');

        } catch (error) {
            alert(`Erro no cadastro, tente novamente: ${error}`);
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

                    <button className="button" type="submit">Cadastrar</button>
                    <Link className="back-link" to="/">
                        <FiArrowLeft size={16} color="#E02041" />
                        Voltar para o Login
                    </Link>
                </form>
            </div>
        </div>
    );
}