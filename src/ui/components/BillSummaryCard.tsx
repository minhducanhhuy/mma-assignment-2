import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasketBillCalculation } from '../../models/basket';
import { Palette } from '../../core/constants/themeColors';

interface BillSummaryCardProps {
  bill: BasketBillCalculation;
}

export const BillSummaryCard: React.FC<BillSummaryCardProps> = ({ bill }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Tóm tắt hóa đơn</Text>

      {/* Free shipping banner */}
      <View
        style={[
          styles.shippingBanner,
          bill.qualifiesFreeShipping
            ? styles.shippingBannerSuccess
            : styles.shippingBannerNotice,
        ]}
      >
        <Ionicons
          name={bill.qualifiesFreeShipping ? 'checkmark-circle' : 'gift-outline'}
          size={16}
          color={bill.qualifiesFreeShipping ? Palette.primary : Palette.accent}
        />
        <Text
          style={[
            styles.shippingBannerText,
            bill.qualifiesFreeShipping ? styles.textSuccess : styles.textNotice,
          ]}
        >
          {bill.qualifiesFreeShipping
            ? 'Đơn hàng đủ điều kiện miễn phí vận chuyển!'
            : `Mua thêm $${bill.freeShippingGap.toFixed(2)} để được Freeship`}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Tạm tính ({bill.itemCount} món)</Text>
        <Text style={styles.value}>${bill.rawSubtotal.toFixed(2)}</Text>
      </View>

      {bill.discountSavings > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Khuyến mãi tiết kiệm</Text>
          <Text style={styles.discountValue}>-${bill.discountSavings.toFixed(2)}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Phí giao hàng</Text>
        <Text style={styles.value}>
          {bill.shippingFee === 0 ? 'MIỄN PHÍ' : `$${bill.shippingFee.toFixed(2)}`}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Tổng cộng thanh toán</Text>
        <Text style={styles.totalValue}>${bill.finalPayable.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textHeading,
    marginBottom: 12,
  },
  shippingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 14,
  },
  shippingBannerSuccess: {
    backgroundColor: Palette.primaryLight,
  },
  shippingBannerNotice: {
    backgroundColor: Palette.accentLight,
  },
  shippingBannerText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  textSuccess: {
    color: Palette.primaryDark,
  },
  textNotice: {
    color: '#92400E',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: Palette.textSub,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textBody,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.danger,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textHeading,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.primary,
  },
});

