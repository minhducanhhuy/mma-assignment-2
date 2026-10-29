import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductEntity } from '../../models/catalog';
import { Palette } from '../../core/constants/themeColors';

const CARD_WIDTH = (Dimensions.get('window').width - 36) / 2;

interface CatalogItemCardProps {
  item: ProductEntity;
  onPress: () => void;
  onAddToCart: () => void;
  onToggleFavorite?: () => void;
  isFavorited?: boolean;
}

export const CatalogItemCard: React.FC<CatalogItemCardProps> = ({
  item,
  onPress,
  onAddToCart,
  onToggleFavorite,
  isFavorited = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />
        {item.discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{Math.round(item.discountPercentage)}%</Text>
          </View>
        )}
        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={onToggleFavorite}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorited ? Palette.danger : Palette.textSub}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoArea}>
        <Text style={styles.category}>{item.category.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={Palette.accent} />
          <Text style={styles.ratingScore}>{item.rating.toFixed(1)}</Text>
          <Text style={styles.stockNote}>
            {item.stock > 0 ? `(${item.stock} left)` : '(Hết hàng)'}
          </Text>
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            {item.discountPercentage > 0 && (
              <Text style={styles.originalPrice}>
                ${(item.price / (1 - item.discountPercentage / 100)).toFixed(2)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.cartButton}
            onPress={onAddToCart}
            activeOpacity={0.75}
          >
            <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Palette.surface,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnailContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Palette.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoArea: {
    padding: 10,
  },
  category: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.primary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textHeading,
    lineHeight: 18,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 3,
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textBody,
  },
  stockNote: {
    fontSize: 10,
    color: Palette.textSub,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.primaryDark,
  },
  originalPrice: {
    fontSize: 10,
    color: Palette.textSub,
    textDecorationLine: 'line-through',
  },
  cartButton: {
    backgroundColor: Palette.primary,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

