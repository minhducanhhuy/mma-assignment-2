import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/navigationRoutes';
import { ProductEntity } from '../../models/catalog';
import { CatalogService } from '../../api/catalogService';
import { useBasket } from '../../hooks/useBasket';
import { useFavorites } from '../../hooks/useFavorites';
import { PrimaryButton } from '../elements/PrimaryButton';
import { AppLoader } from '../elements/AppLoader';
import { FeedbackView } from '../elements/FeedbackView';
import { AiAdvisorModal } from '../components/AiAdvisorModal';
import { Palette } from '../../core/constants/themeColors';

const { width } = Dimensions.get('window');

type ItemDetailRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;

export const ItemDetailScreen: React.FC = () => {
  const route = useRoute<ItemDetailRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { productId } = route.params;

  const { addItem, getItemCount } = useBasket();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState<ProductEntity | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await CatalogService.getProductById(productId);
        if (!unmounted) {
          setProduct(data);
          setSelectedImage(data.images?.[0] || data.thumbnail);
        }
      } catch (err: unknown) {
        if (!unmounted) {
          const msg = err instanceof Error ? err.message : 'Không thể tải chi tiết sản phẩm';
          setError(msg);
        }
      } finally {
        if (!unmounted) setIsLoading(false);
      }
    })();
    return () => {
      unmounted = true;
    };
  }, [productId]);

  if (isLoading) {
    return <AppLoader message="Đang tải thông tin sản phẩm..." />;
  }

  if (error || !product) {
    return (
      <FeedbackView
        iconName="alert-circle-outline"
        title="Không tìm thấy sản phẩm"
        subtitle={error || 'Sản phẩm không khả dụng hoặc đã bị gỡ bỏ.'}
        actionText="Quay lại"
        onActionPress={() => navigation.goBack()}
        accentColor={Palette.danger}
      />
    );
  }

  const favorited = isFavorite(product.id);
  const inCartQty = getItemCount(product.id);
  const originalPrice =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    Alert.alert(
      'Thành công',
      `Đã thêm ${quantity} x "${product.title}" vào giỏ hàng!`,
      [
        { text: 'Tiếp tục xem', style: 'cancel' },
        {
          text: 'Xem giỏ hàng',
          onPress: () => navigation.navigate('MainTabs', { screen: 'BasketTab' }),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Image Stage */}
        <View style={styles.imageStage}>
          <Image
            source={{ uri: selectedImage || product.thumbnail }}
            style={styles.mainImage}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.floatingHeartBtn}
            onPress={() => toggleFavorite(product)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={22}
              color={favorited ? Palette.danger : Palette.textBody}
            />
          </TouchableOpacity>

          {/* AI Advisor Floating Action Pill */}
          <TouchableOpacity
            style={styles.aiActionPill}
            onPress={() => setAiModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            <Text style={styles.aiActionPillText}>Hỏi AI</Text>
          </TouchableOpacity>
        </View>

        {/* Gallery Thumbnails */}
        {product.images && product.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailRow}
          >
            {product.images.map((imgUri, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedImage(imgUri)}
                style={[
                  styles.thumbBox,
                  selectedImage === imgUri && styles.thumbBoxSelected,
                ]}
              >
                <Image source={{ uri: imgUri }} style={styles.thumbImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Detail Body */}
        <View style={styles.infoSection}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryBadge}>{product.category.toUpperCase()}</Text>
            {product.brand && <Text style={styles.brandName}>Thương hiệu: {product.brand}</Text>}
          </View>

          <Text style={styles.title}>{product.title}</Text>

          {/* Rating & Stock bar */}
          <View style={styles.ratingBar}>
            <View style={styles.starCluster}>
              <Ionicons name="star" size={16} color={Palette.accent} />
              <Text style={styles.ratingText}>{product.rating.toFixed(1)} / 5.0</Text>
            </View>
            <Text style={styles.reviewCount}>({product.reviews?.length || 0} đánh giá)</Text>
            <View style={styles.stockStatusBadge}>
              <Text style={styles.stockStatusText}>
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </Text>
            </View>
          </View>

          {/* Price display */}
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>${product.price.toFixed(2)}</Text>
            {originalPrice && (
              <>
                <Text style={styles.strikethroughPrice}>${originalPrice.toFixed(2)}</Text>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>
                    Giảm {Math.round(product.discountPercentage)}%
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Guarantee / Shipping Highlights */}
          <View style={styles.highlightsGrid}>
            <View style={styles.highlightItem}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Palette.primary} />
              <Text style={styles.highlightText}>
                {product.warrantyInformation || 'Bảo hành chính hãng'}
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Ionicons name="car-outline" size={18} color={Palette.primary} />
              <Text style={styles.highlightText}>
                {product.shippingInformation || 'Giao hàng tận nơi'}
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Ionicons name="return-up-back-outline" size={18} color={Palette.primary} />
              <Text style={styles.highlightText}>
                {product.returnPolicy || 'Đổi trả miễn phí 30 ngày'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionHeader}>Mô tả sản phẩm</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>

          {/* Customer Reviews snippet */}
          {product.reviews && product.reviews.length > 0 && (
            <View style={styles.reviewsSection}>
              <Text style={styles.sectionHeader}>Đánh giá thực tế từ người mua</Text>
              {product.reviews.map((rev, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewTop}>
                    <Text style={styles.reviewerName}>{rev.reviewerName}</Text>
                    <View style={styles.reviewStars}>
                      {Array.from({ length: 5 }).map((_, sIdx) => (
                        <Ionicons
                          key={sIdx}
                          name="star"
                          size={12}
                          color={sIdx < rev.rating ? Palette.accent : Palette.borderDark}
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Purchase Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityStepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Ionicons
              name="remove"
              size={16}
              color={quantity <= 1 ? Palette.borderDark : Palette.textHeading}
            />
          </TouchableOpacity>
          <Text style={styles.qtyDisplay}>{quantity}</Text>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
          >
            <Ionicons
              name="add"
              size={16}
              color={quantity >= product.stock ? Palette.borderDark : Palette.textHeading}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.ctaButtonWrapper}>
          <PrimaryButton
            label={`Thêm vào giỏ • $${(product.price * quantity).toFixed(2)}`}
            onPress={handleAddToCart}
            variant="solid"
            size="lg"
            icon={<Ionicons name="cart" size={18} color="#FFFFFF" />}
          />
        </View>
      </View>

      {/* AI Advisor Modal */}
      <AiAdvisorModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        product={product}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.surface,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageStage: {
    width: width,
    height: 320,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainImage: {
    width: width - 40,
    height: 280,
  },
  floatingHeartBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiActionPill: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  aiActionPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  thumbnailRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  thumbBox: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Palette.border,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  thumbBoxSelected: {
    borderColor: Palette.primary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.primary,
    backgroundColor: Palette.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  brandName: {
    fontSize: 12,
    color: Palette.textSub,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textHeading,
    lineHeight: 26,
    marginVertical: 6,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  starCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textHeading,
  },
  reviewCount: {
    fontSize: 12,
    color: Palette.textSub,
  },
  stockStatusBadge: {
    marginLeft: 'auto',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stockStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.primaryDark,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  currentPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: Palette.primaryDark,
  },
  strikethroughPrice: {
    fontSize: 16,
    color: Palette.textSub,
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    backgroundColor: Palette.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  saveBadgeText: {
    color: Palette.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  highlightsGrid: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highlightText: {
    fontSize: 13,
    color: Palette.textBody,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textHeading,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Palette.textBody,
    lineHeight: 22,
    marginBottom: 24,
  },
  reviewsSection: {
    marginTop: 12,
  },
  reviewItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textHeading,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 12,
    color: Palette.textBody,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Palette.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  quantityStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyDisplay: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textHeading,
    paddingHorizontal: 12,
    minWidth: 36,
    textAlign: 'center',
  },
  ctaButtonWrapper: {
    flex: 1,
  },
});

export const ProductDetailScreen = ItemDetailScreen;

