import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { useAuth } from '../components/authProvider/authProvider';
import Connect from '../components/connect/connect';

const backgroundImage = require('../../assets/image/paysage.jpg');

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover" // ou "contain" selon ton besoin
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Bienvenue sur le portail de gestion de votre inventaire !
        </Text>
        {isAuthenticated ? (
          <>
            <Text style={styles.subtitle}>
              Bonjour {user}, vous êtes connecté. Gérez vos items avec efficacité !
            </Text>
            <Connect />
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>
              Commencez par vous connecter pour accéder à vos items et les gérer efficacement.
            </Text>
            <Connect />
          </>
        )}
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
    flexGrow: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 18,
    color: '#cccccc',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 15,
  },
});
