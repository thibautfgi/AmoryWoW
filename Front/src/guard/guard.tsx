// src/guard/guard.tsx
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/communs/authProvider/authProvider'; // Ajustez le chemin

// Guard général pour les routes nécessitant une authentification
export const Guard = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            console.log('Utilisateur non authentifié, redirection vers /connect');
            navigate('/connect', { state: { from: location }, replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    return isAuthenticated ? <Outlet /> : null;
};

// Guard spécifique pour les admins
export const AdminGuard = () => {
    const { isAuthenticated, isAdmin } = useAuth(); // Supposons que isAdmin soit ajouté au contexte
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            console.log('Utilisateur non authentifié, redirection vers /');
            navigate('/', { state: { from: location }, replace: true });
        } else if (!isAdmin) {
            console.log('Accès refusé : utilisateur non admin, redirection vers /');
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, isAdmin, navigate, location]);

    return isAuthenticated && isAdmin ? <Outlet /> : null;
};