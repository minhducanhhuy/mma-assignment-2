import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BasketProvider } from './src/state/BasketContext';
import { FavoritesProvider } from './src/state/FavoritesContext';
import { AppNavigationRouter } from './src/ui/navigation/AppNavigationRouter';

export default function App() {
  return (
    <SafeAreaProvider>
      <BasketProvider>
        <FavoritesProvider>
          <StatusBar style="dark" />
          <AppNavigationRouter />
        </FavoritesProvider>
      </BasketProvider>
    </SafeAreaProvider>
  );
}

