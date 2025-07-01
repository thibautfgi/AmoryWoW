// src/guard/guard.tsx
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/communs/authProvider/authProvider'; // Ajustez le chemin

const Guard = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            console.log('Utilisateur non authentifié, redirection vers /connect');
            navigate('/', { state: { from: location }, replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    return isAuthenticated ? <Outlet /> : null; // Rend uniquement si connecté
};

export default Guard;