import { useContext } from 'react';
import { FavoritesContext, FavoritesContextValue } from '../state/FavoritesContext';

export const useFavorites = (): FavoritesContextValue => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
};

