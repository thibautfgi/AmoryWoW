import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import Footer from '../footer/footer';  
import { Outlet } from 'react-router-native';

export default function AppContainer() {
  return (
    <ImageBackground
      source={require('../../../assets/image/wow-caverne.png')}
      style={styles.appContainer}
      resizeMode="cover"
    >
      <View style={styles.mainContent}>
        <Outlet />
      </View>
      <View style={styles.bot}>
        <Footer />
      </View>
    </ImageBackground>
  );
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mainContent: {
    flex: 1, // prend l’espace restant (75vh équivalent)
    marginLeft: width > 600 ? 80 : 16, // 8rem = 80px, 1rem = 16px (adapté au device)
    marginRight: width > 600 ? 80 : 16,
    // Scroll automatique avec ScrollView si besoin (ici on suppose que Outlet gère ça)
  },
  bot: {
    height: height * 0.05, // 5vh
    width: '100%',
  },
});
