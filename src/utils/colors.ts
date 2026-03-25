/** Light theme palette (default). Use for Layout and screens that should stay light. */
export const colors = {
  background: 'transparent',
  // primary: '#9673e9', // Updated to match gradient start
  // brand: '#9673e9',
  // headerBackground: '#9673e9',
  muted: '#8E8E93',

  // Premium gradient system (Updated Brand Palette)
  // headerGradientStart: '#9673e9',
  // headerGradientEnd: '#e9ae89',
  // appBackgroundGradient: ['#9673e9', '#c558e5', '#ec9c75', '#ec7b5c', '#e9ae89'],
  // darkBackgroundGradient: ['#0A0A0B', '#111827'],
  primary: '#9673e9', // Primary color from gradient start
  brand: '#9673e9',
  headerBackground: '#9673e9',
  
  // New Primary Gradient System
  primaryGradient: ['#9673e9', '#c558e5', '#ec9c75', '#ec7b5c', '#e9ae89'],
  primaryGradientLocations: [0.003, 0.2911, 0.5717, 0.7666, 0.9887],
  primaryGradientStart: { x: 0, y: 0.5 }, // 91.11deg is approx horizontal
  primaryGradientEnd: { x: 1, y: 0.5 },
  
  headerGradientStart: '#9673e9',
  headerGradientEnd: '#e9ae89',
  appBackgroundGradient: ['#F5F3FF', '#FAF5FF'],
  
  success: '#10B981', // Green for success states
  error: '#EF4444', // Red for errors
  warning: '#F59E0B', // Amber for warnings
  info: '#3B82F6', // Blue for info
  transparent: 'transparent',
  // Border colors
  border: '#E5E5EA',
  black: '#000000',
  // Shadow colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  mediumGray: '#707070',
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  secondary: '#d369ab', // Pink accent from secondary gradient

  // Background colors

  lightBackground: '#F2F2F7',
  white: '#FFFFFF',

  background1: '#ECEFF5',

  // Text colors
  dark: '#1C1C1E',
  gray: '#3a3a3fff',
  darkGray: '#48484A',
  lightGray: '#E5E5EA',
  // Quick action colors - Match new gradient theme
  quickActionGreen: '#D1FAE5', // Light green
  quickActionOrange: '#FED7AA', // Light orange (matches gradient)
  quickActionBlue: '#DBEAFE', // Light blue
  quickActionYellow: '#FEF08A', // Light yellow (matches gradient)

  text: {
    primary: '#1F2937', // Darker gray for better readability
    secondary: '#6B7280', // Medium gray
    tertiary: '#9CA3AF', // Light gray
    disabled: '#D1D5DB', // Disabled gray
    inverse: '#FFFFFF',
    error: '#DC2626',
    success: '#059669',
    warning: '#D97706',
    info: '#2563EB',
    link: '#9673e9', // Match primary purple
  },

  // Primary variations (Purple #7C3AED)
  primary05: 'rgba(150, 115, 233, 0.05)',
  primary12: 'rgba(150, 115, 233, 0.12)',
  primary18: 'rgba(150, 115, 233, 0.18)',
  primary20: 'rgba(150, 115, 233, 0.2)',

  // Error variations
  error15: 'rgba(247, 60, 48, 0.15)',
  errorBackgroundLight: 'rgba(247, 60, 48, 0.1)',

  // White opacity variations
  white05: 'rgba(255, 255, 255, 0.05)',
  white03: 'rgba(255, 255, 255, 0.03)',
  white04: 'rgba(255, 255, 255, 0.04)',
  white15: 'rgba(255, 255, 255, 0.15)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white25: 'rgba(255, 255, 255, 0.25)',
  white30: 'rgba(255, 255, 255, 0.3)',
  white80: 'rgba(255, 255, 255, 0.8)',
  white90: 'rgba(255, 255, 255, 0.9)',

  // Black opacity variations
  black04: 'rgba(0, 0, 0, 0.04)',
  black05: 'rgba(0, 0, 0, 0.05)',
  black10: 'rgba(0, 0, 0, 0.1)',
  black40: 'rgba(0, 0, 0, 0.4)',
  black60: 'rgba(0, 0, 0, 0.6)',

  // Overlay / shadow
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  lightGrayBackground: '#F8F9FA',
  extraLightGray: '#FAFBFC',
  dividerGray: '#E0E0E0',
  progressBackground: '#F0F0F0',
  backdrop: '#ffffff',
  // Icon backgrounds
  successBackground: '#E8F5E9',
  errorBackground: '#FFEBEE',
  errorBorder: '#FFCDD2',

  // Shadow (reusable)
  shadowStrong: 'rgba(0, 0, 0, 0.12)',
  shadowLight: 'rgba(0, 0, 0, 0.08)',
  neutralLight: '#F8F9FA',
  divider: '#E0E0E0',
  surface: '#FAFBFC',

  shadowSoft: 'rgba(0,0,0,0.08)',

  // Icon colors - Status indicators (updated for new theme)
  iconGreen: '#10B981',
  iconRed: '#EF4444',
  iconDarkGreen: '#059669',
  iconOrange: '#FB923C',
  iconBlue: '#3B82F6',
  iconGold: '#D97706',
  iconGoldLight: '#FBBF24',
  iconOrangeLight: '#FBBD04',
  iconPurple: '#7C3AED', // Match primary
  iconPurpleLight: '#A78BFA', // Match gradient
  iconTeal: '#14B8A6',

  // Background colors - Activity icons
  activityBackgroundBlue: '#E3F2FD',
  activityBackgroundBlueLighter: '#BBDEFB',
  activityBackgroundYellow: '#FFF9E6',
  activityBackgroundOrange: '#FFF3E0',
  activityBackgroundRed: '#FFEBEE',

  // Modal and form specific colors
  successBackgroundLight: '#E8F5E9',
  successTextDark: '#2E7D32',
  lightPeachBackground: '#FFF7F0',
  progressBarGreen: '#4CAF50',

  // Teal accent colors (schemes / claims) - updated for new theme
  tealLight: '#D1FAE5',
  tealDark: '#0D9488',
  orderPink: '#EC4899', // Pink for Order
  leadTeal: '#14B8A6', // Teal for Lead
  feedbackBlue: '#9673e9', // Match primary purple

  // Quick action colors for More screen (updated for new theme)
  actionBluePrimary: '#3B82F6',
  actionBlueBackground: '#DBEAFE',
  actionOrangePrimary: '#FB923C',
  actionOrangeBackground: '#FED7AA',
  actionPurplePrimary: '#7C3AED', // Match primary
  actionPurpleBackground: '#EDE9FE',
  actionRedBackground: '#FEE2E2',
  notificationRed: '#EF4444',
  // Collateral metadata color
  collateralMeta: '#6B7280',
  signatureSavedGreen: '#28A745',
  selectionHighlight: '#FFF7F0',
  toggleActiveBackground: '#FFFFFF',
  bottomTabGradient: [
    'rgba(255,255,255,0)',
    'rgba(255,255,255,0.5)',
    'rgba(255,255,255,0.9)',
    'rgba(255,255,255,1)',
  ],

  // Notification screen colors
  notificationTabActiveBackground: '#FFFFFF',
  notificationTabBorder: '#E5E5EA',
  notificationTabBorderRadius: 32,
  notificationTabPaddingHorizontal: 8,
  notificationTabPaddingVertical: 8,
  notificationTabMarginHorizontal: 16,
  notificationTabMarginTop: 12,
  notificationTabGap: 4,
  notificationBadgeBackground: '#EF4444',
  notificationEmptyMinWidth: 70,

  // Color opacity variants - 15% opacity
  success15: 'rgba(16, 185, 129, 0.15)',
  error10: 'rgba(239, 68, 68, 0.1)',
  success10: 'rgba(16, 185, 129, 0.1)',

  // Home screen specific colors
  homeMetricIconBg15: 'rgba(59, 130, 246, 0.15)', // info + '15'
  homeErrorBg10: 'rgba(239, 68, 68, 0.1)', // error + '10'
  homeSuccessBg10: 'rgba(16, 185, 129, 0.1)', // success + '10'
  homeIconBg15Func: (color: string) => `${color}15`, // for dynamic colors
  homeIconBg15Percent: 'rgba(0, 0, 0, 0.15)',

  // Campaign screen colors
  campaignActionBg: '#6366F1', // Vibrant Indigo
  campaignActionShadow: '#6366F1',

  // Profile screen colors
  profileAvatarBg30: 'rgba(99, 102, 241, 0.3)', // primary + '30'
  profileSettingIconBg15: 'rgba(99, 102, 241, 0.15)', // primary + '15'
  profileOrangeIconBg15: 'rgba(251, 146, 60, 0.15)', // iconOrange + '15'
  profileInfoIconBg15: 'rgba(59, 130, 246, 0.15)', // info + '15'
  profileWarningIconBg15: 'rgba(245, 158, 11, 0.15)', // warning + '15'
  profileErrorIconBg15: 'rgba(239, 68, 68, 0.15)', // error + '15'

  // Invoice screen colors
  invoiceIconBg10: 'rgba(99, 102, 241, 0.1)', // primary + '10'
  invoiceWhiteCC: 'rgba(255, 255, 255, 0.8)', // white + 'CC'

  // Analytics screen colors
  analyticsProgressBar: 'rgba(99, 102, 241, 1)', // primary

  // Notification Alert colors
  notificationSuccessBg10: 'rgba(16, 185, 129, 0.1)', // success + '10'
  notificationInfoBg10: 'rgba(59, 130, 246, 0.1)', // info + '10'

  // Campaign screen colors
  campaignPrimaryColor: '#6366F1', // Vibrant Indigo

  // Auth screen colors - text colors
  authWhiteLight: '#FFFFFF',
  authWhiteDarkText: 'rgba(255,255,255,0.9)',
  authWhiteHighText: 'rgba(255,255,255,0.8)',
  authWhiteMediumText: 'rgba(255,255,255,0.6)',

  // Modal backdrop colors
  backdropDarkMode: 'rgba(0, 0, 0, 0.6)', // 60% opacity for dark mode
  backdropLightMode: 'rgba(0, 0, 0, 0.4)', // 40% opacity for light mode
  borderTopLight: 'rgba(0, 0, 0, 0.05)', // 5% opacity border

  // WhatsApp Preview Specific Colors
  whatsapp: {
    bg: '#EFEAE2',
    header: '#075E54',
    logo: '#25D366',
    security: '#E1F3FB',
    securityText: '#4B5563',
    messageText: '#111827',
    footerText: '#6B7280',
    timeText: '#9CA3AF',
    inputArea: '#F0F0F0',
    blue: '#007AFF',
    sentBubble: '#E7FFDB',
  },
};

