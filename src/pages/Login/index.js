import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Login() {
    return (
        <div className="logon-container">
            <section className="form">
                <img className="logo" src={logoImg} alt="logo heroes" />

                <form>
                    <h1>Faça seu Login</h1>
                    <input placeholder="Seu Usuário" />
                    <input type="password" placeholder="Sua Senha" />
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