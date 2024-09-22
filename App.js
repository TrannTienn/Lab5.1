// src/App.js
import React from 'react';
import { SafeAreaView, StyleSheet, ImageBackground } from 'react-native';
import UserManagement from './compoment/UserManagement'; 

const App = () => {
  return (
    <ImageBackground 
      source={require('./assets/bgn.jpg')} 
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <UserManagement />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 30,
    
  },
});

export default App;
