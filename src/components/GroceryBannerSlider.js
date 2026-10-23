import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { BANNER_SLIDES } from '../data/bannerSlides';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';

export const GroceryBannerSlider = ({
  navigation,
  onSelectCategory,
  onNavigateAll,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const bannerWidth = Math.max(280, screenWidth - 32);
  const bannerHeight = 175;

  const isFocused = useIsFocused();
  const flatListRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState({});

  // 1. Auto-scrolling every 3000ms with continuous loop (Slide 4 -> Slide 1)
  // Pauses automatically when screen is not focused or user is manually dragging/swiping.
  useEffect(() => {
    if (!isFocused || isInteracting) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % BANNER_SLIDES.length;
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({
            offset: nextIndex * bannerWidth,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [isFocused, isInteracting, bannerWidth]);

  // Handle manual scroll gestures
  const handleScrollBeginDrag = () => {
    setIsInteracting(true);
  };

  const handleMomentumScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / bannerWidth);
    if (newIndex >= 0 && newIndex < BANNER_SLIDES.length) {
      setCurrentIndex(newIndex);
    }
    setIsInteracting(false);
  };

  const handleScrollEndDrag = (event) => {
    const velocityX = event.nativeEvent.velocity?.x ?? 0;
    if (Math.abs(velocityX) < 0.1) {
      const offsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(offsetX / bannerWidth);
      if (newIndex >= 0 && newIndex < BANNER_SLIDES.length) {
        setCurrentIndex(newIndex);
      }
      setIsInteracting(false);
    }
  };

  // Pagination dot tap handler
  const handleDotPress = (index) => {
    setCurrentIndex(index);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: index * bannerWidth,
        animated: true,
      });
    }
  };

  // Handle slide interaction based on type
  const handleSlidePress = (slide) => {
    switch (slide.actionType) {
      case 'all_products':
        if (onNavigateAll) {
          onNavigateAll();
        } else if (navigation) {
          navigation.navigate('Products');
        }
        break;

      case 'vegetables':
        if (onSelectCategory) {
          onSelectCategory('Vegetables');
        }
        if (navigation) {
          navigation.navigate('Products');
        }
        break;

      case 'fruits':
        if (onSelectCategory) {
          onSelectCategory('Fruits');
        }
        if (navigation) {
          navigation.navigate('Products');
        }
        break;

      case 'delivery_info':
        Alert.alert(
          '⚡ Fast Grocery Delivery',
          'Freshness delivered right to your doorstep!\n\n• Delivery Time: Within 30 Minutes\n• Coverage Radius: Within 10 km from our organic farm hub\n• Service Offer: Chilled eco-friendly transit for all fresh fruits & greens\n• Free shipping on grocery orders above ₹199',
          [
            {
              text: 'Start Shopping',
              onPress: () => {
                if (navigation) {
                  navigation.navigate('Products');
                }
              },
            },
            {
              text: 'Got It',
              style: 'cancel',
            },
          ]
        );
        break;

      default:
        if (navigation) {
          navigation.navigate('Products');
        }
        break;
    }
  };

  const handleImageError = (slideId) => {
    setFailedImageIds((prev) => ({ ...prev, [slideId]: true }));
  };

  const renderSlideItem = ({ item }) => {
    const isImageFailed = failedImageIds[item.id];

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => handleSlidePress(item)}
        style={[styles.slideContainer, { width: bannerWidth, height: bannerHeight }]}
      >
        {/* Background Image with Fallback */}
        {!isImageFailed ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
            onError={() => handleImageError(item.id)}
          />
        ) : null}

        {/* Premium Pistachio Tinted Gradient Overlay for High Contrast Text */}
        <LinearGradient
          colors={[
            'rgba(26, 40, 28, 0.94)',
            'rgba(38, 58, 40, 0.82)',
            'rgba(53, 94, 59, 0.50)',
            'rgba(168, 198, 134, 0.20)',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Slide Content Overlay */}
        <View style={styles.slideContent}>
          {/* Top Tag & Badges */}
          <View style={styles.topRow}>
            <View style={styles.tagBadge}>
              <Ionicons name={item.tagIcon} size={11} color={COLORS.darkGreen} />
              <Text style={styles.tagBadgeText}>{item.tag}</Text>
            </View>

            {/* Slide 4 Special Delivery Visual Badge */}
            {item.order === 4 && item.mainOffer && (
              <View style={styles.deliveryExpressBadge}>
                <Ionicons name="flash" size={11} color="#FFFDF5" />
                <Text style={styles.deliveryExpressText}>{item.mainOffer}</Text>
              </View>
            )}
          </View>

          {/* Heading */}
          <Text style={styles.slideTitle} numberOfLines={1}>
            {item.title}
          </Text>

          {/* Subtitle / Delivery Claim */}
          <Text style={styles.slideSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>

          {/* Supporting Highlights / 10 km Radius */}
          {item.order === 4 ? (
            <View style={styles.deliveryDetailsRow}>
              <View style={styles.radiusPill}>
                <Ionicons name="location-sharp" size={11} color={COLORS.darkGreen} />
                <Text style={styles.radiusPillText}>{item.supportingText}</Text>
              </View>
              <View style={styles.stopwatchPill}>
                <Ionicons name="stopwatch-outline" size={11} color={COLORS.softPistachio} />
                <Text style={styles.stopwatchPillText}>30 Min Promise</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.highlightText} numberOfLines={1}>
              {item.highlightText}
            </Text>
          )}

          {/* Bottom Action CTA & Icon Badge */}
          <View style={styles.bottomRow}>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{item.buttonText}</Text>
              <Ionicons
                name={item.buttonIcon}
                size={13}
                color={COLORS.darkGreen}
                style={styles.actionButtonIcon}
              />
            </View>

            {/* Right Graphic/Emoji Visual */}
            <View style={styles.graphicBadge}>
              {item.order === 4 ? (
                <View style={styles.riderIconWrapper}>
                  <Ionicons name="bicycle" size={26} color={COLORS.softPistachio} />
                </View>
              ) : (
                <Text style={styles.graphicEmoji}>{item.fallbackEmoji}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      {/* 4-Slide Horizontal Swipable Pager */}
      <FlatList
        ref={flatListRef}
        data={BANNER_SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlideItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={bannerWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: bannerWidth,
          offset: bannerWidth * index,
          index,
        })}
        style={{ width: bannerWidth }}
      />

      {/* 4 Pagination Dots Indicator */}
      <View style={styles.paginationContainer}>
        {BANNER_SLIDES.map((slide, index) => {
          const isActive = currentIndex === index;
          return (
            <TouchableOpacity
              key={slide.id}
              activeOpacity={0.7}
              onPress={() => handleDotPress(index)}
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              accessibilityLabel={`Go to slide ${index + 1}`}
              style={[
                styles.paginationDot,
                isActive ? styles.paginationDotActive : styles.paginationDotInactive,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  slideContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.darkGreen,
    ...SHADOWS.medium,
  },
  slideContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pistachio,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
    letterSpacing: 0.5,
  },
  deliveryExpressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C86D22',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  deliveryExpressText: {
    fontSize: 10,
    fontWeight: FONTS.bold,
    color: '#FFFDF5',
    letterSpacing: 0.3,
  },
  slideTitle: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.cream,
    marginTop: 2,
  },
  slideSubtitle: {
    fontSize: 12,
    fontWeight: FONTS.medium,
    color: COLORS.softPistachio,
    marginTop: 1,
  },
  highlightText: {
    fontSize: 11,
    color: '#E2EDD6',
    fontWeight: FONTS.regular,
    marginTop: 2,
    opacity: 0.9,
  },
  deliveryDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  radiusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  radiusPillText: {
    fontSize: 10,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  stopwatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220, 236, 201, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  stopwatchPillText: {
    fontSize: 10,
    fontWeight: FONTS.medium,
    color: COLORS.softPistachio,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pistachio,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 4,
    ...SHADOWS.small,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: FONTS.bold,
    color: COLORS.darkGreen,
  },
  actionButtonIcon: {
    marginTop: 1,
  },
  graphicBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  graphicEmoji: {
    fontSize: 24,
  },
  riderIconWrapper: {
    backgroundColor: 'rgba(220, 236, 201, 0.22)',
    padding: 4,
    borderRadius: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 6,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: COLORS.darkGreen,
  },
  paginationDotInactive: {
    width: 6,
    backgroundColor: COLORS.softPistachio,
  },
});
