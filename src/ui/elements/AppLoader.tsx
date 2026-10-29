import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Palette } from '../../core/constants/themeColors';

interface AppLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  message = 'Đang tải dữ liệu...',
  fullScreen = true,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={Palette.primary} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: Palette.textSub,
    fontWeight: '500',
  },
});

