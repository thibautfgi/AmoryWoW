import { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import { Outlet, useNavigate } from 'react-router-dom';

const Guard = () => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Ajout de l'état de chargement
    const navigate = useNavigate();

    const checkStatus = () => {
        setIsLoading(true); // Réinitialise le chargement
        axios
            .get('/auth/status')
            .then((response) => {
                console.log('Réponse API /auth/status:', response.data);
                setStatus(response.data.message);
                if (response.data.message === 'Connecté') {
                    setUser(response.data.user || 'Utilisateur Connecté');
                    setError(null);
                } else {
                    setUser(null);
                    setError('Utilisateur non connecté.');
                }
            })
            .catch((error) => {
                console.error('Erreur checkStatus dans Guard:', error.response ? error.response.data : error.message);
                setStatus('Erreur lors de la vérification du statut');
                setError('Erreur lors de la vérification du statut.');
                setUser(null);
            })
            .then(() => {
                console.log('Chargement terminé, isLoading mis à false');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        checkStatus();
    }, []);

    useEffect(() => {
        if (!isLoading && !user && error) {
            console.log('Redirection vers / car non connecté');
            navigate('/', { replace: true });
        }
    }, [isLoading, user, error, navigate]);

    if (isLoading) return <div>Chargement de l'authentification...</div>;

    return user ? <Outlet /> : null; // Rend uniquement si connecté
};

export default Guard;