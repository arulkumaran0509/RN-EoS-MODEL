import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBar } from '../components/HeaderBar';
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const MyOrdersScreen = ({ navigation }) => {
  const { orders, cartItemsCount } = useShop();
  const { user, isAdmin } = useAuth();

  // Guard against Admin accessing customer-specific orders screen
  if (isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar title="My Orders" showMenu={true} />
        <View style={styles.guardContainer}>
          <Text style={styles.guardEmoji}>🛡️</Text>
          <Text style={styles.guardTitle}>Admin Role Active</Text>
          <Text style={styles.guardSubtitle}>
            To view and manage all customer orders, please visit the Manage Orders dashboard.
          </Text>
          <AppButton
            title="Go to Manage Orders"
            variant="primary"
            onPress={() => navigation.navigate('Manage Orders')}
            style={styles.guardButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Filter orders strictly belonging to the currently logged in customer
  const customerOrders = orders.filter((order) => {
    if (!user) return false;
    const matchEmail =
      order.customerEmail &&
      user.email &&
      order.customerEmail.toLowerCase() === user.email.toLowerCase();
    const matchId = order.customerId && user.id && order.customerId === user.id;
    return matchEmail || matchId;
  });

  const getStatusStyle = (status) => {
    return COLORS.status[status] || COLORS.status.Pending;
  };

  const renderOrderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    const totalItemsKg = item.items?.reduce((acc, curr) => acc + (curr.quantity || 1), 0) || 0;

    return (
      <View style={styles.orderCard}>
        {/* Card Header: Order ID & Status Badge */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderIdText}>{item.orderId || item.id}</Text>
            <Text style={styles.orderDateText}>{item.date || 'Recent Order'}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyle.bg,
                borderColor: statusStyle.border,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Products Summary */}
        <View style={styles.productsSummary}>
          <Text style={styles.productCountText}>
            🛍️ <Text style={styles.bold}>{item.items?.length || 0}</Text> product(s) ({totalItemsKg} kg total)
          </Text>
          <Text style={styles.itemsListText} numberOfLines={2}>
            {item.items?.map((p) => `${p.name} (${p.quantity} kg)`).join(' • ') || 'Fresh produce items'}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Card Footer: Total Amount & View Details Button */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{item.totalAmount || item.total || 0}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id || item.orderId })}
            style={styles.detailsButton}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.darkGreen} />
          </TouchableOpacity>
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
        <HeaderBar
          title="My Orders"
          subtitle={`${customerOrders.length} Orders Placed`}
          showMenu={true}
          rightAction="cart"
          onRightPress={() => navigation.navigate('Tabs', { screen: 'My Cart' })}
          badgeCount={cartItemsCount}
        />

        <FlatList
          data={customerOrders}
          keyExtractor={(item) => item.id || item.orderId}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="receipt-outline" size={54} color={COLORS.favoriteInactive} />
              </View>
              <Text style={styles.emptyTitle}>You haven&apos;t placed any orders yet.</Text>
              <Text style={styles.emptySubtitle}>
                Add fresh fruits and vegetables to your shopping cart and place your first organic produce order!
              </Text>
              <AppButton
                title="Browse Fresh Groceries"
                icon="basket"
                variant="primary"
                onPress={() => navigation.navigate('Home')}
                style={styles.browseButton}
              />
            </View>
          }
        />
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  orderDateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  productsSummary: {
    marginVertical: 2,
  },
  productCountText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  bold: {
    fontWeight: FONTS.bold,
  },
  itemsListText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pistachio,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 4,
    ...SHADOWS.small,
  },
  detailsButtonText: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  browseButton: {
    minWidth: 220,
  },
  guardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  guardEmoji: {
    fontSize: 48,
    marginBottom: 14,
  },
  guardTitle: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 8,
  },
  guardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  guardButton: {
    minWidth: 220,
  },
});
