import { JSX, useState, useEffect } from 'react';
import './armurerie.css';
import ItemSearch from "./item-search/item-search";
import { getFrenchTranslation, getItemClass, getBorderColor } from "./service/tools.service";
import { postItem } from '../../communs/service/apiService';
import { useAuth } from '../../communs/authProvider/authProvider'; // Ajustez le chemin

function Armurerie(): JSX.Element {
    const [selectedItem, setSelectedItem] = useState<{ item: any, media: any } | null>(null);
    const [savedItems, setSavedItems] = useState<number[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        console.log('User from context:', user); // Debug log
    }, [user]);

    const handleItemSelect = (itemWithMedia: { item: any, media: any }) => {
        setSelectedItem(itemWithMedia);
        setErrorMessage(null); // Effacer l'erreur sur nouvelle sélection
        console.log('Selected item:', itemWithMedia); // Debug log
    };

    const handleRecoverItem = async () => {
        console.log('handleRecoverItem called. SelectedItem:', selectedItem); // Debug log
        if (!isAuthenticated) {
            setErrorMessage('Veuillez vous connecter pour sauvegarder un item.');
            return;
        }
        if (selectedItem && selectedItem.item.data.id) {
            try {
                console.log('Attempting to save item ID:', selectedItem.item.data.id); // Debug log
                const response = await postItem(selectedItem.item.data.id);
                setSavedItems(prevItems => prevItems.includes(selectedItem.item.data.id) ? prevItems : [...prevItems, selectedItem.item.data.id]);
                setErrorMessage(null); // Effacer l'erreur en cas de succès
                console.log('Item saved successfully:', response);
            } catch (error) {
                setErrorMessage(`Erreur : ${error.message || 'Échec de la sauvegarde'}`);
                console.error('Failed to save item - Full error:', error); // Log d'erreur détaillé
            }
        } else {
            setErrorMessage('Aucun item sélectionné');
            console.warn('Save failed. SelectedItem:', selectedItem);
        }
    };

    return (
        <div>
            <div className="search-container">
                <ItemSearch onItemSelect={handleItemSelect} />
            </div>
            <div className="armurerie-container">
                {selectedItem ? (
                    <div className="item-details">
                        <div className="item-header">
                            {selectedItem.media && selectedItem.media.assets && selectedItem.media.assets[0] && (
                                <div className="item-image">
                                    <img
                                        src={selectedItem.media.assets[0].value}
                                        alt={getFrenchTranslation(selectedItem.item.data.name)}
                                        style={{ width: '35px', height: '35px', borderRadius: '5px', border: `2px solid ${getBorderColor(selectedItem.item.data.quality.type)}` }}
                                    />
                                </div>
                            )}
                            <h2 style={{ color: getBorderColor(selectedItem.item.data.quality.type) }}>
                                {getFrenchTranslation(selectedItem.item.data.name)}
                            </h2>
                        </div>
                        <p><strong>Qualité :</strong> {getFrenchTranslation(selectedItem.item.data.quality.name)}</p>
                        <p><strong>Niveau requis :</strong> {selectedItem.item.data.required_level || 'N/A'}</p>
                        <p><strong>Prix de vente :</strong> {selectedItem.item.data.sell_price || 'N/A'} pièces</p>
                        <p><strong>Type :</strong> {getItemClass(selectedItem.item.data.item_class.id)}</p>
                        <p><strong>Type d'inventaire :</strong> {getFrenchTranslation(selectedItem.item.data.inventory_type.name) || 'N/A'}</p>
                        <button className="recover-button" onClick={handleRecoverItem}>
                            Récupérer l'item
                        </button>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        {savedItems.length > 0 && (
                            <div>
                                <h3>Items sauvegardés :</h3>
                                <ul>
                                    {savedItems.map(id => (
                                        <li key={id}>{id}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="item-details">
                        <p>Sélectionnez un item dans la recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Armurerie;