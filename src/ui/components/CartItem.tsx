import React from 'react';
import { BasketLineRow } from './BasketLineRow';
import { BasketRecord } from '../../models/basket';
import { ProductEntity } from '../../models/catalog';

export interface CartItemProps {
  entry?: BasketRecord;
  item?: BasketRecord | ProductEntity;
  quantity?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onPressItem?: () => void;
}

/**
 * Assignment requirement: Atomic CartItem component
 */
export const CartItem: React.FC<CartItemProps> = ({
  entry,
  item,
  quantity = 1,
  onIncrement,
  onDecrement,
  onRemove,
  onPressItem,
}) => {
  // Normalize entry object
  const resolvedEntry: BasketRecord =
    entry ||
    ((item && 'item' in item && 'quantity' in item)
      ? (item as BasketRecord)
      : {
          item: item as ProductEntity,
          quantity: quantity,
          addedAt: Date.now(),
        });

  if (!resolvedEntry || !resolvedEntry.item) return null;

  return (
    <BasketLineRow
      entry={resolvedEntry}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onRemove={onRemove}
      onPressItem={onPressItem}
    />
  );
};

