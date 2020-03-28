import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Register() {
    return (
        <div className="register-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="logo video" />

                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro, entre na plataforma e cadastre seus vídeos</p>

                    <Link className="back-link" to="/">
                        <FiArrowLeft size={16} color="#E02041" />
                        Voltar para o Login
                    </Link>
                </section>

                <form>
                    <input placeholder="Nome" />
                    <input type="email" placeholder="E-mail" />
                    <input type="password" placeholder="Senha" />

                    <button className="button" type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
}