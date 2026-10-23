import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useShop, ORDER_STATUSES } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBar } from '../components/HeaderBar';
import { ImageFallback } from '../components/ImageFallback';
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params || {};
  const { orders, updateOrderStatus } = useShop();
  const { isAdmin } = useAuth();

  // Find latest order from live state
  const order = orders.find((o) => o.id === orderId || o.orderId === orderId);

  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'Pending');

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar title="Order Details" showBack={true} showMenu={false} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundEmoji}>📦</Text>
          <Text style={styles.notFoundTitle}>Order Not Found</Text>
          <Text style={styles.notFoundSubtitle}>
            The requested order ID could not be located in the current session.
          </Text>
          <AppButton
            title="Go Back"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const currentStatusStyle = COLORS.status[order.status] || COLORS.status.Pending;

  const handleUpdateStatusConfirm = (newStatus) => {
    Alert.alert(
      'Confirm Status Change',
      `Are you sure you want to change order ${order.orderId} status from "${order.status}" to "${newStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Update',
          onPress: () => {
            const res = updateOrderStatus(order.id, newStatus);
            if (res.success) {
              setStatusModalVisible(false);
              Alert.alert('Status Updated 🎉', `Order status has been updated to "${newStatus}".`);
            } else {
              Alert.alert('Error', res.error || 'Failed to update order status.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.paleMint, COLORS.cream]}
        style={styles.gradient}
      >
        <HeaderBar
          title="Order Details"
          subtitle={order.orderId || order.id}
          showBack={true}
          showMenu={false}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Top Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabel}>Current Order Status</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: currentStatusStyle.bg,
                      borderColor: currentStatusStyle.border,
                    },
                  ]}
                >
                  <Text style={[styles.statusText, { color: currentStatusStyle.text }]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              {isAdmin && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setStatusModalVisible(true)}
                  style={styles.updateStatusButton}
                >
                  <Ionicons name="create-outline" size={16} color={COLORS.darkGreen} />
                  <Text style={styles.updateStatusButtonText}>Update Status</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.metaRow}>
              <View>
                <Text style={styles.metaLabel}>Order Placed On</Text>
                <Text style={styles.metaValue}>{order.date || 'Recent'}</Text>
              </View>
              <View>
                <Text style={styles.metaLabel}>Order ID</Text>
                <Text style={styles.metaValue}>{order.orderId || order.id}</Text>
              </View>
            </View>
          </View>

          {/* Customer Information Card in Cream Surface */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="person-circle-outline" size={20} color={COLORS.darkGreen} />
              <Text style={styles.cardSectionTitle}>Customer Information</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Full Name:</Text>
              <Text style={styles.infoVal}>{order.customerName || 'Customer'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Email Address:</Text>
              <Text style={styles.infoVal}>{order.customerEmail || 'customer@grocery.com'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Phone Number:</Text>
              <Text style={styles.infoVal}>{order.customerPhone || 'Not provided'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Delivery Address:</Text>
              <Text style={styles.infoVal}>{order.deliveryAddress || 'Doorstep Delivery'}</Text>
            </View>
          </View>

          {/* Ordered Products Items List (Natural photos, no green tint) */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="basket-outline" size={20} color={COLORS.darkGreen} />
              <Text style={styles.cardSectionTitle}>Ordered Items ({order.items?.length || 0})</Text>
            </View>

            {order.items?.map((item, idx) => (
              <View key={`${item.productId}-${idx}`} style={styles.productRow}>
                <View style={styles.productThumbWrapper}>
                  <ImageFallback
                    source={{ uri: item.imageUrl || item.image }}
                    fallbackEmoji={item.fallbackEmoji || '🥗'}
                    style={styles.productThumb}
                  />
                </View>

                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productUnitPrice}>
                    ₹{item.pricePerKg || item.price} / {item.unit || 'kg'}
                  </Text>
                  <Text style={styles.productQty}>
                    Quantity: <Text style={styles.bold}>{item.quantity} {item.unit || 'kg'}</Text>
                  </Text>
                </View>

                <Text style={styles.productSubtotal}>
                  ₹{item.subtotal || (item.pricePerKg || item.price) * item.quantity}
                </Text>
              </View>
            ))}
          </View>

          {/* Payment & Price Breakdown */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="receipt-outline" size={20} color={COLORS.darkGreen} />
              <Text style={styles.cardSectionTitle}>Payment &amp; Cost Breakdown</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Items Subtotal</Text>
              <Text style={styles.billValue}>₹{order.subtotal || 0}</Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>
                {order.deliveryFee === 0 ? <Text style={styles.freeGreen}>FREE</Text> : `₹${order.deliveryFee}`}
              </Text>
            </View>

            {order.discount > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Discount Savings</Text>
                <Text style={styles.savingsValue}>- ₹{order.discount}</Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>₹{order.totalAmount || order.total || 0}</Text>
            </View>

            <View style={styles.paymentMethodBox}>
              <Ionicons name="cash-outline" size={18} color={COLORS.darkGreen} />
              <Text style={styles.paymentMethodText}>Payment Method: Cash on Delivery / Simulated</Text>
            </View>
          </View>
        </ScrollView>

        {/* Admin Status Update Modal */}
        {isAdmin && (
          <Modal
            visible={statusModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setStatusModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Update Order Status</Text>
                  <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                    <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalSubtitle}>
                  Select new status for Order <Text style={styles.bold}>{order.orderId}</Text>:
                </Text>

                <View style={styles.statusOptionsList}>
                  {ORDER_STATUSES.map((statusOption) => {
                    const optionStyle = COLORS.status[statusOption] || COLORS.status.Pending;
                    const isSelected = selectedStatus === statusOption;

                    return (
                      <TouchableOpacity
                        key={statusOption}
                        activeOpacity={0.8}
                        onPress={() => setSelectedStatus(statusOption)}
                        style={[
                          styles.statusOptionItem,
                          isSelected && styles.statusOptionItemSelected,
                          { borderColor: isSelected ? COLORS.pistachio : COLORS.border },
                        ]}
                      >
                        <View style={styles.statusOptionLeft}>
                          <View
                            style={[
                              styles.statusDot,
                              { backgroundColor: optionStyle.text },
                            ]}
                          />
                          <Text style={[styles.statusOptionName, isSelected && styles.bold]}>
                            {statusOption}
                          </Text>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={20} color={COLORS.darkGreen} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.modalButtonsRow}>
                  <AppButton
                    title="Cancel"
                    variant="outline"
                    onPress={() => setStatusModalVisible(false)}
                    style={styles.modalCancelBtn}
                  />
                  <AppButton
                    title="Apply New Status"
                    variant="primary"
                    onPress={() => handleUpdateStatusConfirm(selectedStatus)}
                    style={styles.modalApplyBtn}
                  />
                </View>
              </View>
            </View>
          </Modal>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 13,
    fontWeight: FONTS.bold,
  },
  updateStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pistachio,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
    ...SHADOWS.small,
  },
  updateStatusButtonText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  infoKey: {
    width: 120,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  infoVal: {
    flex: 1,
    fontSize: 13,
    fontWeight: FONTS.medium,
    color: COLORS.textPrimary,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  productThumbWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.paleMint,
  },
  productThumb: {
    width: '100%',
    height: '100%',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  productUnitPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  productQty: {
    fontSize: 11,
    color: COLORS.sage,
    marginTop: 2,
  },
  bold: {
    fontWeight: FONTS.bold,
  },
  productSubtotal: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  paymentMethodBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.softPistachio,
    padding: 10,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  paymentMethodText: {
    fontSize: 12,
    color: COLORS.darkGreen,
    fontWeight: FONTS.medium,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  notFoundEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 6,
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    minWidth: 160,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(38, 53, 40, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  statusOptionsList: {
    gap: 8,
    marginBottom: 20,
  },
  statusOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: COLORS.paleMint,
  },
  statusOptionItemSelected: {
    backgroundColor: COLORS.softPistachio,
  },
  statusOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusOptionName: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
  },
  modalApplyBtn: {
    flex: 1.4,
  },
});
