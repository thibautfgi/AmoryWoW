import { useState, useEffect } from 'react';
import axios from '../../../config/axiosConfig';
import './connect.css';
import { Outlet } from 'react-router';

const Connect = () => {
    const [status, setStatus] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const handleLogin = () => {
        console.log('Redirection vers /auth/bnet');
        window.location.href = 'http://localhost:3000/auth/bnet';
    };

    const checkStatus = () => {
        console.log('Vérification du statut...');
        axios
            .get('/auth/status')
            .then((response) => {
                console.log('Réponse:', response.data);
                setStatus(response.data.message);
                if (response.data.message === 'Connecté') {
                    setUser(response.data.user);
                    setAccessToken(response.data.accessToken);
                    setError(null);
                } else {
                    setUser(null);
                    setAccessToken(null);
                    setError('Utilisateur non connecté. Veuillez vous connecter.');
                }
            })
            .catch((error) => {
                console.error('Erreur checkStatus:', error.response ? error.response.data : error.message);
                setStatus('Erreur lors de la vérification du statut: ' + (error.response?.data?.message || error.message));
                setError('Erreur lors de la vérification du statut.');
            });
    };

    const handleLogout = () => {
        console.log('Déconnexion...');
        axios
            .get('/auth/logout')
            .then(() => {
                setStatus('Déconnecté');
                setUser(null);
                setAccessToken(null);
                setError(null);
            })
            .catch((error) => {
                console.error('Erreur handleLogout:', error.response ? error.response.data : error.message);
                setStatus('Erreur lors de la déconnexion: ' + (error.response?.data?.message || error.message));
                setError('Erreur lors de la déconnexion.');
            });
    };

    useEffect(() => {
        checkStatus();
    }, []);

    return (
        <div className="connect-container">


        <div className="connect-content">
            <h1>Connexion</h1>
            <div style={{ marginBottom: '10px' }}>
                {!user && (
                    <button className="recover-button" onClick={handleLogin}>
                        Se connecter
                    </button>
                )}
                {user && (
                    <button className="recover-button" onClick={handleLogout} style={{ marginLeft: '10px' }}>
                        Se déconnecter
                    </button>
                )}
            </div>
            {status && <p>Statut : {status}</p>}
            {user && (
                <div>
                    <p>Utilisateur : {user}</p>
                    <p>Token d'accès : {accessToken}</p>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
        </div>
        </div>
    );
};

export default Connect;