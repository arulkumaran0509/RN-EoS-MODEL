import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { CATEGORIES } from '../data/products';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const CategorySelector = ({
  selectedCategory,
  onSelectCategory,
  productCounts = {},
}) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'All':
        return '🛒';
      case 'Fruits':
        return '🍎';
      case 'Vegetables':
        return '🥦';
      default:
        return '🥗';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          const count = productCounts[category];

          return (
            <TouchableOpacity
              key={category}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(category)}
              style={[
                styles.categoryPill,
                isSelected ? styles.activePill : styles.inactivePill,
              ]}
            >
              <Text style={styles.categoryIcon}>{getCategoryIcon(category)}</Text>
              <Text
                style={[
                  styles.categoryText,
                  isSelected ? styles.activeText : styles.inactiveText,
                ]}
              >
                {category}
              </Text>
              {count !== undefined ? (
                <View
                  style={[
                    styles.countBadge,
                    isSelected ? styles.activeCountBadge : styles.inactiveCountBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected ? styles.activeCountText : styles.inactiveCountText,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  activePill: {
    backgroundColor: COLORS.pistachio,
    borderColor: COLORS.pistachio,
    ...SHADOWS.small,
  },
  inactivePill: {
    backgroundColor: COLORS.cream,
    borderColor: COLORS.border,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: FONTS.semiBold,
  },
  activeText: {
    color: COLORS.darkGreen,
    fontWeight: FONTS.bold,
  },
  inactiveText: {
    color: COLORS.textSecondary,
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeCountBadge: {
    backgroundColor: COLORS.darkGreen,
  },
  inactiveCountBadge: {
    backgroundColor: COLORS.softPistachio,
  },
  countText: {
    fontSize: 11,
    fontWeight: FONTS.bold,
  },
  activeCountText: {
    color: COLORS.white,
  },
  inactiveCountText: {
    color: COLORS.darkGreen,
  },
});
