import { useContext, useMemo } from 'react';
import { BasketContext } from '../state/BasketContext';
import { ProductEntity } from '../models/catalog';
import { BasketRecord } from '../models/basket';

/**
 * Assignment requirement: Custom useCart hook for managing cart logic.
 */
export const useCart = () => {
  const ctx = useContext(BasketContext);
  if (!ctx) {
    throw new Error('useCart must be wrapped within a CartProvider or BasketProvider');
  }

  const {
    records,
    bill,
    addItem,
    removeItem,
    setQuantity,
    clearAll,
    hasItem,
    getItemCount,
  } = ctx;

  return useMemo(
    () => ({
      // Standard Assignment 2 naming
      cartItems: records,
      items: records,
      totalPrice: bill.finalPayable,
      rawSubtotal: bill.rawSubtotal,
      totalItems: bill.itemCount,
      itemCount: bill.itemCount,
      addToCart: (item: ProductEntity, count = 1) => addItem(item, count),
      removeFromCart: (id: number) => removeItem(id),
      updateQuantity: (id: number, quantity: number) => setQuantity(id, quantity),
      clearCart: clearAll,
      isInCart: hasItem,
      getQuantity: getItemCount,

      // Also expose original methods for backward compatibility
      records,
      bill,
      addItem,
      removeItem,
      setQuantity,
      clearAll,
      hasItem,
      getItemCount,
    }),
    [records, bill, addItem, removeItem, setQuantity, clearAll, hasItem, getItemCount]
  );
};

export type UseCartReturn = ReturnType<typeof useCart>;

