// src/components/communs/connect/Connect.tsx
import { useAuth } from '../authProvider/authProvider'; // Ajustez le chemin
import './connect.css';

function Connect() {
    const { isAuthenticated, user, login, logout, error } = useAuth();

    return (
        <div className="connect-container">
            <div className="connect-content">
                <div style={{ marginBottom: '10px' }}>
                    {!isAuthenticated && (
                        <button className="recover-button" onClick={login} disabled={false}> {/* Désactiver pendant le chargement si nécessaire */}
                            Se connecter
                        </button>
                    )}
                    {isAuthenticated && (
                        <button className="recover-button" onClick={logout} style={{ marginLeft: '10px' }}>
                            Se déconnecter
                        </button>
                    )}
                </div>
                {isAuthenticated && (
                    <div>
                        <p>Utilisateur : {user}</p>
                        {/* <p>Token d'accès : {accessToken}</p> Optionnel, pour débogage */}
                    </div>
                )}
                {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
            </div>
        </div>
    );
}

export default Connect;