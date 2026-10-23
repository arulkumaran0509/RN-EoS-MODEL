import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useShop, ORDER_STATUSES } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBar } from '../components/HeaderBar';
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

const FILTER_TABS = ['All Orders', ...ORDER_STATUSES];

export const ManageOrdersScreen = ({ navigation }) => {
  const { orders } = useShop();
  const { isAdmin } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Orders');

  // Dashboard Summary Metrics calculated dynamically
  const metrics = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'Pending').length;
    const confirmed = orders.filter((o) => o.status === 'Confirmed').length;
    const delivered = orders.filter((o) => o.status === 'Delivered').length;
    const cancelled = orders.filter((o) => o.status === 'Cancelled').length;

    return { total, pending, confirmed, delivered, cancelled };
  }, [orders]);

  // Filtered & Searchable Orders list (Sorted Newest First)
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders
      .filter((order) => {
        // Search by Order ID, Customer name, Customer email
        const matchesQuery =
          !query ||
          (order.orderId && order.orderId.toLowerCase().includes(query)) ||
          (order.id && order.id.toLowerCase().includes(query)) ||
          (order.customerName && order.customerName.toLowerCase().includes(query)) ||
          (order.customerEmail && order.customerEmail.toLowerCase().includes(query));

        // Filter by Status
        const matchesStatus =
          selectedStatusFilter === 'All Orders' || order.status === selectedStatusFilter;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, searchQuery, selectedStatusFilter]);

  // Guard against non-admin
  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar title="Manage Orders" showMenu={true} />
        <View style={styles.guardContainer}>
          <Text style={styles.guardEmoji}>🔒</Text>
          <Text style={styles.guardTitle}>Admin Privilege Required</Text>
          <Text style={styles.guardSubtitle}>
            Only store administrators can view customer orders and update dispatch statuses.
          </Text>
          <AppButton
            title="Return to Store"
            variant="primary"
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
            style={styles.guardButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusBadgeStyle = (status) => {
    return COLORS.status[status] || COLORS.status.Pending;
  };

  const renderOrderItem = ({ item }) => {
    const statusStyle = getStatusBadgeStyle(item.status);
    const totalItemsKg = item.items?.reduce((acc, curr) => acc + (curr.quantity || 1), 0) || 0;

    return (
      <View style={styles.orderCard}>
        {/* Card Header: Order ID & Status */}
        <View style={styles.cardHeader}>
          <View style={styles.idContainer}>
            <Text style={styles.orderIdText}>{item.orderId || item.id}</Text>
            <Text style={styles.orderDateText}>{item.date || 'Recent'}</Text>
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
            <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Customer Information Row */}
        <View style={styles.customerRow}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniEmoji}>👤</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.customerName || 'Customer'}</Text>
            <Text style={styles.customerEmail}>{item.customerEmail || 'customer@grocery.com'}</Text>
          </View>
        </View>

        {/* Order Items Info */}
        <View style={styles.itemsRow}>
          <Text style={styles.itemsCountText}>
            📦 <Text style={styles.bold}>{item.items?.length || 0}</Text> product(s) ({totalItemsKg} kg)
          </Text>
          <Text style={styles.itemsListPreview} numberOfLines={1}>
            {item.items?.map((p) => `${p.name} × ${p.quantity}kg`).join(', ')}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Card Footer: Total Amount & View Details Button */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.totalLabel}>Total Order Amount</Text>
            <Text style={styles.totalValue}>₹{item.totalAmount || item.total || 0}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('OrderDetails', { orderId: item.id || item.orderId })}
            style={styles.detailsBtn}
          >
            <Text style={styles.detailsBtnText}>View Details</Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.darkGreen} />
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
          title="Manage Orders"
          subtitle={`Admin Console (${orders.length} Total Orders)`}
          showMenu={true}
        />

        {/* Top Order Dashboard Summary Cards */}
        <View style={styles.metricsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.metricsContainer}
          >
            {/* Total Orders Card */}
            <View style={[styles.metricCard, { borderColor: COLORS.border }]}>
              <View style={[styles.metricIconBox, { backgroundColor: COLORS.softPistachio }]}>
                <Ionicons name="layers-outline" size={18} color={COLORS.darkGreen} />
              </View>
              <Text style={styles.metricNumber}>{metrics.total}</Text>
              <Text style={styles.metricLabel}>Total Orders</Text>
            </View>

            {/* Pending Orders Card */}
            <View style={[styles.metricCard, { borderColor: '#FDE68A' }]}>
              <View style={[styles.metricIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="time-outline" size={18} color="#B45309" />
              </View>
              <Text style={[styles.metricNumber, { color: '#B45309' }]}>{metrics.pending}</Text>
              <Text style={styles.metricLabel}>Pending</Text>
            </View>

            {/* Confirmed Orders Card */}
            <View style={[styles.metricCard, { borderColor: '#BFDBFE' }]}>
              <View style={[styles.metricIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#1D4ED8" />
              </View>
              <Text style={[styles.metricNumber, { color: '#1D4ED8' }]}>{metrics.confirmed}</Text>
              <Text style={styles.metricLabel}>Confirmed</Text>
            </View>

            {/* Delivered Orders Card */}
            <View style={[styles.metricCard, { borderColor: COLORS.pistachio }]}>
              <View style={[styles.metricIconBox, { backgroundColor: COLORS.softPistachio }]}>
                <Ionicons name="bicycle-outline" size={18} color={COLORS.success} />
              </View>
              <Text style={[styles.metricNumber, { color: COLORS.success }]}>{metrics.delivered}</Text>
              <Text style={styles.metricLabel}>Delivered</Text>
            </View>

            {/* Cancelled Orders Card */}
            <View style={[styles.metricCard, { borderColor: '#FECACA' }]}>
              <View style={[styles.metricIconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="close-circle-outline" size={18} color={COLORS.error} />
              </View>
              <Text style={[styles.metricNumber, { color: COLORS.error }]}>{metrics.cancelled}</Text>
              <Text style={styles.metricLabel}>Cancelled</Text>
            </View>
          </ScrollView>
        </View>

        {/* Search Bar for Orders */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={COLORS.sage} style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by Order ID, name, email..."
              placeholderTextColor={COLORS.sage}
              style={styles.searchInput}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Filter Chips Bar */}
        <View style={styles.filterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTER_TABS.map((filter) => {
              const isActive = selectedStatusFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  activeOpacity={0.7}
                  onPress={() => setSelectedStatusFilter(filter)}
                  style={[
                    styles.filterChip,
                    isActive ? styles.filterChipActive : styles.filterChipInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isActive ? styles.filterChipTextActive : styles.filterChipTextInactive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Customer Orders List */}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id || item.orderId}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="file-tray-outline" size={50} color={COLORS.favoriteInactive} />
              </View>
              <Text style={styles.emptyTitle}>No customer orders available.</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || selectedStatusFilter !== 'All Orders'
                  ? 'No orders match your active filter and search criteria.'
                  : 'Customer orders will appear here automatically when placed from the store.'}
              </Text>
              {(searchQuery || selectedStatusFilter !== 'All Orders') && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedStatusFilter('All Orders');
                  }}
                  style={styles.resetFilterBtn}
                >
                  <Text style={styles.resetFilterBtnText}>Reset Filter &amp; Search</Text>
                </TouchableOpacity>
              )}
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
  metricsWrapper: {
    marginVertical: 4,
  },
  metricsContainer: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 4,
  },
  metricCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 105,
    alignItems: 'center',
    borderWidth: 1.5,
    ...SHADOWS.small,
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterBar: {
    marginVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: COLORS.pistachio,
    borderColor: COLORS.pistachio,
    ...SHADOWS.small,
  },
  filterChipInactive: {
    backgroundColor: COLORS.cream,
    borderColor: COLORS.border,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
  },
  filterChipTextActive: {
    color: COLORS.darkGreen,
    fontWeight: FONTS.bold,
  },
  filterChipTextInactive: {
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  orderCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  idContainer: {
    flex: 1,
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  orderDateText: {
    fontSize: 11,
    color: COLORS.sage,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: FONTS.bold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.softPistachio,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarMiniEmoji: {
    fontSize: 15,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  customerEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  itemsRow: {
    marginTop: 8,
  },
  itemsCountText: {
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  bold: {
    fontWeight: FONTS.bold,
  },
  itemsListPreview: {
    fontSize: 11,
    color: COLORS.sage,
    marginTop: 2,
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
  totalValue: {
    fontSize: 17,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pistachio,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
    ...SHADOWS.small,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  resetFilterBtn: {
    backgroundColor: COLORS.pistachio,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  resetFilterBtnText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
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
