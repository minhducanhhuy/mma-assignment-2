import { useContext } from 'react';
import { BasketContext, BasketContextValue } from '../state/BasketContext';

/**
 * Custom hook to interact with DucShop basket / cart
 */
export const useBasket = (): BasketContextValue => {
  const ctx = useContext(BasketContext);
  if (!ctx) {
    throw new Error('useBasket must be wrapped within a BasketProvider');
  }
  return ctx;
};

export { useCart } from './useCart';


