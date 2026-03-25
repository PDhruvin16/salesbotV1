import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../hooks/ThemeContext';
import { getThemeColors } from '../../utils/colors';
import { screenWidth } from '../../utils/responsive';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  variant?: 'rectangular' | 'circular' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({
  width: customWidth,
  height: customHeight,
  borderRadius: customBorderRadius,
  style,
  variant = 'rectangular',
}) => {
  const { theme } = useTheme();

  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false, // No reverse
    );
  }, [animatedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(animatedValue.value, [0, 1], [-screenWidth, screenWidth]);

    return {
      transform: [{ translateX }],
    };
  });

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'circular':
        const size = customWidth || customHeight || 40;
        return {
          width: size,
          height: size,
          borderRadius: (typeof size === 'number' ? size : 40) / 2,
        };
      case 'text':
        return {
          width: customWidth || '100%',
          height: customHeight || 16,
          borderRadius: customBorderRadius || 4,
          marginBottom: 8,
        };
      case 'rectangular':
      default:
        return {
          width: customWidth || '100%',
          height: customHeight || 100,
          borderRadius: customBorderRadius || 8,
        };
    }
  };

  const baseStyle = getVariantStyle();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);

  const skeletonStyle = useMemo(
    () => ({
      backgroundColor: themeColors.lightGray,
    }),
    [themeColors.lightGray],
  );

  return (
    <View style={[styles.container, baseStyle, skeletonStyle, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={
            theme === 'dark'
              ? ['transparent', themeColors.white05, 'transparent']
              : ['transparent', themeColors.white30, 'transparent']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Skeleton;
