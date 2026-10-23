import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CategorySelector } from '../components/CategorySelector';
import { HeaderBar } from '../components/HeaderBar';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const ProductsScreen = ({ navigation }) => {
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

  // Category counts
  const categoryCounts = {
    All: products.length,
    Fruits: products.filter((p) => p.category === 'Fruits').length,
    Vegetables: products.filter((p) => p.category === 'Vegetables').length,
  };

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
    navigation.navigate('Tabs', { screen: 'My Cart' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.paleMint, COLORS.cream]}
        style={styles.gradient}
      >
        {/* Top Header Bar */}
        <HeaderBar
          title="Daily Grocery Food"
          subtitle="Farm Fresh Catalog"
          showMenu={true}
          rightAction="cart"
          onRightPress={handleCartPress}
          badgeCount={cartItemsCount}
        />

        {/* Search Input Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.sage} style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search fresh fruits, vegetables..."
              placeholderTextColor={COLORS.sage}
              style={styles.searchInput}
              clearButtonMode="while-editing"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Horizontal Category Selector */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          productCounts={categoryCounts}
        />

        {/* Results Count & Filter Status */}
        <View style={styles.resultsBar}>
          <Text style={styles.resultsCountText}>
            Showing <Text style={styles.boldText}>{filteredProducts.length}</Text> of {products.length} products
          </Text>
          {selectedCategory !== 'All' && (
            <TouchableOpacity
              onPress={() => setSelectedCategory('All')}
              style={styles.resetFilterButton}
            >
              <Text style={styles.resetFilterText}>Reset Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Two-Column Product Grid */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isFavorite={isFavorite(item.id)}
              onPress={() => handleProductPress(item)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              onAddToCart={() => handleAddToCart(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No Grocery Items Found</Text>
              <Text style={styles.emptySubtitle}>
                We couldn&apos;t find any items matching &quot;{searchQuery}&quot;. Try searching for Banana, Tomato, or Capsicum.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                style={styles.clearSearchButton}
              >
                <Text style={styles.clearSearchButtonText}>Clear Search &amp; Filters</Text>
              </TouchableOpacity>
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
  searchSection: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: 24,
    paddingHorizontal: 14,
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
  clearButton: {
    padding: 4,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  resultsCountText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  boldText: {
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  resetFilterButton: {
    paddingVertical: 2,
  },
  resetFilterText: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: COLORS.freshLeaf,
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
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  clearSearchButton: {
    backgroundColor: COLORS.pistachio,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  clearSearchButtonText: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
});
