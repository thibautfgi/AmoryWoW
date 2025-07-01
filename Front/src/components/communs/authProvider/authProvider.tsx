// src/components/communs/authProvider/authProvider.tsx
import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import axios from '../../../config/axiosConfig';

interface AuthContextType {
    user: string | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Nouvel état de chargement

    const handleLogin = () => {
        console.log('Redirection vers /auth/bnet');
        setError(null); // Réinitialiser l'erreur avant la connexion
        window.location.href = 'http://localhost:3000/auth/bnet';
    };

    const checkStatus = () => {
        console.log('Vérification du statut...');
        setIsLoading(true); // Activer le chargement
        axios
            .get('/auth/status', { withCredentials: true })
            .then((response) => {
                console.log('Réponse:', response.data);
                if (response.data.message === 'Connecté') {
                    setUser(response.data.user);
                    setAccessToken(response.data.accessToken);
                    setIsAuthenticated(true);
                    setError(null);
                    // Rediriger uniquement si on est sur /connect après une connexion réussie
                    if (window.location.pathname === '/connect' && !isLoading) {
                        window.location.href = '/'; // Rediriger vers la page d'accueil
                    }
                } else {
                    setUser(null);
                    setAccessToken(null);
                    setIsAuthenticated(false);
                    setError('Utilisateur non connecté. Veuillez vous connecter.');
                }
            })
            .catch((error) => {
                console.error('Erreur checkStatus:', error.response ? error.response.data : error.message);
                setIsAuthenticated(false);
                setError('Erreur lors de la vérification du statut: ' + (error.response?.data?.message || error.message));
            })
            .finally(() => {
                setIsLoading(false); // Désactiver le chargement après la requête
            });
    };

    const handleLogout = () => {
        console.log('Déconnexion...');
        setError(null); // Réinitialiser l'erreur avant la déconnexion
        axios
            .get('/auth/logout', { withCredentials: true })
            .then(() => {
                setUser(null);
                setAccessToken(null);
                setIsAuthenticated(false);
                window.location.href = '/'; // Rediriger vers / après déconnexion
            })
            .catch((error) => {
                console.error('Erreur handleLogout:', error.response ? error.response.data : error.message);
                setError('Erreur lors de la déconnexion: ' + (error.response?.data?.message || error.message));
            });
    };

    useEffect(() => {
        checkStatus();
    }, []); // Appeler une seule fois au montage

    return (
        <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login: handleLogin, logout: handleLogout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;