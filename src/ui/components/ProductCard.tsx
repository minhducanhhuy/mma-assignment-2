import React from 'react';
import { CatalogItemCard } from './CatalogItemCard';
import { ProductEntity } from '../../models/catalog';

export interface ProductCardProps {
  item?: ProductEntity;
  product?: ProductEntity;
  onPress: () => void;
  onAddToCart: () => void;
  onToggleFavorite?: () => void;
  isFavorited?: boolean;
}

/**
 * Assignment requirement: Atomic ProductCard component
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  product,
  onPress,
  onAddToCart,
  onToggleFavorite,
  isFavorited = false,
}) => {
  const targetItem = item || product;
  if (!targetItem) return null;

  return (
    <CatalogItemCard
      item={targetItem}
      onPress={onPress}
      onAddToCart={onAddToCart}
      onToggleFavorite={onToggleFavorite}
      isFavorited={isFavorited}
    />
  );
};

