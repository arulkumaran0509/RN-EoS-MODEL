import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { AppLogo } from '../components/AppLogo';
import { COLORS, FONTS } from '../theme/colors';

export const SplashScreen = ({ onFinish }) => {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.85));
  const [contentFadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // Smooth parallel entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // After ~1.6s initialization, complete session check
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 1600);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, contentFadeAnim, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paleMint} />

      {/* Decorative Natural Green Background Aura Rings */}
      <View style={styles.decorativeRingLarge} />
      <View style={styles.decorativeRingMedium} />

      {/* Centered Logo with Animated Fade & Spring */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <AppLogo size={96} showBadge={true} />
      </Animated.View>

      {/* App Branding & Loading Indicator */}
      <Animated.View style={[styles.brandingContainer, { opacity: contentFadeAnim }]}>
        <Text style={styles.appName}>Daily Grocery Food</Text>
        <Text style={styles.tagline}>Fresh, Organic &amp; Natural</Text>

        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="small" color={COLORS.darkGreen} />
          <Text style={styles.loadingText}>Preparing store...</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.paleMint,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeRingLarge: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: COLORS.softPistachio,
    opacity: 0.35,
    top: '20%',
  },
  decorativeRingMedium: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.softPistachio,
    opacity: 0.5,
    top: '26%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  brandingContainer: {
    alignItems: 'center',
    marginTop: 22,
    zIndex: 10,
  },
  appName: {
    fontSize: 26,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    letterSpacing: -0.4,
  },
  tagline: {
    fontSize: 13,
    fontWeight: FONTS.medium,
    color: COLORS.sage,
    letterSpacing: 1.2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 28,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium,
  },
});
