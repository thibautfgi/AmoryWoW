import { useState, useEffect, JSX } from 'react';
import { searchItems } from '../../../communs/service/apiService';
import { apiGetItemMediaById } from '../../../communs/service/apiService'; // Ajuster le chemin si nécessaire
import { Link } from 'react-router-dom';
import './item-search.css';
import { LocalizedString, ItemQuality, ItemSearchResult } from '../interface/item-search.interface';
import { getBorderColor, getItemClass, getFrenchTranslation } from "../service/tools.service";

const searchItemsCallback = (
    searchTerm: string,
    callback: (allData: ItemSearchResult[] | null, error: string | null) => void
): void => {
    console.log(`🔍 Recherche complète avec "${searchTerm}"`);

    const encodedSearchTerm = searchTerm.replace(/ /g, '%20');

    const searchParams = {
        name: encodedSearchTerm,
        _page: 1,
        _pageSize: 50,
        orderby: 'name.fr_FR:asc',
    };
    console.log('Paramètres envoyés à searchItems:', searchParams);

    searchItems(searchParams).then((response) => {
        console.log('Réponse reçue de searchItems:', response);
        if (response.results?.length > 0) {
            console.log('✅ Résultats trouvés côté API avec filtre name.fr_FR:', response.results);
            callback(response.results, null);
        } else {
            console.warn('⚠️ Aucun résultat avec nom.fr_FR, fallback sans filtre');

            searchItems({
                name: encodedSearchTerm,
                _page: 1,
                _pageSize: 50,
                orderby: 'name.fr_FR:asc',
            })
                .then((fallbackResponse) => {
                    const all = fallbackResponse.results || [];
                    const filtered = all.filter((item) =>
                        getFrenchTranslation(item.data.name).toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    console.log('🎯 Résultats après fallback local:', filtered);
                    callback(filtered.length ? filtered : null, filtered.length ? null : 'Aucun filtre dispo');
                })
                .catch((error) => {
                    console.error('❌ Erreur fallback:', error);
                    callback(null, error);
                });
        }
    })
        .catch((error) => {
            console.error('❌ Erreur requête principale:', error);
            callback(null, error);
        });
};




function ItemSearch({ onItemSelect }: { onItemSelect: (itemWithMedia: { item: any, media: any }) => void }): JSX.Element {
    const [searchTerm, setSearchTerm] = useState('');
    const [allResults, setAllResults] = useState<ItemSearchResult[]>([]);
    const [displayedResults, setDisplayedResults] = useState<{ item: ItemSearchResult, media: any }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const resultsPerPage = 10;

    useEffect(() => {
        let timeoutId: number | undefined;

        if (searchTerm.length >= 3) {
            setIsLoading(true);
            console.log('Recherche déclenchée avec:', searchTerm);
            timeoutId = window.setTimeout(() => {
                searchItemsCallback(searchTerm, (data, err) => {
                    if (err) {
                        setError(err);
                        setAllResults([]);
                        setDisplayedResults([]);
                    } else if (data) {
                        setError(null);
                        setAllResults(data);

                        const fetchMediaPromises = data.map((item) =>
                            new Promise((resolve) => {
                                apiGetItemMediaById(item.data.id, (media, mediaErr) => {
                                    resolve({ item, media: mediaErr ? null : media });
                                });
                            })
                        );
                        Promise.all(fetchMediaPromises).then((results) => {
                            setDisplayedResults(results.slice(0, resultsPerPage) as { item: ItemSearchResult, media: any }[]);
                        });
                    }
                    setIsLoading(false);
                });
            }, 800);
        } else {
            setAllResults([]);
            setDisplayedResults([]);
        }

        return () => {
            if (timeoutId !== undefined) clearTimeout(timeoutId);
        };
    }, [searchTerm]);

    return (
        <div className="container">
            <h1 className="title-search">Recherche d'Items</h1>
            <div className="search-wrapper">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    placeholder="Rechercher un objet..."
                />

                {searchTerm.length >= 3 && (
                    <div className="dropdown">
                        {isLoading && <p className="loading">Chargement...</p>}
                        {!isLoading && error && <p className="error">{error}</p>}
                        {!isLoading && displayedResults.length > 0 && (
                            <ul className="results-list">
                                {displayedResults.map(({ item, media }) => (
                                    <li
                                        key={item.data.id}
                                        className="result-item"
                                        onClick={() => {
                                            onItemSelect({ item, media });
                                            setSearchTerm('');
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {media && media.assets && media.assets[0] && (
                                            <img
                                                src={media.assets[0].value}
                                                alt={`${getFrenchTranslation(item.data.name)} Icon`}
                                                style={{
                                                    border: `2px solid ${getBorderColor(item.data.quality.type)}`,
                                                    borderRadius: '4px',
                                                    verticalAlign: 'middle',
                                                    marginRight: '8px',
                                                    width: '24px',
                                                    height: '24px',
                                                }}
                                            />
                                        )}
                                        {getFrenchTranslation(item.data.name)} <span className="item-id">{getItemClass(item.data.item_class.id)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemSearch;