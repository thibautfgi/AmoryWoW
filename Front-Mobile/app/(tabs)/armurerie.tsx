import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, Alert, ImageBackground, Dimensions } from 'react-native';
import ItemSearch from '../../src/components/page/armurerie/item-search/item-search';
import { getFrenchTranslation, getItemClass, getBorderColor } from '../../src/components/page/armurerie/service/tools.service';
import { postItem } from '../components/service/apiService';
import { useAuth } from '../components/authProvider/authProvider';
const backgroundImage = require('../../assets/image/paysage.jpg');

export default function Armurerie() {
  const [selectedItem, setSelectedItem] = useState<{ item: any; media: any } | null>(null);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log('User from context:', user);
  }, [user]);

  const handleItemSelect = (itemWithMedia: { item: any; media: any }) => {
    setSelectedItem(itemWithMedia);
    setErrorMessage(null);
  };

  const handleRecoverItem = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Veuillez vous connecter pour sauvegarder un item.');
      return;
    }

    if (selectedItem?.item?.data?.id) {
      try {
        const response = await postItem(selectedItem.item.data.id);
        setSavedItems((prev) =>
          prev.includes(selectedItem.item.data.id) ? prev : [...prev, selectedItem.item.data.id]
        );
        setErrorMessage(null);
        Alert.alert('Succès', 'Item sauvegardé avec succès');
      } catch (error: any) {
        setErrorMessage(`Erreur : ${error.message || 'Échec de la sauvegarde'}`);
      }
    } else {
      setErrorMessage('Aucun item sélectionné');
    }
  };

  return (
    
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover" // ou "contain" selon ton besoin
    >
        <ScrollView contentContainerStyle={styles.container}>
        {/* Si tu as un composant natif ItemSearch, sinon à créer */}
        <ItemSearch onItemSelect={handleItemSelect} />

        <View style={styles.detailsBox}>
            {selectedItem ? (
            <>
                <View style={styles.header}>
                {selectedItem.media?.assets?.[0] && (
                    <Image
                    source={{ uri: selectedItem.media.assets[0].value }}
                    style={[
                        styles.image,
                        { borderColor: getBorderColor(selectedItem.item.data.quality.type) },
                    ]}
                    />
                )}
                <Text
                    style={[
                    styles.title,
                    { color: getBorderColor(selectedItem.item.data.quality.type) },
                    ]}
                >
                    {getFrenchTranslation(selectedItem.item.data.name)}
                </Text>
                </View>

                <Text style={styles.text}>
                <Text style={styles.label}>Qualité : </Text>
                {getFrenchTranslation(selectedItem.item.data.quality.name)}
                </Text>
                <Text style={styles.text}>
                <Text style={styles.label}>Niveau requis : </Text>
                {selectedItem.item.data.required_level || 'N/A'}
                </Text>
                <Text style={styles.text}>
                <Text style={styles.label}>Prix de vente : </Text>
                {selectedItem.item.data.sell_price || 'N/A'} pièces
                </Text>
                <Text style={styles.text}>
                <Text style={styles.label}>Type : </Text>
                {getItemClass(selectedItem.item.data.item_class.id)}
                </Text>
                <Text style={styles.text}>
                <Text style={styles.label}>Type d'inventaire : </Text>
                {getFrenchTranslation(selectedItem.item.data.inventory_type.name) || 'N/A'}
                </Text>

                <View style={styles.buttonContainer}>
                <Button title="Récupérer l'item" onPress={handleRecoverItem} color="#747220" />
                </View>

                {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

                {savedItems.length > 0 && (
                <View style={styles.savedItems}>
                    <Text style={styles.subtitle}>Items sauvegardés :</Text>
                    {savedItems.map((id) => (
                    <Text key={id} style={styles.savedItem}>
                        ID: {id}
                    </Text>
                    ))}
                </View>
                )}
            </>
            ) : (
            <Text style={styles.text}>Sélectionnez un item dans la recherche.</Text>
            )}
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
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsBox: {
    backgroundColor: '#02050b',
    padding: 20,
    borderWidth: 1,
    borderColor: '#747220',
    borderRadius: 4,
    marginTop: 20,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 5,
    borderWidth: 2,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: '#cccccc',
    marginVertical: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 15,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  savedItems: {
    marginTop: 20,
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#cccccc',
  },
  savedItem: {
    color: '#aaaaaa',
  },
});