/** Dark theme palette for theme-aware screens (e.g. Home). */
export const darkColors = {
  ...colors,
  background: '#0D0D0D',
  backdrop: '#0D0D0D',
  white: '#1C1C1E',
  lightBackground: '#1C1C1E',
  background1: '#2C2C2E',
  lightGrayBackground: '#2C2C2E',
  neutralLight: '#2C2C2E',
  surface: '#2C2C2E',
  border: '#38383A',
  divider: '#38383A',
  progressBackground: '#38383A',
  dark: '#FFFFFF',
  gray: '#AEAEB2',

  darkGray: '#8E8E93',
  lightGray: '#3A3A3C',
  text: {
    ...colors.text,
    primary: '#FFFFFF',
    secondary: '#AEAEB2',
    tertiary: '#8E8E93',
    disabled: '#636366',
    inverse: '#1C1C1E',
  },
  shadow: 'rgba(0, 0, 0, 0.4)',
  shadowStrong: 'rgba(0, 0, 0, 0.3)',
  shadowSoft: 'rgba(0, 0, 0, 0.25)',
  selectionHighlight: '#2C2C2E',
  appBackgroundGradient: ['#0A0A0B', '#111827'], // Dark mode structural gradient
  primaryGradient: ['#9673e9', '#c558e5', '#ec9c75', '#ec7b5c', '#e9ae89'],
  primaryGradientLocations: [0.003, 0.2911, 0.5717, 0.7666, 0.9887],
  primaryGradientStart: { x: 0, y: 0.5 },
  primaryGradientEnd: { x: 1, y: 0.5 },
  toggleActiveBackground: 'rgba(255, 255, 255, 0.15)',
  bottomTabGradient: [
    'rgba(13,13,13,0)',
    'rgba(13,13,13,0.5)',
    'rgba(13,13,13,0.9)',
    'rgba(13,13,13,1)',
  ],

  // White opacity variants - dark mode overrides (semi-transparent dark surfaces)
  white80: 'rgba(28, 28, 30, 0.85)',
  white90: 'rgba(28, 28, 30, 0.95)',
  white05: 'rgba(255, 255, 255, 0.05)',
  white15: 'rgba(255, 255, 255, 0.15)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white25: 'rgba(255, 255, 255, 0.25)',
  white30: 'rgba(255, 255, 255, 0.3)',

  // Black opacity variants - dark mode overrides
  black05: 'rgba(255, 255, 255, 0.08)',
  black10: 'rgba(255, 255, 255, 0.1)',

  // WhatsApp colors - dark mode overrides
  whatsapp: {
    bg: '#0D1117',
    header: '#1C1C1E',
    logo: '#25D366',
    security: '#1A2A2A',
    securityText: '#AEAEB2',
    messageText: '#FFFFFF',
    footerText: '#AEAEB2',
    timeText: '#8E8E93',
    inputArea: '#2C2C2E',
    blue: '#007AFF',
    sentBubble: '#1A3A2A',
  },

  // Notification colors (dark mode)
  notificationTabMarginHorizontal: 16,
  notificationTabMarginTop: 12,
  notificationTabBorderRadius: 32,
  notificationTabPaddingHorizontal: 8,
  notificationTabPaddingVertical: 8,
  notificationTabGap: 4,
  notificationBadgeBackground: '#EF4444',
  notificationEmptyMinWidth: 70,

  // Color opacity variants (dark mode)
  success15: 'rgba(16, 185, 129, 0.15)',
  error10: 'rgba(239, 68, 68, 0.1)',
  success10: 'rgba(16, 185, 129, 0.1)',
  homeMetricIconBg15: 'rgba(59, 130, 246, 0.15)',
  homeErrorBg10: 'rgba(239, 68, 68, 0.1)',
  homeSuccessBg10: 'rgba(16, 185, 129, 0.1)',
  campaignActionBg: '#6366F1',
  campaignActionShadow: '#6366F1',
  profileAvatarBg30: 'rgba(99, 102, 241, 0.3)',
  profileSettingIconBg15: 'rgba(99, 102, 241, 0.15)',
  profileOrangeIconBg15: 'rgba(251, 146, 60, 0.15)',
  profileInfoIconBg15: 'rgba(59, 130, 246, 0.15)',
  profileWarningIconBg15: 'rgba(245, 158, 11, 0.15)',
  profileErrorIconBg15: 'rgba(239, 68, 68, 0.15)',
  invoiceIconBg10: 'rgba(99, 102, 241, 0.1)',
  invoiceWhiteCC: 'rgba(255, 255, 255, 0.8)',
  analyticsProgressBar: 'rgba(99, 102, 241, 1)',
  errorBorder: '#FFCDD2',
};

export type ThemeType = 'light' | 'dark';

export type ThemeColors = typeof colors & typeof darkColors;

/** Returns the color palette for the given theme. Use in theme-aware screens (e.g. Home). */
export function getThemeColors(theme: ThemeType): ThemeColors {
  return (theme === 'dark' ? darkColors : colors) as ThemeColors;
}

export default colors;
