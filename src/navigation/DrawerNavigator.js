import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TabNavigator } from './TabNavigator';
import { ProductsScreen } from '../screens/ProductsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MyOrdersScreen } from '../screens/MyOrdersScreen';
import { ManageOrdersScreen } from '../screens/ManageOrdersScreen';
import { ManageProductsScreen } from '../screens/ManageProductsScreen';
import { CustomDrawerContent } from './CustomDrawerContent';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme/colors';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  const { isCustomer, isAdmin } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.softPistachio,
        drawerActiveTintColor: COLORS.darkGreen,
        drawerInactiveTintColor: COLORS.textPrimary,
        drawerStyle: {
          width: 300,
          backgroundColor: COLORS.cream,
        },
      }}
    >
      {/* Root Tabs */}
      <Drawer.Screen
        name="Tabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'Home',
        }}
      />

      {/* Full Products Catalog */}
      <Drawer.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          drawerLabel: 'Products',
        }}
      />

      {/* Customer Only: Favorites */}
      {isCustomer && (
        <Drawer.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            drawerLabel: 'Favorites',
          }}
        />
      )}

      {/* Cart Screen */}
      <Drawer.Screen
        name="My Cart"
        component={CartScreen}
        options={{
          drawerLabel: 'My Cart',
        }}
      />

      {/* Customer Only: My Orders */}
      {isCustomer && (
        <Drawer.Screen
          name="My Orders"
          component={MyOrdersScreen}
          options={{
            drawerLabel: 'My Orders',
          }}
        />
      )}

      {/* Customer Only: Profile */}
      {isCustomer && (
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerLabel: 'Profile',
          }}
        />
      )}

      {/* Admin Only: Manage Orders */}
      {isAdmin && (
        <Drawer.Screen
          name="Manage Orders"
          component={ManageOrdersScreen}
          options={{
            drawerLabel: 'Manage Orders',
          }}
        />
      )}

      {/* Admin Only: Manage Products */}
      {isAdmin && (
        <Drawer.Screen
          name="Manage Products"
          component={ManageProductsScreen}
          options={{
            drawerLabel: 'Manage Products',
          }}
        />
      )}
    </Drawer.Navigator>
  );
};
