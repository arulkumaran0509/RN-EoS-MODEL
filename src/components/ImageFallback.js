import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../theme/colors';

export const ImageFallback = ({
  source,
  fallbackEmoji = '🥗',
  style,
  resizeMode = 'cover',
  fallbackText,
}) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  // If error occurred or no source provided, show pleasant styled placeholder
  if (hasError || !source || !source.uri) {
    return (
      <View style={[styles.placeholderContainer, style]}>
        <Text style={styles.emoji}>{fallbackEmoji}</Text>
        {fallbackText ? <Text style={styles.fallbackText}>{fallbackText}</Text> : null}
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      <Image
        source={source}
        style={[StyleSheet.absoluteFillObject, styles.image]}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setHasError(true)}
      />
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    backgroundColor: '#F3F6F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(243, 246, 241, 0.4)',
  },
  placeholderContainer: {
    backgroundColor: '#EDF4E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  emoji: {
    fontSize: 40,
  },
  fallbackText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
