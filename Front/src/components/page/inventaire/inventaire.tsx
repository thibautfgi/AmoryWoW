import { JSX, useState, useEffect } from 'react';
import './inventaire.css';
import { apiGetItemById, apiGetItemMediaById } from '../../communs/service/apiService';
import {getBorderColor, getFrenchTranslation} from "../armurerie/service/tools.service"; // Adjust path if needed


function Inventaire(): JSX.Element {
    const [items, setItems] = useState<{ id: number, data: any, media: any }[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/wow/inventory', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch inventory');
                const itemIds = await response.json();

                const itemPromises = itemIds.map((id: number) =>
                    new Promise<{ id: number, data: any, media: any }>(resolve => {
                        apiGetItemById(id, (itemData, itemError) => {
                            if (itemError) {
                                console.error(`Error fetching item ${id}:`, itemError);
                                resolve({ id, data: null, media: null });
                            } else {
                                console.log(`Item ${id} data (name check):`, itemData.name, 'type:', typeof itemData.name);
                                apiGetItemMediaById(id, (mediaData, mediaError) => {
                                    if (mediaError) {
                                        console.error(`Error fetching media for item ${id}:`, mediaError);
                                        resolve({ id, data: itemData, media: null });
                                    } else {
                                        resolve({ id, data: itemData, media: mediaData });
                                    }
                                });
                            }
                        });
                    })
                );

                const fetchedItems = await Promise.all(itemPromises);
                setItems(fetchedItems.filter(item => item.data && item.media));
            } catch (error) {
                setErrorMessage(`Erreur : ${error.message || 'Échec du chargement de l\'inventaire'}`);
                console.error('Failed to load inventory:', error);
            }
        };

        fetchItems();
    }, []);

    const handleDeleteItem = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/wow/item/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete item');
            setItems(items.filter(item => item.id !== id));
            console.log(`Item ${id} deleted successfully`);
        } catch (error) {
            setErrorMessage(`Erreur : ${error.message || 'Échec de la suppression de l\'item'}`);
            console.error('Failed to delete item:', error);
        }
    };

    return (
        <div className="inventory-container">
            <h1 className="inventory-title">Inventaire</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <div className="items-list">
                {items.map(({ id, data, media }) => (
                    <div key={id} className="item-details">
                        {media && media.assets && media.assets[0] && (
                            <div className="item-image">
                                <img
                                    src={media.assets[0].value}
                                    alt={`${getFrenchTranslation(data.name)} Icon`}
                                    style={{ width: '35px', height: '35px', borderRadius: '5px', border: `2px solid ${getBorderColor(data.quality.type)}` }}
                                />
                            </div>
                        )}
                        <h2 style={{ color: getBorderColor(data.quality.type) }}>
                            {getFrenchTranslation(data.name) || `ID ${id} (nom inconnu)`}
                        </h2>
                        <button
                            className="delete-button"
                            onClick={() => handleDeleteItem(id)}
                            style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#FF4444', color: '#FFFFFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>
            {items.length === 0 && !errorMessage && <p>Aucun item dans l'inventaire.</p>}
        </div>
    );
}

export default Inventaire;