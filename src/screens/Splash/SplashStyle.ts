import { StyleSheet } from "react-native";
import { ThemeColors } from "../../utils/colors";

export const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
      position: "relative",
    },
    // Decorative elements
    circle1: {
      position: "absolute",
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: themeColors.white + "0D",
      top: -100,
      right: -100,
    },
    circle2: {
      position: "absolute",
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: themeColors.white + "08",
      bottom: -50,
      left: -50,
    },
    circle3: {
      position: "absolute",
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: themeColors.white + "0A",
      top: "40%",
      right: -30,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    logoContainer: {
      position: "relative",
      marginBottom: 48,
    },
    logoCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: themeColors.white + "26",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    logoInnerCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: themeColors.white,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    logoText: {
      textAlign: "center",
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    pulseRing: {
      position: "absolute",
      width: 140,
      height: 140,
      borderRadius: 70,
      borderWidth: 2,
      borderColor: themeColors.white,
      top: -10,
      left: -10,
    },
    textContainer: {
      alignItems: "center",
    },
    appName: {
      letterSpacing: 4,
      marginBottom: 16,
      textShadowColor: themeColors.shadow,
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
      color: themeColors.dark,
    },
    divider: {
      width: 60,
      height: 3,
      backgroundColor: themeColors.white,
      borderRadius: 2,
      marginBottom: 16,
      opacity: 0.8,
    },
    subtitle: {
      letterSpacing: 2,
      marginBottom: 8,
      color: themeColors.dark,
    },
    tagline: {
      letterSpacing: 1,
      color: themeColors.gray,
    },
    loadingContainer: {
      position: "absolute",
      bottom: 120,
      width: "100%",
      paddingHorizontal: 48,
    },
    loadingBar: {
      width: "100%",
      height: 3,
      backgroundColor: themeColors.white + "33",
      borderRadius: 2,
      overflow: "hidden",
      marginBottom: 8,
    },
    loadingProgress: {
      height: "100%",
      // width: '100%',
      backgroundColor: themeColors.white,
      borderRadius: 2,
    },
    loadingText: {
      color: themeColors.gray,
    },
    footer: {
      position: "absolute",
      bottom: 32,
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    companyName: {
      marginTop: 4,
      marginBottom: 4,
      color: themeColors.dark,
    },
    copyright: {
      color: themeColors.gray,
    },
    grayLabel: {
      color: themeColors.gray,
    },
    darkLabel: {
      color: themeColors.dark,
    },
  });

export default getStyles;
