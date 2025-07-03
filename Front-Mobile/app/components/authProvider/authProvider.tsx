// src/components/communs/authProvider/authProvider.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axios from '../../../src/config/axiosConfig';
import { Linking, Alert } from 'react-native';


interface AuthContextType {
  user: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  error: string | null;
  isAdmin: boolean;
  isBan: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBan, setIsBan] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Comme on ne peut pas faire de redirection web, on ouvre l’URL Battle.net via Linking
  const login = () => {
    setError(null);
    // Ouvre l'URL dans le navigateur
    Linking.openURL('http://localhost:3000/auth/bnet').catch(() => {
      Alert.alert('Erreur', "Impossible d'ouvrir la page d'authentification.");
    });
  };

  const checkStatus = () => {
    setIsLoading(true);
    axios
      .get('/auth/status', { withCredentials: true })
      .then((response:any) => {
        if (response.data.message === 'Connecté') {
          setUser(response.data.user);
          setAccessToken(response.data.accessToken);
          setIsAuthenticated(true);
          setIsAdmin(response.data.isAdmin || false);
          setIsBan(response.data.isBan || false);
          setError(null);
        } else {
          setUser(null);
          setAccessToken(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsBan(false);
          setError('Utilisateur non connecté. Veuillez vous connecter.');
        }
      })
      .catch((err:any) => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsBan(false);
        setError('Erreur lors de la vérification du statut : ' + (err.response?.data?.message || err.message));
      })
      .finally(() => setIsLoading(false));
  };

  const logout = () => {
    setError(null);
    axios
      .get('/auth/logout', { withCredentials: true })
      .then(() => {
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsBan(false);
      })
      .catch((err:any) => {
        setError('Erreur lors de la déconnexion : ' + (err.response?.data?.message || err.message));
      });
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        login,
        logout,
        error,
        isAdmin,
        isBan,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider');
  }
  return context;
};
