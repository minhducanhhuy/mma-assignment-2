import React, { useState } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../navigation/navigationRoutes';
import { useCatalogFeed } from '../../hooks/useCatalogFeed';
import { useBasket } from '../../hooks/useBasket';
import { useFavorites } from '../../hooks/useFavorites';
import { useDebouncedSearch } from '../../hooks/useDebouncedSearch';
import { CatalogSearchBar } from '../components/CatalogSearchBar';
import { CategoryChipBar } from '../components/CategoryChipBar';
import { CatalogItemCard } from '../components/CatalogItemCard';
import { FeedbackView } from '../elements/FeedbackView';
import { AppLoader } from '../elements/AppLoader';
import { Palette } from '../../core/constants/themeColors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const FeedCatalogScreen: React.FC = () => {

  const navigation = useNavigation<NavigationProp>();
  const { addItem } = useBasket();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [inputQuery, setInputQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const debouncedQuery = useDebouncedSearch(inputQuery, 400);

  const {
    products,
    categories,
    isLoading,
    isRefreshing,
    isPaginating,
    error,
    refreshFeed,
    loadNextPage,
  } = useCatalogFeed({
    searchQuery: debouncedQuery,
    selectedCategory: activeCategory,
  });

  const handlePickImageForSearch = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Yêu cầu quyền truy cập',
          'Vui lòng cấp quyền truy cập thư viện ảnh để sử dụng tính năng tìm kiếm bằng hình ảnh.'
        );
        return;
      }

      setIsProcessingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Mock visual keyword extraction
        const sampleKeywords = ['perfume', 'watch', 'phone', 'shoes', 'chair'];
        const randomTerm = sampleKeywords[Math.floor(Math.random() * sampleKeywords.length)];
        setInputQuery(randomTerm);
        Alert.alert('Tìm kiếm bằng hình ảnh', `Đã nhận diện từ khóa liên quan: "${randomTerm}"`);
      }
    } catch (err: unknown) {
      console.warn('Image picker error:', err);
      Alert.alert('Lỗi', 'Không thể chọn hình ảnh lúc này.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const renderFooter = () => {
    if (!isPaginating) return null;
    return (
      <View style={styles.paginationLoader}>
        <ActivityIndicator size="small" color={Palette.primary} />
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <CatalogSearchBar
        query={inputQuery}
        onChangeQuery={setInputQuery}
        onClear={() => setInputQuery('')}
        onPickImage={handlePickImageForSearch}
        isPickingImage={isProcessingImage}
      />

      <CategoryChipBar
        categories={categories}
        selectedSlug={activeCategory}
        onSelectCategory={(slug) => {
          setActiveCategory(slug);
          if (slug) setInputQuery('');
        }}
      />

      {isLoading ? (
        <AppLoader message="Đang tải danh mục sản phẩm..." />
      ) : error ? (
        <FeedbackView
          iconName="alert-circle-outline"
          title="Không thể tải sản phẩm"
          subtitle={error}
          actionText="Thử lại"
          onActionPress={refreshFeed}
          accentColor={Palette.danger}
        />
      ) : products.length === 0 ? (
        <FeedbackView
          iconName="search-outline"
          title="Không tìm thấy sản phẩm"
          subtitle="Hãy thử tìm bằng từ khóa hoặc danh mục khác"
          actionText="Xóa bộ lọc"
          onActionPress={() => {
            setInputQuery('');
            setActiveCategory('');
          }}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CatalogItemCard
              item={item}
              onPress={() => navigation.navigate('ItemDetail', { productId: item.id })}
              onAddToCart={() => addItem(item, 1)}
              onToggleFavorite={() => toggleFavorite(item)}
              isFavorited={isFavorite(item.id)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={loadNextPage}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshFeed}
              colors={[Palette.primary]}
              tintColor={Palette.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  paginationLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const ProductListScreen = FeedCatalogScreen;


