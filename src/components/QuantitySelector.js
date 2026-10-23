import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  unit = 'kg',
  size = 'medium', // 'small' (cart/card) or 'large' (product details)
  disabled = false,
}) => {
  const isLarge = size === 'large';
  const isAtMin = quantity <= min;

  return (
    <View style={[styles.container, isLarge ? styles.containerLarge : styles.containerSmall]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrease}
        disabled={disabled || (min !== 0 && isAtMin)}
        style={[
          styles.button,
          isLarge ? styles.buttonLarge : styles.buttonSmall,
          min !== 0 && isAtMin ? styles.buttonDisabled : null,
        ]}
      >
        <Ionicons
          name={isAtMin && min === 0 ? 'trash-outline' : 'remove'}
          size={isLarge ? 20 : 16}
          color={isAtMin && min === 0 ? COLORS.error : min !== 0 && isAtMin ? COLORS.sage : COLORS.darkGreen}
        />
      </TouchableOpacity>

      <View style={styles.quantityDisplay}>
        <Text style={[styles.quantityText, isLarge ? styles.quantityTextLarge : styles.quantityTextSmall]}>
          {quantity}
        </Text>
        {unit ? (
          <Text style={[styles.unitText, isLarge ? styles.unitTextLarge : styles.unitTextSmall]}>
            {unit}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrease}
        disabled={disabled}
        style={[styles.button, styles.addButton, isLarge ? styles.buttonLarge : styles.buttonSmall]}
      >
        <Ionicons name="add" size={isLarge ? 20 : 16} color={COLORS.darkGreen} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.paleMint,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  containerSmall: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  containerLarge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    ...SHADOWS.small,
    backgroundColor: COLORS.cream,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: 20,
    ...SHADOWS.small,
  },
  addButton: {
    backgroundColor: COLORS.pistachio,
  },
  buttonSmall: {
    width: 28,
    height: 28,
  },
  buttonLarge: {
    width: 40,
    height: 40,
  },
  buttonDisabled: {
    backgroundColor: COLORS.paleMint,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  quantityDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 12,
    justifyContent: 'center',
    minWidth: 44,
  },
  quantityText: {
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
  },
  quantityTextSmall: {
    fontSize: 14,
  },
  quantityTextLarge: {
    fontSize: 18,
  },
  unitText: {
    color: COLORS.textSecondary,
    marginLeft: 3,
  },
  unitTextSmall: {
    fontSize: 11,
  },
  unitTextLarge: {
    fontSize: 13,
    fontWeight: FONTS.medium,
  },
});
