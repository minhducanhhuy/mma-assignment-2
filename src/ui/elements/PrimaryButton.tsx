import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Palette } from '../../core/constants/themeColors';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'solid',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineBtn;
      case 'ghost':
        return styles.ghostBtn;
      case 'danger':
        return styles.dangerBtn;
      default:
        return styles.solidBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.solidText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.size_sm;
      case 'lg':
        return styles.size_lg;
      default:
        return styles.size_md;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'solid' || variant === 'danger' ? '#FFFFFF' : Palette.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.textBase, getTextStyle(), textStyle]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 6,
  },
  size_sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  size_lg: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  solidBtn: {
    backgroundColor: Palette.primary,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Palette.primary,
  },
  ghostBtn: {
    backgroundColor: 'transparent',
  },
  dangerBtn: {
    backgroundColor: Palette.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontWeight: '600',
    fontSize: 14,
  },
  solidText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: Palette.primary,
  },
  ghostText: {
    color: Palette.textBody,
  },
  dangerText: {
    color: '#FFFFFF',
  },
});

