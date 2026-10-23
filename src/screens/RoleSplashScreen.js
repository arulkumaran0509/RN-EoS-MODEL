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

export const RoleSplashScreen = ({ route, navigation, onFinish, role: propRole }) => {
  const activeRole = propRole || route?.params?.role || 'Customer';
  const isAdmin = activeRole === 'Admin';

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.88));

  useEffect(() => {
    // Subtle smooth logo animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 1.5-second transition duration, then automatically navigate to dashboard
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      } else if (navigation?.replace) {
        navigation.replace('Main');
      } else if (navigation?.navigate) {
        navigation.navigate('Main');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation, onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.paleMint} />

      {/* Decorative Pistachio Circles */}
      <View style={styles.auraRing} />

      {/* Centered Branded Logo */}
      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <AppLogo size={92} showBadge={true} />

        {/* Admin Splash displays ADMIN text directly below logo */}
        {isAdmin && (
          <View style={styles.adminTextContainer}>
            <Text style={styles.adminTitle}>ADMIN</Text>
            <Text style={styles.adminSubtitle}>Admin Dashboard</Text>
          </View>
        )}

        {/* Customer Splash displays NO "Customer" text and NO personal info */}

        {/* Subtle Dark Green Loading Indicator */}
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="small" color={COLORS.darkGreen} />
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
  },
  auraRing: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: COLORS.softPistachio,
    opacity: 0.45,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  adminTextContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
  adminTitle: {
    fontSize: 22,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    letterSpacing: 4,
  },
  adminSubtitle: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: COLORS.sage,
    letterSpacing: 1,
    marginTop: 3,
    textTransform: 'uppercase',
  },
  indicatorContainer: {
    marginTop: 24,
  },
});
