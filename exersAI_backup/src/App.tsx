import '../global.css';
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const loadAuth = useAuthStore(state => state.loadAuth);

  // Cargar autenticación al iniciar la app
  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
