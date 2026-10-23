import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { ImageFallback } from '../components/ImageFallback';
import { COLORS, FONTS } from '../theme/colors';

export const CustomDrawerContent = (props) => {
  const { user, isAdmin, isCustomer, logout } = useAuth();
  const { favoriteProducts, cartItemsCount, orders } = useShop();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const customerOrdersCount = orders.filter(
    (o) =>
      (user?.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.id && o.customerId === user.id)
  ).length;

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
        {/* User Profile Header in Drawer */}
        <View style={styles.header}>
          <View style={styles.avatarRow}>
            <ImageFallback
              source={{ uri: user?.avatar }}
              fallbackEmoji={isAdmin ? '🛡️' : '👤'}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.fullName || 'Daily Grocery'}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user?.email || 'user@grocery.com'}
              </Text>
              <View style={styles.rolePill}>
                <Text style={styles.rolePillText}>
                  {user?.role || 'Guest'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Custom Navigation Items */}
        <View style={styles.navSection}>
          {/* Home */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => props.navigation.navigate('Tabs', { screen: 'Home' })}
          >
            <View style={styles.navIconBox}>
              <Ionicons name="home-outline" size={20} color={COLORS.darkGreen} />
            </View>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          {/* Products Catalog */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => props.navigation.navigate('Products')}
          >
            <View style={styles.navIconBox}>
              <Ionicons name="nutrition-outline" size={20} color={COLORS.freshLeaf} />
            </View>
            <Text style={styles.navLabel}>Products Catalog</Text>
          </TouchableOpacity>

          {/* Favorites (Customer Only) */}
          {isCustomer && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => props.navigation.navigate('Tabs', { screen: 'Favorites' })}
            >
              <View style={[styles.navIconBox, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="heart-outline" size={20} color={COLORS.error} />
              </View>
              <Text style={styles.navLabel}>Favorites</Text>
              {favoriteProducts.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{favoriteProducts.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* My Cart */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => props.navigation.navigate('Tabs', { screen: 'My Cart' })}
          >
            <View style={[styles.navIconBox, { backgroundColor: COLORS.softPistachio }]}>
              <Ionicons name="cart-outline" size={20} color={COLORS.darkGreen} />
            </View>
            <Text style={styles.navLabel}>My Cart</Text>
            {cartItemsCount > 0 && (
              <View style={[styles.countBadge, styles.cartBadge]}>
                <Text style={styles.countBadgeText}>{cartItemsCount} items</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* My Orders (Customer Only) */}
          {isCustomer && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => props.navigation.navigate('Tabs', { screen: 'My Orders' })}
            >
              <View style={styles.navIconBox}>
                <Ionicons name="receipt-outline" size={20} color={COLORS.darkGreen} />
              </View>
              <Text style={styles.navLabel}>My Orders</Text>
              {customerOrdersCount > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{customerOrdersCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Profile (Customer Only) */}
          {isCustomer && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => props.navigation.navigate('Tabs', { screen: 'Profile' })}
            >
              <View style={styles.navIconBox}>
                <Ionicons name="person-outline" size={20} color={COLORS.darkGreen} />
              </View>
              <Text style={styles.navLabel}>My Profile</Text>
            </TouchableOpacity>
          )}

          {/* Manage Orders (Admin Only) */}
          {isAdmin && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => props.navigation.navigate('Tabs', { screen: 'Manage Orders' })}
            >
              <View style={[styles.navIconBox, { backgroundColor: COLORS.softPistachio }]}>
                <Ionicons name="clipboard-outline" size={20} color={COLORS.darkGreen} />
              </View>
              <Text style={[styles.navLabel, { color: COLORS.darkGreen, fontWeight: FONTS.bold }]}>
                Manage Orders
              </Text>
              {pendingOrdersCount > 0 && (
                <View style={[styles.countBadge, { backgroundColor: COLORS.pistachio }]}>
                  <Text style={styles.countBadgeText}>{pendingOrdersCount} pending</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Manage Products (Admin Only) */}
          {isAdmin && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => props.navigation.navigate('Tabs', { screen: 'Manage Products' })}
            >
              <View style={[styles.navIconBox, { backgroundColor: COLORS.softPistachio }]}>
                <Ionicons name="settings-outline" size={20} color={COLORS.darkGreen} />
              </View>
              <Text style={[styles.navLabel, { color: COLORS.darkGreen, fontWeight: FONTS.bold }]}>
                Manage Products
              </Text>
              <View style={[styles.countBadge, { backgroundColor: COLORS.darkGreen }]}>
                <Text style={[styles.countBadgeText, { color: COLORS.white }]}>Admin</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </DrawerContentScrollView>

      {/* Drawer Bottom Logout Section */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleLogout}
          style={styles.logoutBtn}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  drawerScroll: {
    paddingTop: 0,
  },
  header: {
    backgroundColor: COLORS.paleMint,
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.pistachio,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  rolePill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.softPistachio,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  navSection: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginVertical: 2,
  },
  navIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.softPistachio,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: FONTS.semiBold,
    color: COLORS.textPrimary,
  },
  countBadge: {
    backgroundColor: COLORS.softPistachio,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cartBadge: {
    backgroundColor: COLORS.pistachio,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.error,
  },
});
