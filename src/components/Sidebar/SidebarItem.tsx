import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { normalize, moderateScale } from '../../utils/responsive';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming
} from 'react-native-reanimated';

interface SidebarItemProps {
  label: string;
  icon: any;
  isActive: boolean;
  isExpanded: boolean;
  onPress: () => void;
  themeColors: any;
  iconColor?: string;
  badge?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon: Icon,
  isActive,
  isExpanded,
  onPress,
  themeColors,
  iconColor,
  badge,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const paddingMax = normalize(16);
  // Dock width is 68. IconBox is 36. Math: (68 - 36) / 2 = 16 for perfect centering.
  const paddingMin = normalize(16);
  const marginMax = normalize(12);

  const containerAnim = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      paddingHorizontal: withTiming(isExpanded ? paddingMax : paddingMin, { duration: 250 }),
    };
  });

  const activeIndicatorAnim = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive ? 1 : 0, { duration: 250 }),
      transform: [
        { scaleY: withTiming(isActive ? 1 : 0.4, { duration: 250 }) }
      ]
    };
  });

  const labelAnim = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isExpanded ? 1 : 0, { duration: 200 }),
      width: isExpanded ? 'auto' : 0,
    };
  });

  const iconBoxAnim = useAnimatedStyle(() => {
    return {
      marginRight: withTiming(isExpanded ? marginMax : 0, { duration: 250 }),
    };
  });

  const iconBgAnim = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isActive ? 'transparent' : 'transparent', { duration: 250 }),
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, containerAnim]}>
        
        {/* Vertical Active Line Indicator from Screenshot */}
        <Animated.View 
          style={[
            styles.activeIndicator,
            { backgroundColor: themeColors.primary, shadowColor: themeColors.primary },
            activeIndicatorAnim
          ]}
        />
        
        <Animated.View style={[styles.iconBox, iconBgAnim]}>
          <Icon 
            size={normalize(20)} 
            color={isActive ? themeColors.primary : (iconColor || themeColors.textPrimary)} 
            strokeWidth={isActive ? 2.5 : 2} 
            opacity={isActive ? 1 : 0.6}
          />
        </Animated.View>
        
        <Animated.View style={[styles.labelContainer, labelAnim]}>
          <Typography 
            variant="body2" 
            style={[
              styles.label, 
              { color: isActive ? themeColors.primary : themeColors.textPrimary },
              isActive && { fontWeight: '700' },
              !isActive && { opacity: 0.7 }
            ]}
            numberOfLines={1}
          >
            {label}
          </Typography>
        </Animated.View>

        {isExpanded && badge && (
          <View style={[styles.badge, { backgroundColor: themeColors.white05 }]}>
            <Typography style={styles.badgeText}>{badge}</Typography>
          </View>
        )}

      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    marginVertical: normalize(4),
    backgroundColor: 'transparent',
    width: '100%',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '15%',
    bottom: '15%',
    width: normalize(4),
    borderTopRightRadius: normalize(4),
    borderBottomRightRadius: normalize(4),
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  iconBox: {
    width: moderateScale(32),
    height: moderateScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  label: {
    fontSize: normalize(13.5),
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: normalize(6),
    paddingVertical: normalize(2),
    borderRadius: normalize(6),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    fontSize: normalize(9),
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '700',
  },
});

export default SidebarItem;
