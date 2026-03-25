import { StyleSheet, Dimensions } from "react-native";
import { ThemeColors } from "../../../utils/colors";
import { normalize } from "../../../utils/responsive";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientBackground: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    statusBarMask: {
      zIndex: 10,
      width: "100%",
    },
    scrollContent: {
      flexGrow: 1,
    },
    contentWrapper: {
      flex: 1,
      alignItems: "center",
      minHeight: "100%",
    },

    // ─── Hero Section (above card) ───
    heroSection: {
      width: "100%",
      alignItems: "center",
      paddingTop: normalize(48),
      paddingBottom: normalize(32),
      paddingHorizontal: normalize(24),
      position: "relative",
      overflow: "hidden",
    },
    // Decorative blob circles in background
    heroBlob1: {
      position: "absolute",
      width: normalize(200),
      height: normalize(200),
      borderRadius: normalize(100),
      backgroundColor: themeColors.primary + "22",
      top: -normalize(60),
      left: -normalize(60),
    },
    heroBlob2: {
      position: "absolute",
      width: normalize(140),
      height: normalize(140),
      borderRadius: normalize(70),
      backgroundColor: themeColors.secondary + "18",
      top: normalize(20),
      right: -normalize(40),
    },
    heroBlob3: {
      position: "absolute",
      width: normalize(80),
      height: normalize(80),
      borderRadius: normalize(40),
      backgroundColor: themeColors.primary + "14",
      bottom: normalize(10),
      left: normalize(30),
    },

    // Logo container
    logoContainer: {
      width: normalize(80),
      height: normalize(80),
      borderRadius: normalize(24),
      alignItems: "center",
      justifyContent: "center",
      marginBottom: normalize(16),
      shadowColor: themeColors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
    },
    logoText: {
      fontSize: normalize(36),
      fontWeight: "900",
      color: "#FFFFFF",
      letterSpacing: -1,
    },

    // App name & tagline
    appName: {
      fontSize: normalize(26),
      fontWeight: "900",
      color: themeColors.dark,
      letterSpacing: -0.8,
      marginBottom: normalize(6),
      textAlign: "center",
    },
    appNameHighlight: {
      color: themeColors.primary,
    },
    tagline: {
      fontSize: normalize(13),
      color: themeColors.gray,
      textAlign: "center",
      fontWeight: "500",
      letterSpacing: 0.2,
    },

    // Trust badges row
    badgesRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: normalize(12),
      marginTop: normalize(16),
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: normalize(4),
      backgroundColor: themeColors.primary + "12",
      paddingHorizontal: normalize(10),
      paddingVertical: normalize(4),
      borderRadius: normalize(20),
    },
    badgeText: {
      fontSize: normalize(10),
      fontWeight: "700",
      color: themeColors.primary,
      letterSpacing: 0.3,
    },

    // ─── Card ───
    cardWrapper: {
      width: "100%",
      paddingHorizontal: normalize(20),
    },
    card: {
      width: "100%",
      borderRadius: normalize(24),
      backgroundColor: themeColors.white,
      padding: normalize(24),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.04)",
    },

    // "Welcome back to Sales bot 👋"
    welcomeText: {
      fontSize: normalize(17),
      fontWeight: "800",
      color: themeColors.dark,
      marginBottom: normalize(20),
      textAlign: "center",
      lineHeight: normalize(26),
    },
    welcomeHighlight: {
      color: themeColors.primary,
      fontSize: normalize(17),
      fontWeight: "800",
    },

    // Forgot password
    forgotPasswordRow: {
      alignItems: "flex-end",
      marginTop: normalize(-8),
      marginBottom: normalize(16),
    },
    forgotPasswordText: {
      fontSize: normalize(13),
      fontWeight: "600",
      color: themeColors.dark,
    },

    // Login button
    loginButton: {
      borderRadius: normalize(14),
      marginTop: normalize(4),
    },

    // "Don't have an account? Sign Up"
    signUpRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: normalize(20),
      marginBottom: normalize(32),
      gap: normalize(4),
    },
    signUpText: {
      fontSize: normalize(13),
      color: themeColors.gray,
    },
    signUpLink: {
      fontSize: normalize(13),
      fontWeight: "700",
      color: themeColors.primary,
    },

    // Error text below fields
    errorText: {
      marginTop: normalize(4),
      marginBottom: normalize(8),
      textAlign: "center",
      color: themeColors.error,
      fontSize: normalize(12),
    },
  });

export default getStyles;
