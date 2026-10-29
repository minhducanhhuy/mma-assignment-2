import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/navigationRoutes';
import { useBasket } from '../../hooks/useBasket';
import { BasketLineRow } from '../components/BasketLineRow';
import { BillSummaryCard } from '../components/BillSummaryCard';
import { FeedbackView } from '../elements/FeedbackView';
import { PrimaryButton } from '../elements/PrimaryButton';
import { Palette } from '../../core/constants/themeColors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const BasketScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { records, bill, setQuantity, removeItem, clearAll } = useBasket();

  const handleCheckout = () => {
    Alert.alert(
      'Xác nhận đặt hàng',
      `Bạn có muốn thanh toán đơn hàng với tổng số tiền là $${bill.finalPayable.toFixed(2)}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thanh toán ngay',
          style: 'default',
          onPress: () => {
            clearAll();
            Alert.alert(
              '🎉 Đặt hàng thành công!',
              'Cảm ơn bạn đã mua sắm tại DucShop. Đơn hàng của bạn đang được chuẩn bị để giao hàng sớm nhất.'
            );
          },
        },
      ]
    );
  };

  const confirmClearAll = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn dọn sạch giỏ hàng không?', [
      { text: 'Không', style: 'cancel' },
      { text: 'Xóa hết', style: 'destructive', onPress: clearAll },
    ]);
  };

  if (records.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FeedbackView
          iconName="cart-outline"
          title="Giỏ hàng trống"
          subtitle="Bạn chưa chọn sản phẩm nào. Hãy khám phá danh mục và thêm món đồ bạn thích vào giỏ nhé!"
          actionText="Bắt đầu mua sắm"
          onActionPress={() => navigation.navigate('MainTabs', { screen: 'CatalogTab' })}
          accentColor={Palette.primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={records}
        keyExtractor={(entry) => String(entry.item.id)}
        renderItem={({ item: entry }) => (
          <BasketLineRow
            entry={entry}
            onIncrement={() => setQuantity(entry.item.id, entry.quantity + 1)}
            onDecrement={() => setQuantity(entry.item.id, entry.quantity - 1)}
            onRemove={() => removeItem(entry.item.id)}
            onPressItem={() =>
              navigation.navigate('ItemDetail', { productId: entry.item.id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.itemCountText}>Có {bill.itemCount} món trong giỏ hàng</Text>
            <TouchableOpacity onPress={confirmClearAll} style={styles.clearBtn}>
              <Ionicons name="trash-bin-outline" size={14} color={Palette.danger} />
              <Text style={styles.clearBtnText}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={<BillSummaryCard bill={bill} />}
      />

      {/* Floating Checkout Action */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutLabel}>Tổng thanh toán:</Text>
          <Text style={styles.checkoutAmount}>${bill.finalPayable.toFixed(2)}</Text>
        </View>

        <PrimaryButton
          label="Tiến hành đặt hàng"
          onPress={handleCheckout}
          variant="solid"
          size="lg"
          style={styles.checkoutBtn}
          icon={<Ionicons name="card-outline" size={18} color="#FFFFFF" />}
        />
      </View>
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
    paddingBottom: 110,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemCountText: {
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
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Palette.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  checkoutLabel: {
    fontSize: 12,
    color: Palette.textSub,
  },
  checkoutAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.primaryDark,
  },
  checkoutBtn: {
    minWidth: 180,
  },
});

export const CartScreen = BasketScreen;

