import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette } from '../../core/constants/themeColors';

interface PillBadgeProps {
  value: number | string;
  variant?: 'danger' | 'accent' | 'primary';
}

export const PillBadge: React.FC<PillBadgeProps> = ({ value, variant = 'danger' }) => {
  if (value === 0 || value === '0' || !value) return null;

  const bgColors = {
    danger: Palette.danger,
    accent: Palette.accent,
    primary: Palette.primary,
  };

  return (
    <View style={[styles.badge, { backgroundColor: bgColors[variant] }]}>
      <Text style={styles.badgeText}>{typeof value === 'number' && value > 99 ? '99+' : value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});

