import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { HeaderBar } from '../components/HeaderBar';
import { ProductCard } from '../components/ProductCard';
import { AppButton } from '../components/AppButton';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const FavoritesScreen = ({ navigation }) => {
  const { favoriteProducts, removeFavorite, clearFavorites, addToCart, cartItemsCount } = useShop();
  const { isAdmin } = useAuth();

  // If Admin attempts access, display permission guard
  if (isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar title="Favorites" showMenu={true} />
        <View style={styles.guardContainer}>
          <Text style={styles.guardEmoji}>🔒</Text>
          <Text style={styles.guardTitle}>Admin Access Restricted</Text>
          <Text style={styles.guardSubtitle}>
            Favorites are only available for Customer accounts. Admins can manage the grocery catalog in the Manage Products tab.
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

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleRemoveFavorite = (productId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this item from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(productId) },
      ]
    );
  };

  const handleClearAll = () => {
    if (favoriteProducts.length === 0) return;
    Alert.alert(
      'Clear All Favorites',
      'Do you want to clear all items from your favorites list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearFavorites },
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
          title="Favorites"
          subtitle={`${favoriteProducts.length} Saved Items`}
          showMenu={true}
          rightAction="cart"
          onRightPress={() => navigation.navigate('My Cart')}
          badgeCount={cartItemsCount}
        />

        {favoriteProducts.length > 0 && (
          <View style={styles.topInfoBar}>
            <Text style={styles.infoText}>
              Tap the heart or trash to remove items
            </Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2-Column Grid of Favorite Grocery Products */}
        <FlatList
          data={favoriteProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isFavorite={true}
              showRemoveFavorite={true}
              onPress={() => handleProductPress(item)}
              onRemoveFavorite={() => handleRemoveFavorite(item.id)}
              onAddToCart={() => handleAddToCart(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="heart-dislike-outline" size={54} color={COLORS.favoriteInactive} />
              </View>
              <Text style={styles.emptyTitle}>Your Favorites is Empty</Text>
              <Text style={styles.emptySubtitle}>
                You haven&apos;t saved any fresh fruits or vegetables yet. Tap the heart icon on any product to keep it handy here!
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
  topInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: COLORS.error,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
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
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
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
