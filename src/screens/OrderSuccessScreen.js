import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppLogo } from '../components/AppLogo';
import { ImageFallback } from '../components/ImageFallback';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const OrderSuccessScreen = ({ route, navigation }) => {
  const { order } = route.params || {};

  // React 19 compliant animation state: initialized with useState factories to avoid ref render-access
  const [scaleAnim] = useState(() => new Animated.Value(0.25));
  const [checkScaleAnim] = useState(() => new Animated.Value(0));
  const [contentFadeAnim] = useState(() => new Animated.Value(0));
  const [contentSlideAnim] = useState(() => new Animated.Value(24));

  useEffect(() => {
    // Smooth centered pop & bounce animation (~700ms total)
    Animated.sequence([
      // 1. Pop & bounce the large green success circle
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 75,
        useNativeDriver: true,
      }),
      // 2. Pulse the white checkmark icon
      Animated.spring(checkScaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 85,
        useNativeDriver: true,
      }),
      // 3. Fade and slide up the order details and texts
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(contentSlideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, checkScaleAnim, contentFadeAnim, contentSlideAnim]);

  // Navigate safely to My Orders (without repeating checkout)
  const handleGoToMyOrders = () => {
    navigation.navigate('Main', {
      screen: 'Tabs',
      params: { screen: 'My Orders' },
    });
  };

  // Navigate safely back to Customer Home and clear checkout screens from stack
  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          params: { screen: 'Tabs', params: { screen: 'Home' } },
        },
      ],
    });
  };

  const statusStyle = COLORS.status[order?.status] || COLORS.status.Pending;
  const orderItems = order?.items || [];
  const totalKg = orderItems.reduce((acc, curr) => acc + (curr.quantity || 1), 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient
        colors={[COLORS.paleMint, COLORS.cream]}
        style={styles.gradient}
      >
        {/* Top-Left Back Arrow Button (Comfortable 44x44 touch target) */}
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleGoToMyOrders}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.backButton}
            accessibilityLabel="Back to My Orders"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.darkGreen} />
          </TouchableOpacity>

          {/* Grocery App Logo Header */}
          <View style={styles.headerLogoWrapper}>
            <AppLogo size={32} showText={false} />
            <Text style={styles.headerBrandTitle}>Daily Grocery</Text>
          </View>

          <View style={styles.topRightSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Centered Pop/Bounce Animation */}
          <View style={styles.animationArea}>
            <Animated.View
              style={[
                styles.successCircleOuter,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <View style={styles.successCircleInner}>
                <Animated.View style={{ transform: [{ scale: checkScaleAnim }] }}>
                  <Ionicons name="checkmark-sharp" size={50} color={COLORS.white} />
                </Animated.View>
              </View>
            </Animated.View>
          </View>

          {/* Animated Text Content (Fades in after pop) */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: contentFadeAnim,
                transform: [{ translateY: contentSlideAnim }],
              },
            ]}
          >
            <Text style={styles.successHeading}>Order Placed Successfully!</Text>
            <Text style={styles.successSubtitle}>
              Thank you for shopping with us.
            </Text>
            <Text style={styles.handpickedMessage}>
              Your fresh organic groceries are being carefully handpicked from the local farm hub.
            </Text>

            {/* Actual Order Details Card */}
            <View style={styles.detailsCard}>
              {/* Order ID & Status Header */}
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.orderLabel}>ORDER ID</Text>
                  <Text style={styles.orderIdText}>{order?.id || order?.orderId || 'ORD-984123'}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: statusStyle.bg,
                      borderColor: statusStyle.border,
                    },
                  ]}
                >
                  <Ionicons name="time-outline" size={13} color={statusStyle.text} />
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {order?.status || 'Pending'}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Order Date & Time */}
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.darkGreen} />
                </View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>Date & Time</Text>
                  <Text style={styles.infoValue}>
                    {order?.date || new Date().toLocaleString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>

              {/* Delivery Service Offer Notice */}
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="flash-outline" size={16} color={COLORS.darkGreen} />
                </View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>Delivery Speed</Text>
                  <Text style={styles.infoValue}>
                    Express Doorstep Delivery • Within 30 Minutes
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Ordered Items Preview */}
              <View style={styles.itemsHeaderRow}>
                <Text style={styles.itemsSectionTitle}>
                  Ordered Groceries ({orderItems.length} items • {totalKg} kg)
                </Text>
              </View>

              {orderItems.map((item, index) => {
                const itemPrice = item.pricePerKg || item.price || item.unitPrice || 0;
                const itemQty = item.quantity || 1;
                const itemSubtotal = item.subtotal || itemPrice * itemQty;

                return (
                  <View
                    key={`${item.productId || index}-${index}`}
                    style={styles.itemRow}
                  >
                    <ImageFallback
                      source={{ uri: item.imageUrl || item.image }}
                      fallbackEmoji={item.fallbackEmoji || '🥗'}
                      style={styles.itemThumb}
                    />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.itemQuantityText}>
                        {itemQty} kg × ₹{itemPrice}
                      </Text>
                    </View>
                    <Text style={styles.itemSubtotalText}>₹{itemSubtotal}</Text>
                  </View>
                );
              })}

              <View style={styles.cardDivider} />

              {/* Total Order Amount */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount Paid</Text>
                <Text style={styles.totalAmountText}>
                  ₹{order?.totalAmount ?? order?.total ?? 0}
                </Text>
              </View>
            </View>

            {/* Action Buttons Section */}
            <View style={styles.actionsContainer}>
              {/* Prominent Full-Width Back to Home Button */}
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleBackToHome}
                style={styles.homeButton}
                accessibilityLabel="Back to Home"
                accessibilityRole="button"
              >
                <Ionicons name="home-outline" size={20} color={COLORS.darkGreen} />
                <Text style={styles.homeButtonText}>Back to Home</Text>
              </TouchableOpacity>

              {/* Secondary View My Orders Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGoToMyOrders}
                style={styles.viewOrdersButton}
                accessibilityLabel="View My Orders"
                accessibilityRole="button"
              >
                <Ionicons name="receipt-outline" size={18} color={COLORS.darkGreen} />
                <Text style={styles.viewOrdersButtonText}>View in My Orders</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  headerLogoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBrandTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    letterSpacing: 0.3,
  },
  topRightSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    alignItems: 'center',
  },
  animationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  successCircleOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(220, 236, 201, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.softPistachio,
    ...SHADOWS.medium,
  },
  successCircleInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  successHeading: {
    fontSize: 22,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    textAlign: 'center',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 15,
    fontWeight: FONTS.semiBold,
    color: COLORS.freshLeaf,
    textAlign: 'center',
    marginBottom: 6,
  },
  handpickedMessage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
    marginBottom: 22,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderLabel: {
    fontSize: 10,
    fontWeight: FONTS.bold,
    color: COLORS.sage,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.softPistachio,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
    marginTop: 1,
  },
  itemsHeaderRow: {
    marginBottom: 10,
  },
  itemsSectionTitle: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: COLORS.paleMint,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  itemQuantityText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  itemSubtotalText: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  homeButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pistachio,
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: '#97B576',
    ...SHADOWS.medium,
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  viewOrdersButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
    paddingVertical: 13,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  viewOrdersButtonText: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
});
