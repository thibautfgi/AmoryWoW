// src/components/connect/Connect.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../authProvider/authProvider'; // adapte le chemin si besoin

export default function Connect() {
  const { isAuthenticated, user, login, logout, error } = useAuth();

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
            <Text style={styles.buttonText}>Se déconnecter</Text>
          </TouchableOpacity>
          <Text style={styles.userText}>Utilisateur : {user}</Text>
        </>
      )}
      {error && <Text style={styles.errorText}>Erreur : {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: '#747220',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#a33a3a',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userText: {
    marginTop: 15,
    color: '#ccc',
  },
  errorText: {
    marginTop: 10,
    color: 'red',
  },
});
