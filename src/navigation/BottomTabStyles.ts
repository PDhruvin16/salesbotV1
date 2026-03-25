import { Dimensions, Platform, StyleSheet } from "react-native";
import { normalize } from "../utils/responsive";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HORIZONTAL_MARGIN = normalize(20);
const TAB_BAR_WIDTH = SCREEN_WIDTH - HORIZONTAL_MARGIN * 2;
const TAB_BAR_HEIGHT = normalize(64);
const MORE_BUTTON_WIDTH = normalize(64);
const TAB_COUNT = 4; // Home, Leads, ActiveUtility, Contacts
const TAB_WIDTH = (TAB_BAR_WIDTH - MORE_BUTTON_WIDTH) / TAB_COUNT;
const TAB_CENTER_OFFSET = MORE_BUTTON_WIDTH / 2 - TAB_BAR_WIDTH / 2; // This is actually complex, let's simplify.
// Re-calculating for BottomTabNavigator logic:
// translateX.value starts from TAB_CENTER_OFFSET
// In BottomTabNavigator: TAB_CENTER_OFFSET + index * TAB_WIDTH
// The pill should be centered on the tab.

export const getStyles = (themeColors: any) =>
  StyleSheet.create({
    tabBarWrapper: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "transparent",
    },
    bottomGradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 0,
    },
    tabBarContainer: {
      position: "absolute",
      left: HORIZONTAL_MARGIN,
      width: TAB_BAR_WIDTH,
      height: TAB_BAR_HEIGHT,
      borderRadius: normalize(32), // More "liquid" rounded corners
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.15)',
      backgroundColor:
        Platform.OS === "ios" ? "transparent" : themeColors.white,
      zIndex: 100,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 5,
      elevation: 3,
      paddingHorizontal: normalize(8),
    },
    moreButtonOutside: {
      position: "absolute",
      left: (SCREEN_WIDTH - MORE_BUTTON_WIDTH) / 2,
      width: MORE_BUTTON_WIDTH,
      height: TAB_BAR_HEIGHT,
      zIndex: 101,
      justifyContent: "center",
      alignItems: "center",
    },
    middleSpacer: {
      width: MORE_BUTTON_WIDTH,
    },
    tabItem: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    pillContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: normalize(8),
      paddingHorizontal: normalize(14),
      borderRadius: normalize(20),
      gap: normalize(6),
      // No minWidth here, let padding dictate the "space"
    },
    tabLabel: {
      fontSize: normalize(12),
      letterSpacing: -0.3,
      includeFontPadding: false,
    },
    activePill: {
      position: "absolute",
      height: TAB_BAR_HEIGHT * 0.7,
      top: TAB_BAR_HEIGHT * 0.15,
      width: TAB_WIDTH - normalize(12),
      borderRadius: normalize(16),
      backgroundColor: themeColors.primary20,
      zIndex: 0,
    },
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: normalize(4),
      width: "100%",
      zIndex: 1,
    },
    activeDot: {
      position: "absolute",
      bottom: normalize(10),
      width: normalize(6),
      height: normalize(6),
      borderRadius: normalize(3),
      backgroundColor: themeColors.primary,
      shadowColor: themeColors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 5,
    },
    specialButtonContainer: {
      width: MORE_BUTTON_WIDTH,
      height: TAB_BAR_HEIGHT,
      justifyContent: "center",
      alignItems: "center",
    },
    specialButton: {
      width: MORE_BUTTON_WIDTH,
      height: TAB_BAR_HEIGHT,
      borderRadius: TAB_BAR_HEIGHT / 2,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: themeColors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 12,
      overflow: 'hidden', // Required for absolute gradient clipping
    },
    specialButtonIconContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    specialButtonText: {
      color: "white",
      fontSize: normalize(9),
      fontWeight: "900",
      letterSpacing: -0.2,
      textShadowColor: "rgba(0,0,0,0.2)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    specialButtonMoreContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 0,
    },
    specialButtonMoreText: {
      color: "white",
      fontSize: normalize(7),
      fontWeight: "800",
      opacity: 0.95,
      textShadowColor: "rgba(0,0,0,0.2)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    specialButtonChevron: {
      marginLeft: normalize(1),
    },
  });

export { TAB_BAR_HEIGHT, TAB_CENTER_OFFSET, TAB_WIDTH };
export default getStyles;
