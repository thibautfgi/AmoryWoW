import { useState, useEffect, JSX } from 'react';
import { apiGetItembyId, apiGetItemMediabyId } from '../../../service/apiService';
import { Link } from 'react-router-dom';

function TestItem(): JSX.Element {
    const [itemId, setItemId] = useState<number>(19019); // ID par défaut (LEGENDAIRE)
    const [itemData, setItemData] = useState<any>(null);
    const [mediaData, setMediaData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiGetItembyId(itemId, (data, err) => {
            if (err) {
                setError(err);
            } else {
                setItemData(data);
                apiGetItemMediabyId(itemId, (media, mediaErr) => {
                    if (mediaErr) {
                        setError(mediaErr);
                    } else {
                        setMediaData(media);
                    }
                });
            }
        });
    }, [itemId]);

    const getBorderColor = (qualityType: string): string => {
        switch (qualityType) {
            case 'LEGENDARY':
                return 'orange';
            case 'EPIC':
                return 'purple';
            case 'RARE':
                return 'blue';
            case 'UNCOMMON':
                return 'green';
            case 'COMMON':
                return 'gray';
            default:
                return 'white';
        }
    };

    if (error) {
        if (error === "Non authentifié") {
            return (
                <div>
                    <p>Vous devez être connecté pour voir cet item.</p>
                </div>
            );
        }
        return <p>Erreur : {error}</p>;
    }

    if (!itemData) return <p>Chargement...</p>;

    return (
        <div>
            <h1>{itemData.name}</h1>
            <p>Qualité : {itemData.quality.name}</p>
            <p>Niveau requis : {itemData.required_level}</p>
            <p>Prix d'achat : {itemData.purchase_price} pièces</p>
            <p>Prix de vente : {itemData.sell_price} pièces</p>
            <p>Type : {itemData.item_class.name} - {itemData.item_subclass.name}</p>
            <p>Durabilité : {itemData.preview_item.durability.display_string}</p>
            {mediaData && mediaData.assets && (
                <div>
                    <h2>Média</h2>
                    <img
                        src={mediaData.assets[0].value}
                        alt="Item Media"
                        style={{
                            border: `5px solid ${getBorderColor(itemData.quality.type)}`,
                            borderRadius: '8px',
                        }}
                    />
                </div>
            )}
            <div style={{ marginTop: '20px' }}>
                <button onClick={() => setItemId(19019)}>Légendaire</button>
                <button onClick={() => setItemId(18609)}>Épique</button>
                <button onClick={() => setItemId(8345)}>Bleu</button>
                <button onClick={() => setItemId(11287)}>Vert</button>
                <button onClick={() => setItemId(5040)}>Blanc</button>
            </div>
        </div>
    );
}

export default TestItem;