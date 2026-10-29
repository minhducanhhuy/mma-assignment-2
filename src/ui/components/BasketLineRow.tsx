import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasketRecord } from '../../models/basket';
import { Palette } from '../../core/constants/themeColors';

interface BasketLineRowProps {
  entry: BasketRecord;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onPressItem?: () => void;
}

export const BasketLineRow: React.FC<BasketLineRowProps> = ({
  entry,
  onIncrement,
  onDecrement,
  onRemove,
  onPressItem,
}) => {
  const { item, quantity } = entry;
  const lineTotal = item.price * quantity;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressItem}
        style={styles.imageBox}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.details}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPressItem}
            style={styles.titleWrapper}
          >
            <Text style={styles.brand}>{item.brand || item.category.toUpperCase()}</Text>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onRemove}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={Palette.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.unitPrice}>${item.price.toFixed(2)}/đơn vị</Text>
            <Text style={styles.totalPrice}>${lineTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={onDecrement}
              activeOpacity={0.7}
            >
              <Ionicons
                name={quantity === 1 ? 'trash-outline' : 'remove'}
                size={14}
                color={quantity === 1 ? Palette.danger : Palette.textBody}
              />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{quantity}</Text>

            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={onIncrement}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={14} color={Palette.textBody} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Palette.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Palette.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  imageBox: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  brand: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.primary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textHeading,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  unitPrice: {
    fontSize: 11,
    color: Palette.textSub,
  },
  totalPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.primaryDark,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.border,
    padding: 2,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textHeading,
    paddingHorizontal: 10,
    minWidth: 32,
    textAlign: 'center',
  },
});

