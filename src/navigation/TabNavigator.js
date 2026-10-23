import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { HomeScreen } from '../screens/HomeScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MyOrdersScreen } from '../screens/MyOrdersScreen';
import { ManageOrdersScreen } from '../screens/ManageOrdersScreen';
import { ManageProductsScreen } from '../screens/ManageProductsScreen';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const { isCustomer, user } = useAuth();
  const { cartItemsCount, orders } = useShop();

  // Customer orders count for badge
  const customerOrdersCount = orders.filter(
    (o) =>
      (user?.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.id && o.customerId === user.id)
  ).length;

  // Admin pending orders count for badge
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.darkGreen,       // Green active-tab icons
        tabBarInactiveTintColor: COLORS.sage,         // Sage inactive icons
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      {/* Customer: Favorites | Admin: Manage Orders */}
      {isCustomer ? (
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Manage Orders"
          component={ManageOrdersScreen}
          options={{
            tabBarLabel: 'Orders',
            tabBarBadge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
            tabBarBadgeStyle: styles.badge,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'clipboard' : 'clipboard-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
      )}

      {/* My Cart Tab with Item Count Badge */}
      <Tab.Screen
        name="My Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartItemsCount > 0 ? (cartItemsCount > 99 ? '99+' : cartItemsCount) : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'cart' : 'cart-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      {/* Customer: My Orders | Admin: Manage Products */}
      {isCustomer ? (
        <Tab.Screen
          name="My Orders"
          component={MyOrdersScreen}
          options={{
            tabBarLabel: 'Orders',
            tabBarBadge: customerOrdersCount > 0 ? customerOrdersCount : undefined,
            tabBarBadgeStyle: styles.badge,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'receipt' : 'receipt-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Manage Products"
          component={ManageProductsScreen}
          options={{
            tabBarLabel: 'Manage',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
      )}

      {/* Customer: Profile (Hidden from Admin) */}
      {isCustomer && (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={size || 22}
                color={color}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.cream,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 8,
    height: Platform.OS === 'ios' ? 86 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...SHADOWS.medium,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: FONTS.bold,
  },
  badge: {
    backgroundColor: COLORS.darkGreen,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: FONTS.bold,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
  },
});
