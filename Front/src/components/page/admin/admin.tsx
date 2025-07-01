// src/components/page/admin/Admin.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../communs/authProvider/authProvider'; // Ajustez le chemin
import axios from 'axios';
import './admin.css'; // Créez ce fichier CSS

const API_BASE_URL = 'http://localhost:3000/api/wow';

function Admin() {
    const { isAuthenticated, isAdmin } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            setError("Accès admin requis. Vous n'êtes pas autorisé à voir cette page.");
            setLoading(false);
            return; // Le Guard gère la redirection, mais on affiche l'erreur ici aussi
        }

        axios
            .get(`${API_BASE_URL}/users`, { withCredentials: true })
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || 'Erreur lors du chargement des utilisateurs');
                setLoading(false);
            });
    }, [isAuthenticated, isAdmin]);

    const toggleBan = (id_user: string, currentBanStatus: boolean) => {
        axios
            .put(
                `${API_BASE_URL}/users/${id_user}`,
                { isBan: !currentBanStatus },
                { withCredentials: true }
            )
            .then((response) => {
                setUsers(users.map(user =>
                    user.id_user === id_user ? { ...user, isBan: !currentBanStatus } : user
                ));
            })
            .catch((err) => {
                setError(err.response?.data?.error || 'Erreur lors de la mise à jour du ban');
            });
    };

    const getInventoryCount = async (id_user: string): Promise<number> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/inventory/${id_user}`, { withCredentials: true });
            return Array.isArray(response.data) ? response.data.length : 0;
        } catch (err) {
            console.error(`Erreur lors du comptage de l'inventaire pour ${id_user}:`, err);
            return 0;
        }
    };

    const [inventoryCounts, setInventoryCounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const fetchInventoryCounts = async () => {
            const counts = {};
            for (const user of users) {
                counts[user.id_user] = await getInventoryCount(user.id_user);
            }
            setInventoryCounts(counts);
        };
        if (users.length > 0) fetchInventoryCounts();
    }, [users]);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div style={{ color: 'red' }}>Erreur : {error}</div>;

    return (
        <div className="admin-container">
            <h4>Page Admin</h4>
            <table className="user-table">
                <thead>
                <tr>
                    <th>ID Utilisateur</th>
                    <th>Nom</th>
                    <th>Statut Ban</th>
                    <th>Nombre d'Items</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id_user}>
                        <td data-label="ID Utilisateur">{user.id_user}</td>
                        <td data-label="Nom">{user.blizzardAccountName}</td>
                        <td data-label="Statut Ban">
                            <button
                                className={`ban-button ${user.isBan ? 'red' : 'green'}`}
                                onClick={() => toggleBan(user.id_user, user.isBan)}
                            >
                                {user.isBan ? 'Débannir' : 'Bannir'}
                            </button>
                        </td>
                        <td data-label="Nombre d'Items">{inventoryCounts[user.id_user] || 0}</td>
                    </tr>
                ))}
                </tbody>

            </table>
        </div>
    );
}

export default Admin;