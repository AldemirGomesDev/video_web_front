import React from 'react';
import { Link } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import ReactPlayer from "react-player";

import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Home() {
    return (
        <div className="home-container">
            <header>
                <img className="logo" src={logoImg} alt="logo heroes" />
                <span>Bem vindo, Aldemir</span>
                <Link className="button" to="/video/new">
                    Cadastrar novo vídeo
                </Link>
                <button type="button">
                    <FiPower size={18} color="#E02041" />
                </button>
            </header>

            <h1>Vídeos disponíveis</h1>

            <input
                className="input-search"
                type="text"
                placeholder="Procurar"
            />

            <ul>
                <li>
                    <ReactPlayer className="react-player"
                        url="https://www.youtube.com/watch?v=cH9FqbAIhk8&"
                        controls={true} />

                    <div className="text-video">
                        <strong>Banda Som e Louvor - Casa do Pai - ft. Daniel Dial</strong>
                        <p>Música: Casa do Pai - ft. Daniel Diau. Compositor: Jedson Aguiar</p>
                    </div>

                    <button type="button">
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
                <li>
                    <ReactPlayer className="react-player"
                        url="https://www.youtube.com/watch?v=1I-qK88Ir6E"
                        controls={true} />

                    <div className="text-video">
                        <strong>Tua Presença - Banda Som e Louvor</strong>
                        <p>Tua Presença - Banda Som e Louvor</p>
                    </div>

                    <button type="button">
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
                <li>
                    <ReactPlayer className="react-player"
                        url="https://www.youtube.com/watch?v=MJgaMbSMlZw"
                        controls={true} />

                    <div className="text-video">
                        <strong>Irmão Lázaro - Vou Continuar Orando</strong>
                        <p>Vídeo Oficial de "Vou Continuar Orando" de Irmão Lázaro.</p>
                    </div>

                    <button type="button">
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
                <li>
                    <ReactPlayer className="react-player"
                        url="https://www.youtube.com/watch?v=EI4ioW19LkE&"
                        controls={true} />

                    <div className="text-video">
                        <strong>Irmão Lázaro - A Voz do Coração ft. Daniel Pietro</strong>
                        <p>Vídeo Oficial de "A Voz do Coração" de Irmão Lázaro com a participação especial de Daniel Pietro</p>
                    </div>

                    <button type="button">
                        <FiTrash2 size={20} color="#a8a8b3" />
                    </button>
                </li>
            </ul>

        </div>
    );
}