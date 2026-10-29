import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../core/constants/themeColors';
import { PrimaryButton } from './PrimaryButton';

interface FeedbackViewProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  actionText?: string;
  onActionPress?: () => void;
  accentColor?: string;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({
  iconName,
  title,
  subtitle,
  actionText,
  onActionPress,
  accentColor = Palette.textSub,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: Palette.primaryLight }]}>
        <Ionicons name={iconName} size={48} color={accentColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionText && onActionPress && (
        <PrimaryButton
          label={actionText}
          onPress={onActionPress}
          variant="solid"
          size="md"
          style={styles.actionBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.textHeading,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Palette.textSub,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionBtn: {
    minWidth: 160,
  },
});

