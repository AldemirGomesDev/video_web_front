import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import ReactPlayer from "react-player";

import api from '../../services/api';
import { logout } from '../../services/auth';
import './styles.css';

import logoImg from '../../assets/logo.svg'

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(0);

    const history = useHistory();

    const userLoggedId = localStorage.getItem('userLoggedId');
    const userLoggedName = localStorage.getItem('userLoggedName');
    const userLoggedToken = localStorage.getItem('userLoggedToken');

    useEffect(() => {
        api.get(`users/${userLoggedId}/videos/${page}/5`
        ).then(response => {

            setVideos(response.data.videos);
            setPage(response.data.currentPage)
        });
    }, [userLoggedToken]);

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
            alert('Erro ao fazer logout, tente novamente');
        }
    }

    return (
        <div className="home-container">
            {console.log(`paginas: ${page}`)}
            <header>
                <img className="logo" src={logoImg} alt="logo heroes" />
                <span>Bem vindo, {userLoggedName}</span>
                <Link className="button" to="/video/new">
                    Cadastrar novo vídeo
                </Link>
                <button onClick={() => handleLogout()} type="button">
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
                {videos.map(video => (
                    <li key={video.id}>
                        <ReactPlayer className="react-player"
                            url={video.url}
                            controls={true} />

                        <div className="text-video">
                            <strong>{video.name}</strong>
                            <p>Música: Casa do Pai - ft. Daniel Diau. Compositor: Jedson Aguiar</p>
                        </div>

                        <button onClick={() => handleDelete(video.id)} type="button">
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    );
}