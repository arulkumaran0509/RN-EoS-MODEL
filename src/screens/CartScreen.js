import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { HeaderBar } from '../components/HeaderBar';
import { ImageFallback } from '../components/ImageFallback';
import { QuantitySelector } from '../components/QuantitySelector';
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const CartScreen = ({ navigation }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartItemsCount,
    cartSubtotal,
    deliveryFee,
    discount,
    cartTotal,
    placeOrder,
  } = useShop();

  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDecreaseQuantity = (item) => {
    const prodId = item.productId || item.product?.id;
    const prodName = item.name || item.product?.name || 'Produce Item';

    if (item.quantity === 1) {
      Alert.alert(
        'Remove from Cart',
        `Are you sure you want to remove ${prodName} from your cart?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeFromCart(prodId),
          },
        ]
      );
    } else {
      updateCartQuantity(prodId, -1);
    }
  };

  const handleIncreaseQuantity = (item) => {
    const prodId = item.productId || item.product?.id;
    updateCartQuantity(prodId, 1);
  };

  const handleRemoveItem = (item) => {
    const prodId = item.productId || item.product?.id;
    const prodName = item.name || item.product?.name || 'Produce Item';

    Alert.alert(
      'Remove Item',
      `Remove ${prodName} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(prodId),
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    Alert.alert(
      'Clear Shopping Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0 || isSubmitting) return;

    Alert.alert(
      'Confirm Order Placement',
      `Place your grocery order for ${cartItemsCount} kg produce totaling ₹${cartTotal}?`,
      [
        { text: 'Review Cart', style: 'cancel' },
        {
          text: 'Confirm & Place Order',
          onPress: () => {
            setIsSubmitting(true);
            try {
              const createdOrder = placeOrder({ customerUser: user });
              setIsSubmitting(false);

              if (createdOrder) {
                // Navigate automatically to dedicated animated OrderSuccessScreen
                navigation.navigate('OrderSuccess', { order: createdOrder });
              } else {
                Alert.alert(
                  'Order Placement Failed',
                  'Could not create order. Your cart items have been preserved.'
                );
              }
            } catch (_err) {
              setIsSubmitting(false);
              Alert.alert(
                'Order Placement Error',
                'An error occurred while placing your order. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }) => {
    const prod = item.product || {};
    const itemPrice = item.price ?? item.pricePerKg ?? prod.price ?? 0;
    const itemSubtotal = item.subtotal ?? itemPrice * item.quantity;
    const itemName = item.name || prod.name || 'Produce Item';
    const itemImg = item.imageUrl || item.image || prod.imageUrl;
    const itemEmoji = item.fallbackEmoji || prod.fallbackEmoji || '🥗';
    const itemUnit = item.unit || prod.unit || 'kg';

    return (
      <View style={styles.cartCard}>
        {/* Product Thumbnail (Natural photo, no green tint) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ProductDetails', { product: prod.id ? prod : item })}
          style={styles.thumbnailContainer}
        >
          <ImageFallback
            source={{ uri: itemImg }}
            fallbackEmoji={itemEmoji}
            style={styles.thumbnail}
          />
        </TouchableOpacity>

        {/* Item Details */}
        <View style={styles.itemInfo}>
          <View style={styles.itemTitleRow}>
            <Text style={styles.itemName} numberOfLines={1}>
              {itemName}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item)}
              style={styles.trashIconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={`Remove ${itemName} from cart`}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            </TouchableOpacity>
          </View>

          <Text style={styles.unitPriceText}>
            ₹{itemPrice} / {itemUnit}
          </Text>

          {/* Quantity Controls and Subtotal */}
          <View style={styles.controlsRow}>
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={() => handleIncreaseQuantity(item)}
              onDecrease={() => handleDecreaseQuantity(item)}
              min={0}
              size="small"
            />

            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalLabel}>Subtotal: </Text>
              <Text style={styles.subtotalValue}>₹{itemSubtotal}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.paleMint, COLORS.cream]}
        style={styles.gradient}
      >
        {/* Header Bar */}
        <HeaderBar
          title="My Cart"
          subtitle={`${cart.length} items (${cartItemsCount} kg)`}
          showMenu={true}
          rightAction={
            cart.length > 0
              ? () => (
                  <TouchableOpacity onPress={handleClearCart} style={styles.clearHeaderButton}>
                    <Text style={styles.clearHeaderText}>Clear</Text>
                  </TouchableOpacity>
                )
              : null
          }
        />

        {cart.length > 0 ? (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.product.id}
            renderItem={renderCartItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View style={styles.billSection}>
                {/* Free Delivery Notification Banner */}
                {cartSubtotal < 200 ? (
                  <View style={styles.deliveryPromo}>
                    <Ionicons name="bicycle-outline" size={18} color={COLORS.darkGreen} />
                    <Text style={styles.deliveryPromoText}>
                      Add ₹{200 - cartSubtotal} more for <Text style={styles.bold}>FREE Express Delivery!</Text>
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.deliveryPromo, styles.deliveryFree]}>
                    <Ionicons name="checkmark-done" size={18} color={COLORS.darkGreen} />
                    <Text style={styles.deliveryFreeText}>
                      You have unlocked <Text style={styles.bold}>FREE Express Delivery!</Text>
                    </Text>
                  </View>
                )}

                {/* Price Breakdown Card in Cream Surface */}
                <View style={styles.priceBreakdownCard}>
                  <Text style={styles.billTitle}>Bill Summary</Text>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Items Subtotal ({cartItemsCount} kg)</Text>
                    <Text style={styles.billValue}>₹{cartSubtotal}</Text>
                  </View>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    <Text style={styles.billValue}>
                      {deliveryFee === 0 ? (
                        <Text style={styles.freeGreen}>FREE</Text>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </Text>
                  </View>

                  {discount > 0 && (
                    <View style={styles.billRow}>
                      <Text style={styles.billLabel}>Fresh Produce Savings</Text>
                      <Text style={styles.savingsValue}>- ₹{discount}</Text>
                    </View>
                  )}

                  <View style={styles.divider} />

                  <View style={styles.totalRow}>
                    <Text style={styles.grandTotalLabel}>Grand Total</Text>
                    <Text style={styles.grandTotalValue}>₹{cartTotal}</Text>
                  </View>
                </View>

                {/* Buttons: Place Order and Continue Shopping */}
                <View style={styles.buttonsContainer}>
                  <AppButton
                    title={isSubmitting ? 'Placing Order...' : 'Place Order'}
                    icon="bag-check"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={cart.length === 0 || isSubmitting}
                    onPress={handlePlaceOrder}
                    style={styles.checkoutButton}
                  />

                  <AppButton
                    title="Continue Shopping"
                    icon="arrow-back"
                    variant="outline"
                    onPress={() => navigation.navigate('Home')}
                    style={styles.continueShoppingButton}
                  />
                </View>
              </View>
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="cart-outline" size={54} color={COLORS.favoriteInactive} />
            </View>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Looks like you haven&apos;t added any fresh groceries to your cart yet. Discover fresh bananas, tomatoes, and pineapples!
            </Text>
            <AppButton
              title="Start Shopping"
              icon="basket"
              variant="primary"
              onPress={() => navigation.navigate('Home')}
              style={styles.startShoppingButton}
            />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.paleMint,
  },
  gradient: {
    flex: 1,
  },
  clearHeaderButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearHeaderText: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.error,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.paleMint,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  trashIconButton: {
    padding: 4,
  },
  unitPriceText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  subtotalContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  subtotalLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  subtotalValue: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  billSection: {
    marginTop: 12,
  },
  deliveryPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softPistachio,
    padding: 12,
    borderRadius: 14,
    marginBottom: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.pistachio,
  },
  deliveryPromoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.darkGreen,
  },
  deliveryFree: {
    backgroundColor: COLORS.softPistachio,
    borderColor: COLORS.darkGreen,
  },
  deliveryFreeText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.darkGreen,
  },
  bold: {
    fontWeight: FONTS.bold,
  },
  priceBreakdownCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 14,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  billValue: {
    fontSize: 14,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  freeGreen: {
    color: COLORS.success,
    fontWeight: FONTS.bold,
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  grandTotalValue: {
    fontSize: 22,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  buttonsContainer: {
    marginTop: 6,
    marginBottom: 20,
    gap: 10,
  },
  checkoutButton: {
    marginBottom: 0,
  },
  continueShoppingButton: {
    marginBottom: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startShoppingButton: {
    minWidth: 200,
  },
});
