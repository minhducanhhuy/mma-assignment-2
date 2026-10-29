import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../core/constants/themeColors';

interface CatalogSearchBarProps {
  query: string;
  onChangeQuery: (text: string) => void;
  onClear: () => void;
  onPickImage?: () => void;
  isPickingImage?: boolean;
}

export const CatalogSearchBar: React.FC<CatalogSearchBarProps> = ({
  query,
  onChangeQuery,
  onClear,
  onPickImage,
  isPickingImage = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons name="search" size={18} color={Palette.textSub} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm sản phẩm, thương hiệu..."
          placeholderTextColor={Palette.textSub}
          value={query}
          onChangeText={onChangeQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={Palette.textSub} />
          </TouchableOpacity>
        )}
      </View>

      {onPickImage && (
        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={onPickImage}
          disabled={isPickingImage}
          activeOpacity={0.75}
        >
          {isPickingImage ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Palette.surface,
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Palette.textHeading,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  cameraBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

