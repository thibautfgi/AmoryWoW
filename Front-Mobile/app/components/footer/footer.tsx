import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';

export default function Footer() {
  const { width, height } = Dimensions.get('window');
  return (
    <ImageBackground
      source={require('../../../assets/image/gold-top.png')} // adapte le chemin
      style={[styles.footerContainer, { height: height * 0.05 }]} // 5vh
      resizeMode="repeat"
    >
      <View style={styles.content}>
        <Text style={styles.text}>© 2024 Armory Adventure. All Rights Reserved</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    position: 'relative', // relative par défaut
    zIndex: 1000,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#ffd700',
    fontSize: 8,
  },
});
