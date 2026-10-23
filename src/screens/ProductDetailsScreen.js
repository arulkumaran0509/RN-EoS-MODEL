import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { ImageFallback } from '../components/ImageFallback';
import { QuantitySelector } from '../components/QuantitySelector';
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

const { width } = Dimensions.get('window');

export const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { isFavorite, toggleFavorite, addToCart, products, cartItemsCount } = useShop();

  // Selected quantity (kg), min is strictly 1 per assignment requirement
  const [quantity, setQuantity] = useState(1);

  const favorited = isFavorite(product.id);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // Find related products
  const relatedProducts = products.filter(
    (p) => p.id !== product.id && (product.relatedProductIds?.includes(p.id) || p.category === product.category)
  ).slice(0, 4);

  const totalPrice = product.price * quantity;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top Floating Action Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.circleButton}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.darkGreen} />
        </TouchableOpacity>

        <View style={styles.topRightActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleFavorite(product.id)}
            style={styles.circleButton}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={20}
              color={favorited ? COLORS.favorite : COLORS.favoriteInactive}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Main', { screen: 'Tabs', params: { screen: 'My Cart' } })}
            style={[styles.circleButton, styles.cartCircleButton]}
          >
            <Ionicons name="cart-outline" size={20} color={COLORS.darkGreen} />
            {cartItemsCount > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Large Product Hero Image (Natural photo, no green tint) */}
        <View style={styles.imageContainer}>
          <ImageFallback
            source={{ uri: product.imageUrl }}
            fallbackEmoji={product.fallbackEmoji}
            fallbackText={product.name}
            style={styles.productImage}
          />
        </View>

        {/* Content Container Card in Cream Surface */}
        <View style={styles.detailsCard}>
          {/* Category Pill and Rating */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor:
                    product.category === 'Fruits' ? COLORS.fruitBadge : COLORS.vegBadge,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      product.category === 'Fruits'
                        ? COLORS.fruitBadgeText
                        : COLORS.vegBadgeText,
                  },
                ]}
              >
                {product.category}
              </Text>
            </View>

            <View style={styles.ratingBox}>
              <Ionicons name="star" size={16} color={COLORS.freshLeaf} />
              <Text style={styles.ratingNumber}>{product.rating}</Text>
              <Text style={styles.reviewCount}>({product.reviewsCount} reviews)</Text>
            </View>
          </View>

          {/* Product Name */}
          <Text style={styles.productName}>{product.name}</Text>

          {/* Price per Kg */}
          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.currency}>₹</Text>
              <Text style={styles.priceValue}>{product.price}</Text>
              <Text style={styles.priceUnit}>/ {product.unit || 'kg'}</Text>
            </View>

            {/* Quantity Selector: Min is strictly 1 */}
            <QuantitySelector
              quantity={quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              min={1}
              size="large"
            />
          </View>

          {/* Farm Origin & Nutritional Highlights */}
          <View style={styles.metaBox}>
            <View style={styles.metaItem}>
              <Ionicons name="leaf-outline" size={16} color={COLORS.freshLeaf} />
              <Text style={styles.metaText}>{product.origin || 'Organic Certified Farm'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="nutrition-outline" size={16} color={COLORS.darkGreen} />
              <Text style={styles.metaText}>{product.calories || 'Rich in natural vitamins'}</Text>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.descriptionText}>
              {product.description ||
                'Handpicked daily from trusted local sustainable farms. High in essential nutrients, natural hydration, and minerals. Thoroughly cleaned and packaged with care.'}
            </Text>
          </View>

          {/* Storage Advice */}
          {product.storage ? (
            <View style={styles.storageBox}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.darkGreen} />
              <Text style={styles.storageText}>{product.storage}</Text>
            </View>
          ) : null}

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Related Fresh Produce</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedScroll}
              >
                {relatedProducts.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => navigation.push('ProductDetails', { product: item })}
                    style={styles.relatedCard}
                  >
                    <ImageFallback
                      source={{ uri: item.imageUrl }}
                      fallbackEmoji={item.fallbackEmoji}
                      style={styles.relatedImage}
                    />
                    <Text style={styles.relatedName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.relatedPrice}>₹{item.price}/kg</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Add to Cart Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalCalc}>
          <Text style={styles.totalLabel}>Total ({quantity} kg):</Text>
          <Text style={styles.totalAmount}>₹{totalPrice}</Text>
        </View>

        <AppButton
          title="Add to Cart"
          icon="cart"
          variant="primary"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  toastBanner: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    backgroundColor: COLORS.darkGreen,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    gap: 8,
    ...SHADOWS.medium,
  },
  toastText: {
    color: COLORS.white,
    fontWeight: FONTS.bold,
    fontSize: 13,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  circleButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  cartCircleButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.darkGreen,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: FONTS.bold,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: width,
    height: width * 0.75,
    backgroundColor: COLORS.paleMint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softPistachio,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 4,
  },
  ratingNumber: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  reviewCount: {
    fontSize: 11,
    color: COLORS.sage,
  },
  productName: {
    fontSize: 26,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: FONTS.medium,
    color: COLORS.textSecondary,
    marginLeft: 3,
  },
  metaBox: {
    backgroundColor: COLORS.paleMint,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  storageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softPistachio,
    padding: 12,
    borderRadius: 14,
    gap: 8,
    marginBottom: 20,
  },
  storageText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.darkGreen,
    lineHeight: 18,
  },
  relatedSection: {
    marginTop: 10,
  },
  relatedScroll: {
    gap: 12,
    paddingVertical: 6,
  },
  relatedCard: {
    width: 110,
    backgroundColor: COLORS.paleMint,
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  relatedImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginBottom: 6,
  },
  relatedName: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  relatedPrice: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: COLORS.darkGreen,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cream,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.large,
  },
  totalCalc: {
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  addToCartButton: {
    flex: 1,
    marginLeft: 20,
  },
});
