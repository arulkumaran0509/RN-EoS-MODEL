// Design system tokens for Daily Grocery Food Shopping App
// Natural Pistachio Green Theme: Elegant, natural, premium organic palette.

export const COLORS = {
  // 1. Core Natural Pistachio Green Palette
  primary: '#A8C686',        // Primary Pistachio Green
  pistachio: '#A8C686',
  darkGreen: '#355E3B',      // Dark Natural Green
  primaryDark: '#355E3B',
  softPistachio: '#DCECC9',  // Soft Pistachio
  primaryLight: '#DCECC9',
  paleMint: '#F4F8ED',       // Pale Mint Background
  cream: '#FFFDF5',          // Cream Surface
  creamSurface: '#FFFDF5',
  freshLeaf: '#6B8E4E',      // Fresh Leaf Green
  sage: '#879B76',           // Sage Green
  textPrimary: '#263528',    // Main Text
  mainText: '#263528',
  textSecondary: '#687568',  // Secondary Text
  secondaryText: '#687568',
  textMuted: '#879B76',
  textLight: '#FFFFFF',
  white: '#FFFFFF',
  border: '#DCE4D4',         // Border
  borderLight: '#EAF0E4',
  error: '#C62828',          // Error
  danger: '#C62828',
  success: '#367C43',        // Success

  // 2. Surface & Background Tokens
  background: '#F4F8ED',      // Pale Mint Background
  bgGradientStart: '#F4F8ED', // Pale Mint
  bgGradientEnd: '#FFFDF5',   // Cream Surface
  cardBackground: '#FFFDF5',
  surface: '#FFFDF5',

  // 3. Theme Aliases (replaces old yellow theme with pistachio palette)
  goldenYellow: '#A8C686',   // Replaced with Pistachio Green
  yellowLight: '#DCECC9',    // Replaced with Soft Pistachio
  yellowDark: '#6B8E4E',     // Replaced with Fresh Leaf Green
  yellowBar: '#FFFFFF',      // Clean White bottom navigation bar

  // 4. Tab Bar Highlights
  tabActive: '#355E3B',      // Dark Natural Green active highlight
  tabInactive: '#879B76',    // Sage Green inactive highlight

  // 5. Badges & Categories
  fruitBadge: '#DCECC9',
  fruitBadgeText: '#355E3B',
  vegBadge: '#E2EDD6',
  vegBadgeText: '#355E3B',

  // 6. States & Actions
  favorite: '#C62828',
  favoriteInactive: '#A2B099',
  ratingStar: '#6B8E4E',

  // 7. Admin Theme Accent
  adminAccent: '#355E3B',
  adminLight: '#DCECC9',

  // 8. Order Status Colors (distinguishable and distinct)
  status: {
    Pending: { text: '#B45309', bg: '#FEF3C7', border: '#FDE68A' },
    Confirmed: { text: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
    Preparing: { text: '#6D28D9', bg: '#F5F3FF', border: '#DDD6FE' },
    'Out for Delivery': { text: '#0F766E', bg: '#F0FDFA', border: '#99F6E4' },
    Delivered: { text: '#367C43', bg: '#DCECC9', border: '#A8C686' },
    Cancelled: { text: '#C62828', bg: '#FEE2E2', border: '#FECACA' },
  },
};

export const FONTS = {
  bold: '700',
  semiBold: '600',
  medium: '500',
  regular: '400',
};

export const SHADOWS = {
  small: {
    shadowColor: '#263528',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#263528',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#263528',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
};
