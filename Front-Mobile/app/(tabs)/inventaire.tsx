import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, Alert, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { apiGetItemById, apiGetItemMediaById, getInventory, deleteItem } from '../components/service/apiService';
import { getBorderColor, getFrenchTranslation } from '../../src/components/page/armurerie/service/tools.service';
import { useAuth } from '../components/authProvider/authProvider';
const backgroundImage = require('../../assets/image/paysage.jpg');

export default function Inventaire() {
  const [items, setItems] = useState<{ id: number; data: any; media: any }[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      setErrorMessage('Veuillez vous connecter pour voir votre inventaire.');
      return;
    }

    const fetchItems = async () => {
      try {
        const itemIds = await getInventory();
        const itemPromises = itemIds.map(
          (id: number) =>
            new Promise<{ id: number; data: any; media: any }>(resolve => {
              apiGetItemById(id, (itemData, itemError) => {
                if (itemError) {
                  resolve({ id, data: null, media: null });
                } else {
                  apiGetItemMediaById(id, (mediaData, mediaError) => {
                    if (mediaError) {
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
        setErrorMessage(null);
      } catch (error: any) {
        setErrorMessage(`Erreur : ${error.message || "Échec du chargement de l'inventaire"}`);
      }
    };

    fetchItems();
  }, [isAuthenticated]);

  const handleDeleteItem = async (id: number) => {
    if (!isAuthenticated) {
      setErrorMessage('Veuillez vous connecter pour supprimer un item.');
      return;
    }

    try {
      await deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      Alert.alert('Succès', `Item ${id} supprimé.`);
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(`Erreur : ${error.message || "Échec de la suppression de l'item"}`);
    }
  };

  return (
    
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover" // ou "contain" selon ton besoin
    >
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Inventaire</Text>
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

        <View style={styles.itemsList}>
            {items.length === 0 && !errorMessage && <Text style={styles.noItem}>Aucun item dans l'inventaire.</Text>}

            {items.map(({ id, data, media }) => (
            <View key={id} style={styles.itemDetails}>
                {media?.assets?.[0] && (
                <Image
                    source={{ uri: media.assets[0].value }}
                    style={[
                    styles.itemImage,
                    { borderColor: getBorderColor(data.quality.type) },
                    ]}
                />
                )}
                <Text style={[styles.itemName, { color: getBorderColor(data.quality.type) }]}>
                {getFrenchTranslation(data.name) || `ID ${id} (nom inconnu)`}
                </Text>

                <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(id)}
                activeOpacity={0.7}
                >
                <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
            ))}
        </View>
        </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',      // centre verticalement
    alignItems: 'center',          // centre horizontalement
    height: Dimensions.get('window').height, // hauteur max de l'écran
    width: '100%',                 // largeur 100% (tu peux ajuster)
  },
  container: {
    padding: 50,
    backgroundColor: '#02050b',
    minHeight: '100%',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20, // Note: gap is not supported in React Native, use margin on children instead
  },
  noItem: {
    color: '#cccccc',
    textAlign: 'center',
  },
  itemDetails: {
    backgroundColor: 'rgba(2, 5, 11, 1)',
    padding: 20,
    borderWidth: 1,
    borderColor: '#747220',
    borderRadius: 4,
    alignItems: 'center',
    width: 200,
    margin: 10,
  },
  itemImage: {
    width: 35,
    height: 35,
    borderRadius: 5,
    borderWidth: 2,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#FF4444',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
