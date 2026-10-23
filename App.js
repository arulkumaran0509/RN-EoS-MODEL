import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ShopProvider } from './src/context/ShopContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ShopProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </ShopProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
