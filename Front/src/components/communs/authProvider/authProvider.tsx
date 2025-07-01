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
    isAdmin: boolean;
    isBan: boolean; // Ajout de isBan
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isBan, setIsBan] = useState(false); // Nouvel état pour isBan
    const [isLoading, setIsLoading] = useState(true);

    const handleLogin = () => {
        console.log('Redirection vers /auth/bnet');
        setError(null);
        window.location.href = 'http://localhost:3000/auth/bnet';
    };

    const checkStatus = () => {
        console.log('Vérification du statut...');
        setIsLoading(true);
        axios
            .get('/auth/status', { withCredentials: true })
            .then((response) => {
                console.log('Réponse:', response.data);
                if (response.data.message === 'Connecté') {
                    setUser(response.data.user);
                    setAccessToken(response.data.accessToken);
                    setIsAuthenticated(true);
                    setIsAdmin(response.data.isAdmin || false);
                    setIsBan(response.data.isBan || false); // Récupérer isBan
                    setError(null);
                    if (window.location.pathname === '/connect' && !isLoading) {
                        window.location.href = '/';
                    }
                } else {
                    setUser(null);
                    setAccessToken(null);
                    setIsAuthenticated(false);
                    setIsAdmin(false);
                    setIsBan(false);
                    setError('Utilisateur non connecté. Veuillez vous connecter.');
                }
            })
            .catch((error) => {
                console.error('Erreur checkStatus:', error.response ? error.response.data : error.message);
                setIsAuthenticated(false);
                setIsAdmin(false);
                setIsBan(false);
                setError('Erreur lors de la vérification du statut: ' + (error.response?.data?.message || error.message));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleLogout = () => {
        console.log('Déconnexion...');
        setError(null);
        axios
            .get('/auth/logout', { withCredentials: true })
            .then(() => {
                setUser(null);
                setAccessToken(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
                setIsBan(false);
                window.location.href = '/connect';
            })
            .catch((error) => {
                console.error('Erreur handleLogout:', error.response ? error.response.data : error.message);
                setError('Erreur lors de la déconnexion: ' + (error.response?.data?.message || error.message));
            });
    };

    useEffect(() => {
        checkStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ user, accessToken, isAuthenticated, login: handleLogin, logout: handleLogout, error, isAdmin, isBan }}>
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