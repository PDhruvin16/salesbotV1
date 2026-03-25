import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { LoadingProps } from '../../types/components';
import { useTheme } from '../../hooks/ThemeContext';
import { getThemeColors } from '../../utils/colors';

const Loader: React.FC<LoadingProps> = ({
  visible = false,
  text = 'Loading...',
  size = 'large',
  color,
  overlay = true,
  style,
}) => {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const rotationValue = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      rotationValue.value = withRepeat(
        withTiming(360, {
          duration: 2000,
          easing: Easing.linear,
        }),
        -1, // Infinite repeat
        false, // No reverse
      );
    } else {
      rotationValue.value = 0;
    }
  }, [visible, rotationValue]);

  const activeColor = color || themeColors.primary;

  const ring1Style = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateX: `${rotationValue.value}deg` },
        { rotateY: `${rotationValue.value * 0.5}deg` },
      ],
    };
  });

  const ring2Style = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${rotationValue.value}deg` },
        { rotateZ: `${rotationValue.value * 1.5}deg` },
      ],
    };
  });

  const ring3Style = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateZ: `${rotationValue.value}deg` },
        { rotateX: `${rotationValue.value * 0.8}deg` },
      ],
    };
  });

  const loaderSize = size === 'small' ? 40 : 80;
  const strokeWidth = size === 'small' ? 3 : 5;

  const renderRings = () => (
    <View style={[styles.ringsContainer, { width: loaderSize, height: loaderSize }]}>
      <Animated.View
        style={[
          styles.ring,
          ring1Style,
          {
            width: loaderSize,
            height: loaderSize,
            borderColor: themeColors.primary,
            borderWidth: strokeWidth,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          ring2Style,
          {
            width: loaderSize * 0.8,
            height: loaderSize * 0.8,
            borderColor: themeColors.secondary || themeColors.info,
            borderWidth: strokeWidth,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          ring3Style,
          {
            width: loaderSize * 0.6,
            height: loaderSize * 0.6,
            borderColor: themeColors.success,
            borderWidth: strokeWidth,
          },
        ]}
      />
      <View
        style={[
          styles.core,
          {
            backgroundColor: activeColor,
            width: loaderSize * 0.2,
            height: loaderSize * 0.2,
            shadowColor: themeColors.black,
          },
        ]}
      />
    </View>
  );

  if (!visible) return null;

  const overlayBgColor =
    theme === 'dark' ? themeColors.backdropDarkMode : themeColors.backdropLightMode;

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={[styles.overlay, { backgroundColor: overlayBgColor }, style]}>
          <View
            style={[
              styles.container,
              { backgroundColor: themeColors.white, shadowColor: themeColors.black },
            ]}
          >
            {renderRings()}
            {text && <Text style={[styles.text, { color: themeColors.dark }]}>{text}</Text>}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={[styles.inlineContainer, style]}>
      {renderRings()}
      {text && <Text style={[styles.text, { color: themeColors.dark }]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  ringsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 100,
  },
  core: {
    position: 'absolute',
    borderRadius: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default Loader;
