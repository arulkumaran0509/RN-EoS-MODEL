import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageFallback } from './ImageFallback';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 44) / 2; // balanced spacing for 2-column grid

export const ProductCard = ({
  product,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  showRemoveFavorite = false,
  onRemoveFavorite,
}) => {
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e) => {
    e?.stopPropagation?.();
    if (onAddToCart) {
      onAddToCart(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  const handleFavoritePress = (e) => {
    e?.stopPropagation?.();
    if (showRemoveFavorite && onRemoveFavorite) {
      onRemoveFavorite(product.id);
    } else if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const isFruit = product.category === 'Fruits';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.cardContainer}
    >
      {/* Product Image Area with Floating Favorite Button (Natural photo, no green tint) */}
      <View style={styles.imageWrapper}>
        <ImageFallback
          source={{ uri: product.imageUrl }}
          fallbackEmoji={product.fallbackEmoji}
          fallbackText={product.name}
          style={styles.productImage}
        />

        {/* Category Pill Tag */}
        <View
          style={[
            styles.categoryTag,
            { backgroundColor: isFruit ? COLORS.fruitBadge : COLORS.vegBadge },
          ]}
        >
          <Text
            style={[
              styles.categoryTagText,
              { color: isFruit ? COLORS.fruitBadgeText : COLORS.vegBadgeText },
            ]}
          >
            {product.category}
          </Text>
        </View>

        {/* Favorite Heart / Remove Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleFavoritePress}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={showRemoveFavorite ? 'trash-outline' : isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={showRemoveFavorite ? COLORS.error : isFavorite ? COLORS.favorite : COLORS.favoriteInactive}
          />
        </TouchableOpacity>
      </View>

      {/* Card Content Details */}
      <View style={styles.content}>
        {/* Rating and Reviews */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={COLORS.freshLeaf} />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewsText}>({product.reviewsCount})</Text>
        </View>

        {/* Product Name */}
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>

        {/* Price and Add to Cart Section */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.priceValue}>{product.price}</Text>
            <Text style={styles.priceUnit}>/{product.unit || 'kg'}</Text>
          </View>

          {/* Quick Add To Cart Button in Pistachio Green */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAddToCart}
            style={[styles.cartButton, justAdded && styles.cartButtonAdded]}
          >
            <Ionicons
              name={justAdded ? 'checkmark' : 'cart'}
              size={18}
              color={COLORS.darkGreen}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  imageWrapper: {
    width: '100%',
    height: 125,
    position: 'relative',
    backgroundColor: COLORS.paleMint,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  categoryTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: FONTS.bold,
    letterSpacing: 0.3,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  content: {
    padding: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginLeft: 3,
  },
  reviewsText: {
    fontSize: 11,
    color: COLORS.sage,
    marginLeft: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: FONTS.medium,
    color: COLORS.textSecondary,
    marginLeft: 1,
  },
  cartButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.pistachio,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  cartButtonAdded: {
    backgroundColor: COLORS.softPistachio,
  },
});
