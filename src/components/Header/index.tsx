import React, { ReactNode, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, Search } from 'lucide-react-native';
import colors, { getThemeColors, ThemeColors } from '../../utils/colors';
import { useTheme } from '../../context/ThemeContext';

import { normalize } from '../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';

interface HeaderVariant {
  type: 'home' | 'basic';
  title?: string;
  subtitle?: string;
  location?: string;
  showProfile?: boolean;
  profileImage?: string;
  showSearch?: boolean;
}

export interface CustomHeaderProps {
  variant: HeaderVariant;
  onSearch?: () => void;
  onAdd?: () => void;
  onSettings?: () => void;
  onBack?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  notificationCount?: number;
  bottomContent?: ReactNode;
  onMenuPress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  variant: variantProp,
  onNotificationPress,
  onProfilePress,
  notificationCount,
  bottomContent,
  // onMenuPress,
  onBack,
  onSearch,
}) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const variant = variantProp ?? { type: 'basic' as const, title: 'Title' };

  // 2026 Sleek Entrance Animation
  const scale = useSharedValue(0.96);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    scale.value = withSpring(1, { damping: 20, stiffness: 90 }); // Matches DetailCard physics
  }, [variant.title, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const renderHomeHeader = () => (
    <View style={styles.homeContainer}>
      <View style={styles.leftGroup}>
        <View style={styles.textStack}>
          <Text style={[styles.titleSmall, { color: themeColors.white }]}>
            {variant.title || 'User'}
          </Text>
          <Text style={[styles.subtitleMini, { color: 'rgba(255,255,255,0.8)' }]}>
            {variant.subtitle || 'Welcome'}
          </Text>
        </View>
      </View>
      <View style={styles.rightGroup}>
        {variant.location && (
          <View style={styles.miniPill}>
            <Text style={styles.miniPillText}>{variant.location}</Text>
          </View>
        )}
        {onSearch && (
          <TouchableOpacity onPress={onSearch} style={styles.miniIconButton}>
            <Search size={normalize(18)} color={themeColors.white} />
          </TouchableOpacity>
        )}
        {onNotificationPress && (
          <TouchableOpacity
            onPress={onNotificationPress}
            style={[styles.notificationIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          >
            <Bell size={normalize(18)} color={themeColors.white} />
            {notificationCount && notificationCount > 0 && <View style={styles.spotIndicator} />}
          </TouchableOpacity>
        )}
        {variant.showProfile && (
          <TouchableOpacity onPress={onProfilePress} style={styles.avatarWrapper}>
            <Image
              source={{
                uri:
                  variant.profileImage ||
                  'https://ui-avatars.com/lib/?name=User&background=6366F1&color=fff',
              }}
              style={styles.miniAvatar}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderBasicHeader = () => (
    <View style={styles.basicContainer}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.miniIconButton}>
          <ChevronLeft size={normalize(20)} color={themeColors.white} />
        </TouchableOpacity>
      )}
      <Text style={[styles.basicTitleText, { color: themeColors.white }]}>
        {variant.title || 'Title'}
      </Text>
    </View>
  );

  const content = variant.type === 'home' ? renderHomeHeader() : renderBasicHeader();

  return (
    <SafeAreaView edges={['top']} style={styles.safeHeader}>
      <Animated.View style={[styles.pillHeader, animatedStyle]}>
        <LinearGradient
          colors={themeColors.primaryGradient}
          locations={themeColors.primaryGradientLocations}
          start={themeColors.primaryGradientStart}
          end={themeColors.primaryGradientEnd}
          style={styles.gradientFill}
        />
        <View style={styles.innerContent}>
          {content}
          {variant.type !== 'home' && (
            <View style={styles.actions}>
              {onSearch && (
                <TouchableOpacity onPress={onSearch} style={styles.miniIconButton}>
                  <Search size={normalize(18)} color={themeColors.white} />
                </TouchableOpacity>
              )}
              {onNotificationPress && (
                <TouchableOpacity
                  onPress={onNotificationPress}
                  style={[styles.notificationIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                >
                  <Bell size={normalize(18)} color={themeColors.white} />
                  {notificationCount && notificationCount > 0 && (
                    <View style={styles.spotIndicator} />
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        {bottomContent && <View style={styles.bottomArea}>{bottomContent}</View>}
      </Animated.View>
    </SafeAreaView>
  );
};

const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    safeHeader: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    pillHeader: {
      marginHorizontal: normalize(16),
      marginVertical: normalize(4),
      borderRadius: normalize(32),
      paddingHorizontal: normalize(20),
      paddingVertical: normalize(12),
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      shadowColor: '#000',
      overflow: 'hidden', // Required for gradient fill
      shadowOffset: { width: 0, height: normalize(8) },
      shadowOpacity: 0.06,
      shadowRadius: normalize(24),
      elevation: 6,
    },
    innerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: normalize(2),
    },
    homeContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: normalize(10),
    },
    textStack: {
      justifyContent: 'center',
      gap: 0,
    },
    titleSmall: {
      fontSize: normalize(16),
      fontFamily: 'DMSans-ExtraBold',
      fontWeight: '800',
      letterSpacing: -0.4,
      includeFontPadding: false,
    },
    subtitleMini: {
      fontSize: normalize(11),
      fontFamily: 'DMSans-Medium',
      fontWeight: '500',
      includeFontPadding: false,
    },
    rightGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: normalize(8),
    },
    miniPill: {
      backgroundColor: themeColors.primary + '1A',
      paddingHorizontal: normalize(8),
      paddingVertical: normalize(4),
      borderRadius: normalize(8),
    },
    miniPillText: {
      color: themeColors.white,
      fontSize: normalize(10),
      fontWeight: '700',
    },
    avatarWrapper: {
      borderWidth: 1.5,
      borderColor: 'rgba(0,0,0,0.03)',
      borderRadius: normalize(16),
      padding: normalize(2),
      backgroundColor: themeColors.background1 || '#F8F9FA',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: normalize(4) },
      shadowOpacity: 0.08,
      shadowRadius: normalize(8),
      elevation: 3,
    },
    miniAvatar: {
      width: normalize(24),
      height: normalize(24),
      borderRadius: normalize(12),
    },
    basicContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: normalize(8),
    },
    gradientFill: {
      ...StyleSheet.absoluteFillObject,
    },
    basicTitleText: {
      fontSize: normalize(18),
      fontFamily: 'DMSans-Bold',
      fontWeight: '800',
      letterSpacing: -0.5,
    },
    miniButton: {
      padding: normalize(6),
      borderRadius: normalize(8),
      backgroundColor: themeColors.white + '1A',
    },
    miniIconButton: {
      padding: normalize(4),
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: normalize(6),
      marginLeft: normalize(6),
    },
    notificationIcon: {
      padding: normalize(6),
      borderRadius: normalize(10),
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    spotIndicator: {
      position: 'absolute',
      top: normalize(6),
      right: normalize(6),
      width: normalize(6),
      height: normalize(6),
      borderRadius: normalize(3),
      backgroundColor: themeColors.error,
      borderWidth: 1,
      borderColor: themeColors.primary,
    },
    bottomArea: {
      marginTop: normalize(6),
    },
  });

export default CustomHeader;
