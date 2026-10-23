import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const ProfileScreen = ({ navigation }) => {
  const { user, isAdmin, logout } = useAuth();
  const { favoriteProducts, cartItemsCount, orders } = useShop();

  const customerOrders = orders.filter(
    (o) =>
      (user?.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.id && o.customerId === user.id)
  );

  // Guard: Admin restriction per requirement: "Admin users must not access the customer profile screens."
  if (isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar title="Profile" showMenu={true} />
        <View style={styles.guardContainer}>
          <Text style={styles.guardEmoji}>🛡️</Text>
          <Text style={styles.guardTitle}>Admin Role Active</Text>
          <Text style={styles.guardSubtitle}>
            Customer Profile is disabled for Administrator accounts. Please access Manage Products from the drawer.
          </Text>
          <AppButton
            title="Go to Manage Products"
            variant="primary"
            onPress={() => navigation.navigate('Manage Products')}
            style={styles.guardButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out of Daily Grocery Food?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: logout,
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
        {/* Header Bar */}
        <HeaderBar
          title="Customer Profile"
          showMenu={true}
          rightAction="cart"
          onRightPress={() => navigation.navigate('My Cart')}
          badgeCount={cartItemsCount}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Profile Card in Cream Surface */}
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <ImageFallback
                source={{ uri: user?.avatar }}
                fallbackEmoji="👤"
                style={styles.avatar}
              />
              <View style={styles.roleBadge}>
                <Ionicons name="sparkles" size={12} color={COLORS.darkGreen} />
                <Text style={styles.roleBadgeText}>Customer</Text>
              </View>
            </View>

            <Text style={styles.userName}>{user?.fullName || 'Valued Customer'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'customer@grocery.com'}</Text>
            <Text style={styles.userPhone}>📞 {user?.phone || '+91 98765 43210'}</Text>

            {/* Edit Profile Action */}
            <AppButton
              title="Edit Profile"
              icon="create-outline"
              variant="outline"
              size="small"
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.editButton}
            />
          </View>

          {/* Quick Account Statistics */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{customerOrders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{favoriteProducts.length}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{cartItemsCount}</Text>
              <Text style={styles.statLabel}>In Cart (kg)</Text>
            </View>
          </View>

          {/* Account Details & Options */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Account Options</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('My Orders')}
              style={styles.menuItem}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: COLORS.softPistachio }]}>
                <Ionicons name="receipt" size={18} color={COLORS.darkGreen} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>My Orders</Text>
                <Text style={styles.menuSubtitle}>{customerOrders.length} placed order(s)</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sage} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Favorites')}
              style={styles.menuItem}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="heart" size={18} color={COLORS.error} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>My Saved Favorites</Text>
                <Text style={styles.menuSubtitle}>{favoriteProducts.length} items saved</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sage} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('My Cart')}
              style={styles.menuItem}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: COLORS.softPistachio }]}>
                <Ionicons name="cart" size={18} color={COLORS.darkGreen} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>My Shopping Cart</Text>
                <Text style={styles.menuSubtitle}>{cartItemsCount} kg total produce</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sage} />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                Alert.alert(
                  'Doorstep Delivery Address',
                  'Saved address: 42 Palm Grove Avenue, Green Acres, Bengaluru - 560001.'
                );
              }}
              style={styles.menuItem}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: COLORS.paleMint }]}>
                <Ionicons name="location" size={18} color={COLORS.freshLeaf} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Delivery Address</Text>
                <Text style={styles.menuSubtitle}>Manage doorstep address</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.sage} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <AppButton
            title="Log Out"
            icon="log-out-outline"
            variant="danger"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: COLORS.pistachio,
  },
  roleBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    backgroundColor: COLORS.softPistachio,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.pistachio,
    ...SHADOWS.small,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  userName: {
    fontSize: 22,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: COLORS.sage,
    marginBottom: 16,
  },
  editButton: {
    minWidth: 150,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.cream,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
  },
  menuSection: {
    backgroundColor: COLORS.cream,
    borderRadius: 22,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  logoutButton: {
    marginTop: 14,
    marginBottom: 30,
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
