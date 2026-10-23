import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { HeaderBar } from '../components/HeaderBar';
import { CategorySelector } from '../components/CategorySelector';
import { ProductCard } from '../components/ProductCard';
import { GroceryBannerSlider } from '../components/GroceryBannerSlider';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const {
    products,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isFavorite,
    toggleFavorite,
    addToCart,
    cartItemsCount,
  } = useShop();

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleToggleFavorite = (productId) => {
    toggleFavorite(productId);
  };

  const handleCartPress = () => {
    navigation.navigate('My Cart');
  };

  // Group products for 2-column grid rendering inside ScrollView
  const renderProductRows = (items) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      const item1 = items[i];
      const item2 = items[i + 1];
      rows.push(
        <View key={`row-${item1.id}`} style={styles.productRow}>
          <ProductCard
            product={item1}
            isFavorite={isFavorite(item1.id)}
            onPress={() => handleProductPress(item1)}
            onToggleFavorite={() => handleToggleFavorite(item1.id)}
            onAddToCart={() => handleAddToCart(item1)}
          />
          {item2 ? (
            <ProductCard
              product={item2}
              isFavorite={isFavorite(item2.id)}
              onPress={() => handleProductPress(item2)}
              onToggleFavorite={() => handleToggleFavorite(item2.id)}
              onAddToCart={() => handleAddToCart(item2)}
            />
          ) : (
            <View style={{ width: (width - 44) / 2 }} />
          )}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.paleMint, COLORS.cream]}
        style={styles.gradient}
      >
        {/* Top App Header with Menu and Cart */}
        <HeaderBar
          title="Daily Grocery Food"
          subtitle={`Welcome, ${user?.fullName?.split(' ')[0] || 'Shopper'}!`}
          showMenu={true}
          rightAction="cart"
          onRightPress={handleCartPress}
          badgeCount={cartItemsCount}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Input Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.sage} style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search banana, pineapple, tomato..."
              placeholderTextColor={COLORS.sage}
              style={styles.searchInput}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchIcon}>
                <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* 4-Slide Auto-Scrolling Grocery Banner Slider */}
          <GroceryBannerSlider
            navigation={navigation}
            onSelectCategory={setSelectedCategory}
            onNavigateAll={() => {
              setSelectedCategory('All');
              navigation.navigate('Products');
            }}
          />

          {/* Category Chips Bar */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAllText}>See All ({products.length})</Text>
            </TouchableOpacity>
          </View>

          <CategorySelector
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Products Grid Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'Popular Groceries' : `${selectedCategory} Specials`}
            </Text>
            <Text style={styles.productCountBadge}>{filteredProducts.length} Items</Text>
          </View>

          {/* Grid Rows */}
          {filteredProducts.length > 0 ? (
            <View style={styles.gridContainer}>
              {renderProductRows(filteredProducts)}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🥬</Text>
              <Text style={styles.emptyTitle}>No matching products</Text>
              <Text style={styles.emptySubtitle}>Try searching for another grocery item.</Text>
            </View>
          )}
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
    paddingBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: 24,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  clearSearchIcon: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: COLORS.freshLeaf,
  },
  productCountBadge: {
    fontSize: 12,
    fontWeight: FONTS.medium,
    color: COLORS.darkGreen,
    backgroundColor: COLORS.softPistachio,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  gridContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
