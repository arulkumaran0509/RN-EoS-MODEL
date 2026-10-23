import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const HeaderBar = ({
  title = 'Daily Grocery Food',
  subtitle,
  showMenu = true,
  showBack = false,
  onBackPress,
  rightAction, // 'cart', 'search', 'favorite', or custom component
  onRightPress,
  badgeCount = 0,
}) => {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    if (navigation?.openDrawer) {
      navigation.openDrawer();
    }
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerContainer}>
      {/* Left Circular Action: Menu or Back */}
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBackPress}
            style={styles.circularButton}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.darkGreen} />
          </TouchableOpacity>
        ) : showMenu ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleMenuPress}
            style={styles.circularButton}
          >
            <Ionicons name="menu-outline" size={22} color={COLORS.darkGreen} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Center Title and Subtitle */}
      <View style={styles.centerContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right Circular Action */}
      <View style={styles.rightContainer}>
        {rightAction === 'cart' ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightPress}
            style={styles.circularButton}
          >
            <Ionicons name="cart-outline" size={20} color={COLORS.darkGreen} />
            {badgeCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {badgeCount > 99 ? '99+' : badgeCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        ) : rightAction === 'search' ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightPress}
            style={styles.circularButton}
          >
            <Ionicons name="search-outline" size={20} color={COLORS.darkGreen} />
          </TouchableOpacity>
        ) : rightAction === 'favorite' ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onRightPress}
            style={styles.circularButton}
          >
            <Ionicons name="heart-outline" size={20} color={COLORS.darkGreen} />
          </TouchableOpacity>
        ) : typeof rightAction === 'function' ? (
          rightAction()
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  circularButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  title: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.darkGreen,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: FONTS.bold,
  },
});
