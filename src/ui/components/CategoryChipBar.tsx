import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { CategoryModel } from '../../models/catalog';
import { Palette } from '../../core/constants/themeColors';

interface CategoryChipBarProps {
  categories: CategoryModel[];
  selectedSlug: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryChipBar: React.FC<CategoryChipBarProps> = ({
  categories,
  selectedSlug,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.chip,
            selectedSlug === '' && styles.chipActive,
          ]}
          onPress={() => onSelectCategory('')}
        >
          <Text
            style={[
              styles.chipLabel,
              selectedSlug === '' && styles.chipLabelActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isSelected = selectedSlug === cat.slug;
          return (
            <TouchableOpacity
              key={cat.slug}
              activeOpacity={0.7}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onSelectCategory(isSelected ? '' : cat.slug)}
            >
              <Text
                style={[
                  styles.chipLabel,
                  isSelected && styles.chipLabelActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: Palette.primaryLight,
    borderColor: Palette.primary,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textBody,
  },
  chipLabelActive: {
    color: Palette.primaryDark,
    fontWeight: '700',
  },
});

