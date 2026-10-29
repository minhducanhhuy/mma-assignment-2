import React, {
  createContext,
  useReducer,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductEntity } from '../models/catalog';
import { BasketRecord, BasketBillCalculation } from '../models/basket';
import { LocalStorageKeys } from '../core/constants/storageKeys';

// State definition
export interface BasketState {
  records: BasketRecord[];
  isHydrated: boolean;
}

// Actions
export type BasketAction =
  | { type: 'HYDRATE'; payload: BasketRecord[] }
  | { type: 'ADD_RECORD'; item: ProductEntity; count?: number }
  | { type: 'REMOVE_RECORD'; id: number }
  | { type: 'SET_RECORD_QTY'; id: number; quantity: number }
  | { type: 'CLEAR_ALL' };

const initialBasketState: BasketState = {
  records: [],
  isHydrated: false,
};

function basketReducer(state: BasketState, action: BasketAction): BasketState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        records: action.payload,
        isHydrated: true,
      };

    case 'ADD_RECORD': {
      const { item, count = 1 } = action;
      const index = state.records.findIndex((r) => r.item.id === item.id);
      if (index >= 0) {
        const next = [...state.records];
        next[index] = {
          ...next[index],
          quantity: next[index].quantity + count,
        };
        return { ...state, records: next };
      }
      return {
        ...state,
        records: [...state.records, { item, quantity: count, addedAt: Date.now() }],
      };
    }

    case 'REMOVE_RECORD':
      return {
        ...state,
        records: state.records.filter((r) => r.item.id !== action.id),
      };

    case 'SET_RECORD_QTY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          records: state.records.filter((r) => r.item.id !== action.id),
        };
      }
      return {
        ...state,
        records: state.records.map((r) =>
          r.item.id === action.id ? { ...r, quantity: action.quantity } : r
        ),
      };
    }

    case 'CLEAR_ALL':
      return {
        ...state,
        records: [],
      };

    default:
      return state;
  }
}

export interface BasketContextValue {
  records: BasketRecord[];
  bill: BasketBillCalculation;
  addItem: (item: ProductEntity, count?: number) => void;
  removeItem: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clearAll: () => void;
  hasItem: (id: number) => boolean;
  getItemCount: (id: number) => number;
}

export const BasketContext = createContext<BasketContextValue | undefined>(undefined);

export const BasketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(basketReducer, initialBasketState);

  // Restore on app startup
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(LocalStorageKeys.BASKET_ITEMS);
        if (raw && active) {
          const parsed: BasketRecord[] = JSON.parse(raw);
          dispatch({ type: 'HYDRATE', payload: parsed });
          return;
        }
      } catch (err) {
        console.warn('Failed to hydrate basket:', err);
      }
      if (active) {
        dispatch({ type: 'HYDRATE', payload: [] });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Save changes to storage
  useEffect(() => {
    if (!state.isHydrated) return;
    AsyncStorage.setItem(LocalStorageKeys.BASKET_ITEMS, JSON.stringify(state.records)).catch(
      (err) => console.warn('Failed to sync basket:', err)
    );
  }, [state.records, state.isHydrated]);

  // Derived calculations
  const bill = useMemo<BasketBillCalculation>(() => {
    let totalItems = 0;
    let subtotal = 0;
    let savings = 0;

    for (const entry of state.records) {
      totalItems += entry.quantity;
      const lineCost = entry.item.price * entry.quantity;
      subtotal += lineCost;

      if (entry.item.discountPercentage) {
        const originalPrice = entry.item.price / (1 - entry.item.discountPercentage / 100);
        savings += (originalPrice - entry.item.price) * entry.quantity;
      }
    }

    const FREE_SHIPPING_FLOOR = 50;
    const qualifiesFreeShipping = subtotal >= FREE_SHIPPING_FLOOR || totalItems === 0;
    const shippingFee = qualifiesFreeShipping ? 0 : 7.99;
    const freeShippingGap = Math.max(0, FREE_SHIPPING_FLOOR - subtotal);
    const finalPayable = subtotal + shippingFee;

    return {
      itemCount: totalItems,
      rawSubtotal: subtotal,
      discountSavings: savings,
      shippingFee,
      finalPayable,
      qualifiesFreeShipping,
      freeShippingGap,
    };
  }, [state.records]);

  const addItem = (item: ProductEntity, count = 1) => {
    dispatch({ type: 'ADD_RECORD', item, count });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_RECORD', id });
  };

  const setQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'SET_RECORD_QTY', id, quantity });
  };

  const clearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
  };

  const hasItem = (id: number) => state.records.some((r) => r.item.id === id);

  const getItemCount = (id: number) => {
    const found = state.records.find((r) => r.item.id === id);
    return found ? found.quantity : 0;
  };

  const value: BasketContextValue = {
    records: state.records,
    bill,
    addItem,
    removeItem,
    setQuantity,
    clearAll,
    hasItem,
    getItemCount,
  };

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
};

// Aliases matching standard Assignment 2 naming
export const CartContext = BasketContext;
export const CartProvider = BasketProvider;
export type CartContextValue = BasketContextValue;


