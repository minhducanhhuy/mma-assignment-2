import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductEntity } from '../models/catalog';
import { LocalStorageKeys } from '../core/constants/storageKeys';

export interface FavoritesContextValue {
  favorites: ProductEntity[];
  toggleFavorite: (product: ProductEntity) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<ProductEntity[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(LocalStorageKeys.FAVORITES_LIST);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Failed to load favorites:', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(LocalStorageKeys.FAVORITES_LIST, JSON.stringify(favorites)).catch(
      (err) => console.warn('Failed to save favorites:', err)
    );
  }, [favorites, loaded]);

  const toggleFavorite = (product: ProductEntity) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [product, ...prev];
    });
  };

  const isFavorite = (productId: number) => favorites.some((p) => p.id === productId);

  const clearFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

