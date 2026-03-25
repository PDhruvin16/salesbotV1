import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StatusBar, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Typography } from "../../components/Typography";
import { useTheme } from "../../hooks/ThemeContext";
import colors, { getThemeColors } from "../../utils/colors";
import { getStyles } from "./SplashStyle";

interface SplashScreenProps {}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  const { theme } = useTheme();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);

  //  Use useRef to persist Animated.Value across renders
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim, progressAnim]); // Now safe to include in deps

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={colors.transparent}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />

      <LinearGradient
        colors={themeColors.appBackgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />

        <View style={styles.content}>
          {/* Logo Circle with Animation */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.logoCircle}>
              <View style={styles.logoInnerCircle}>
                <Typography
                  variant="h1"
                  size={48}
                  weight="700"
                  align="center"
                  letterSpacing={0}
                  lineHeight={48}
                  style={styles.logoText}
                  color={themeColors.primary}
                >
                  SB
                </Typography>
              </View>
            </View>

            {/* Pulse animation ring */}
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.3],
                  }),
                  transform: [
                    {
                      scale: scaleAnim.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            />
          </Animated.View>

          {/* App Name with Animation */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Typography
              variant="h1"
              size={32}
              weight="700"
              align="center"
              style={styles.appName}
            >
              SALES BOT
            </Typography>

            <View style={styles.divider} />

            <Typography
              variant="h3"
              size={18}
              weight="600"
              align="center"
              style={styles.subtitle}
            >
              Sales Bot
            </Typography>

            <Typography
              variant="caption"
              size={13}
              weight="500"
              align="center"
              style={styles.tagline}
            >
              AI Sales Assistant
            </Typography>
          </Animated.View>

          {/* Loading indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    transform: [
                      {
                        scaleX: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
            <Typography
              variant="caption"
              size={12}
              weight="500"
              align="center"
              style={styles.loadingText}
            >
              Loading...
            </Typography>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Typography
            variant="caption"
            size={11}
            weight="500"
            align="center"
            style={styles.grayLabel}
          >
            Powered by
          </Typography>
          <Typography
            variant="caption"
            size={13}
            weight="700"
            align="center"
            style={styles.companyName}
          >
            AI Sante India Private Limited
          </Typography>
          <Typography
            variant="caption"
            size={10}
            weight="400"
            align="center"
            style={styles.copyright}
          >
            © 2026 All Rights Reserved
          </Typography>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default SplashScreen;
