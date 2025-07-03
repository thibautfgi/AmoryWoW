import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { searchItems, apiGetItemMediaById } from '../../../../../app/components/service/apiService'; 
import { getBorderColor, getItemClass, getFrenchTranslation } from "../service/tools.service";
import { ItemSearchResult } from '../interface/item-search.interface';

const searchItemsCallback = (
    searchTerm: string,
    callback: (allData: ItemSearchResult[] | null, error: string | null) => void
): void => {
    const encodedSearchTerm = searchTerm.replace(/ /g, '%20');

    const searchParams = {
        name: encodedSearchTerm,
        _page: 1,
        _pageSize: 50,
        orderby: 'name.fr_FR:asc',
    };

    searchItems(searchParams).then((response) => {
        if (response.results?.length > 0) {
            callback(response.results, null);
        } else {
            // fallback
            searchItems({
                name: encodedSearchTerm,
                _page: 1,
                _pageSize: 50,
                orderby: 'name.fr_FR:asc',
            })
            .then((fallbackResponse) => {
                const all = fallbackResponse.results || [];
                const filtered = all.filter((item:any) =>
                    getFrenchTranslation(item.data.name).toLowerCase().includes(searchTerm.toLowerCase())
                );
                callback(filtered.length ? filtered : null, filtered.length ? null : 'Aucun filtre dispo');
            })
            .catch((error) => {
                callback(null, error.message || "Erreur fallback");
            });
        }
    })
    .catch((error) => {
        callback(null, error.message || "Erreur requête principale");
    });
};

function ItemSearch({ onItemSelect }: { onItemSelect: (itemWithMedia: { item: any, media: any }) => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedResults, setDisplayedResults] = useState<{ item: ItemSearchResult, media: any }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const resultsPerPage = 5;

    useEffect(() => {
        let timeoutId: number | undefined;

        if (searchTerm.length >= 3) {
            setIsLoading(true);
            timeoutId = setTimeout(() => {
                searchItemsCallback(searchTerm, (data, err) => {
                    if (err) {
                        setError(err);
                        setDisplayedResults([]);
                    } else if (data) {
                        setError(null);
                        const fetchMediaPromises = data.map((item) =>
                            new Promise<{ item: ItemSearchResult, media: any }>((resolve) => {
                                apiGetItemMediaById(item.data.id, (media, mediaErr) => {
                                    resolve({ item, media: mediaErr ? null : media });
                                });
                            })
                        );
                        Promise.all(fetchMediaPromises).then((results) => {
                            setDisplayedResults(results.slice(0, resultsPerPage));
                        });
                    }
                    setIsLoading(false);
                });
            }, 800);
        } else {
            setError(null);
            setDisplayedResults([]);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [searchTerm]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recherche d'Items</Text>
            <TextInput
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Rechercher un objet..."
                placeholderTextColor="#999"
            />
            {searchTerm.length >= 3 && (
                <View style={styles.dropdown}>
                    {isLoading && <ActivityIndicator size="small" color="#ccc" />}
                    {!isLoading && error && <Text style={styles.error}>{error}</Text>}
                    {!isLoading && displayedResults.length > 0 && (
                        <FlatList
                            data={displayedResults}
                            keyExtractor={({ item }) => item.data.id.toString()}
                            renderItem={({ item: { item, media } }) => (
                                <TouchableOpacity
                                    style={styles.resultItem}
                                    onPress={() => {
                                        onItemSelect({ item, media });
                                        setSearchTerm('');
                                    }}
                                >
                                    {media && media.assets && media.assets[0] && (
                                        <Image
                                            source={{ uri: media.assets[0].value }}
                                            style={[
                                                styles.resultImage,
                                                { borderColor: getBorderColor(item.data.quality.type) },
                                            ]}
                                        />
                                    )}
                                    <Text style={styles.resultText}>
                                        {getFrenchTranslation(item.data.name)}{' '}
                                        <Text style={styles.itemClass}>{getItemClass(item.data.item_class.id)}</Text>
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        padding: 10,
        flex: 1,
        backgroundColor: 'rgba(2,5,11,1)',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#cccccc',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
        marginBottom: 8,
        textAlign: 'center',
    },
    searchInput: {
        height: 40,
        borderColor: '#747220',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        color: '#cccccc',
        fontSize: 14,
        backgroundColor: 'rgba(2,5,11,1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginBottom: 5,
    },
    dropdown: {
        backgroundColor: 'rgba(2,5,11,1)',
        borderColor: '#747220',
        borderWidth: 1,
        borderRadius: 4,
        maxHeight: 200,
        paddingVertical: 5,
        paddingHorizontal: 10,
        zIndex: 10,
    },
    error: {
        color: '#dc3545',
        padding: 8,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomColor: '#444',
        borderBottomWidth: 1,
    },
    resultImage: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        marginRight: 8,
    },
    resultText: {
        color: '#cccccc',
        fontSize: 14,
        flexShrink: 1,
    },
    itemClass: {
        fontSize: 10,
        color: '#999',
    },
});

export default ItemSearch;
