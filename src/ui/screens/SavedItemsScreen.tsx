import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/navigationRoutes';
import { useFavorites } from '../../hooks/useFavorites';
import { useBasket } from '../../hooks/useBasket';
import { FeedbackView } from '../elements/FeedbackView';
import { Palette } from '../../core/constants/themeColors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SavedItemsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { addItem } = useBasket();

  const handleMoveToBasket = (item: (typeof favorites)[0]) => {
    addItem(item, 1);
    Alert.alert('Thành công', `Đã chuyển "${item.title}" vào giỏ hàng.`);
  };

  const confirmClearFavorites = () => {
    Alert.alert('Xác nhận', 'Bạn có muốn xóa toàn bộ danh sách yêu thích?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa hết', style: 'destructive', onPress: clearFavorites },
    ]);
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FeedbackView
          iconName="heart-outline"
          title="Chưa có sản phẩm yêu thích"
          subtitle="Hãy nhấn biểu tượng trái tim trên các sản phẩm để lưu lại những món bạn quan tâm!"
          actionText="Khám phá ngay"
          onActionPress={() => navigation.navigate('MainTabs', { screen: 'CatalogTab' })}
          accentColor={Palette.danger}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.countText}>Đang lưu {favorites.length} sản phẩm</Text>
            <TouchableOpacity onPress={confirmClearFavorites} style={styles.clearBtn}>
              <Ionicons name="trash-outline" size={14} color={Palette.danger} />
              <Text style={styles.clearBtnText}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ItemDetail', { productId: item.id })}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} resizeMode="cover" />

            <View style={styles.info}>
              <Text style={styles.category}>{item.category.toUpperCase()}</Text>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cartBtn}
                onPress={() => handleMoveToBasket(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => toggleFavorite(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="heart-dislike-outline" size={18} color={Palette.danger} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSub,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.danger,
  },
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
  thumb: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.primary,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textHeading,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.primaryDark,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartBtn: {
    backgroundColor: Palette.primary,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    backgroundColor: Palette.dangerLight,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
