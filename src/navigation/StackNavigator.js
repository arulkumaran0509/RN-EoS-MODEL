import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { SplashScreen } from '../screens/SplashScreen';
import { RoleSplashScreen } from '../screens/RoleSplashScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { DrawerNavigator } from './DrawerNavigator';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { OrderDetailsScreen } from '../screens/OrderDetailsScreen';
import { MyOrdersScreen } from '../screens/MyOrdersScreen';
import { ManageOrdersScreen } from '../screens/ManageOrdersScreen';
import { OrderSuccessScreen } from '../screens/OrderSuccessScreen';

const Stack = createNativeStackNavigator();

export const StackNavigator = () => {
  const {
    isAuthenticated,
    isCustomer,
    isAdmin,
    isInitializing,
    completeInitialization,
    splashRole,
    dismissSplash,
  } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {/* 1. App Launch Initial Animated Splash Screen */}
      {isInitializing ? (
        <Stack.Screen name="AppSplash">
          {(props) => (
            <SplashScreen {...props} onFinish={completeInitialization} />
          )}
        </Stack.Screen>
      ) : !isAuthenticated ? (
        // 2. Unauthenticated Stack (Welcome / Sign In / Sign Up)
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ animation: 'fade' }}
        />
      ) : splashRole ? (
        // 3. Post-Login Role-Based Branded Transition Splash Screen (~1.5s)
        <Stack.Screen name="RoleSplash">
          {(props) => (
            <RoleSplashScreen
              {...props}
              role={splashRole}
              onFinish={dismissSplash}
            />
          )}
        </Stack.Screen>
      ) : (
        // 4. Authenticated Main Application Flow
        <>
          <Stack.Screen
            name="Main"
            component={DrawerNavigator}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />

          {/* Customer-only screens */}
          {isCustomer && (
            <>
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ animation: 'slide_from_right' }}
              />
              <Stack.Screen
                name="MyOrders"
                component={MyOrdersScreen}
                options={{ animation: 'slide_from_right' }}
              />
            </>
          )}

          {/* Admin-only screens */}
          {isAdmin && (
            <Stack.Screen
              name="ManageOrders"
              component={ManageOrdersScreen}
              options={{ animation: 'slide_from_right' }}
            />
          )}

          {/* Shared Order Screens */}
          <Stack.Screen
            name="OrderDetails"
            component={OrderDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="OrderConfirmation"
            component={OrderSuccessScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="OrderSuccess"
            component={OrderSuccessScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
