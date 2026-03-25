import { Platform, StyleSheet } from "react-native";
import { ThemeColors } from "../../utils/colors";
import { normalize } from "../../utils/responsive";

export const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    content: {
      paddingTop: normalize(16),
      paddingBottom: Platform.OS === "ios" ? normalize(110) : normalize(90), // Increased to clear bottom tab bar
    },
    profileCard: {
      backgroundColor: themeColors.white,
      marginHorizontal: normalize(16),
      marginTop: normalize(16),
      borderRadius: normalize(24),
      padding: normalize(20),
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: normalize(4) },
      shadowOpacity: 0.1,
      shadowRadius: normalize(12),
      elevation: 4,
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: normalize(16),
    },
    avatarWrapper: {
      padding: normalize(3),
      borderWidth: 2,
      borderRadius: normalize(45),
      position: "relative",
      borderColor: themeColors.profileAvatarBg30,
    },
    onlineStatus: {
      position: "absolute",
      bottom: normalize(4),
      right: normalize(4),
      width: normalize(14),
      height: normalize(14),
      borderRadius: normalize(7),
      borderWidth: 2,
      borderColor: themeColors.white,
      zIndex: 10,
      backgroundColor: themeColors.success,
    },
    profileMainInfo: {
      flex: 1,
      gap: normalize(4),
    },
    badgeRow: {
      flexDirection: "row",
      marginTop: normalize(2),
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: normalize(8),
      paddingVertical: normalize(4),
      borderRadius: normalize(10),
      backgroundColor: themeColors.homeSuccessBg10,
    },
    statusDot: {
      width: normalize(6),
      height: normalize(6),
      borderRadius: normalize(3),
      marginRight: normalize(6),
      backgroundColor: themeColors.success,
    },
    contactIconBg: {
      width: normalize(32),
      height: normalize(32),
      borderRadius: normalize(8),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: themeColors.lightGrayBackground,
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: normalize(12),
    },
    avatar: {
      width: normalize(80),
      height: normalize(80),
      borderRadius: normalize(40),
      backgroundColor: themeColors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: normalize(2) },
      shadowOpacity: 0.2,
      shadowRadius: normalize(4),
      elevation: 3,
    },
    avatarText: {
      fontSize: normalize(36),
      fontWeight: "700",
      color: themeColors.white,
      lineHeight: normalize(36),
    },
    name: {
      fontSize: normalize(20),
      color: themeColors.dark,
    },
    designation: {
      fontSize: normalize(12),
      color: themeColors.gray,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: normalize(4),
      marginBottom: normalize(16),
    },
    locationText: {
      fontSize: normalize(13),
      color: themeColors.primary,
      fontWeight: "500",
    },
    divider: {
      height: 1,
      backgroundColor: themeColors.lightGray,
      marginVertical: normalize(16),
    },
    contactInfo: {
      gap: normalize(12),
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: normalize(12),
    },
    contactText: {
      fontSize: normalize(14),
      color: themeColors.dark,
    },
    grayLabel: {
      color: themeColors.gray,
    },
    darkLabel: {
      color: themeColors.dark,
    },
    primaryLabel: {
      color: themeColors.primary,
    },
    successLabel: {
      color: themeColors.success,
    },
    whiteLabel: {
      color: themeColors.white,
    },
    targetCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.white,
      marginHorizontal: normalize(16),
      marginTop: normalize(16),
      borderRadius: normalize(12),
      padding: normalize(16),
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: normalize(1) },
      shadowOpacity: 0.06,
      shadowRadius: normalize(6),
      elevation: 2,
    },
    targetIconContainer: {
      width: normalize(44),
      height: normalize(44),
      borderRadius: normalize(22),
      backgroundColor: themeColors.profileSettingIconBg15,
      justifyContent: "center",
      alignItems: "center",
      marginRight: normalize(12),
    },
    targetInfo: {
      flex: 1,
    },
    targetLabel: {
      fontSize: normalize(13),
      color: themeColors.gray,
      marginBottom: normalize(4),
    },
    targetValue: {
      fontSize: normalize(20),
      fontWeight: "700",
      color: themeColors.dark,
    },
    targetProgress: {
      marginLeft: normalize(12),
      padding: normalize(8),
      borderRadius: normalize(12),
      backgroundColor: themeColors.primary + "10",
    },
    sectionTitle: {
      fontSize: normalize(12),
      fontWeight: "600",
      color: themeColors.gray,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginHorizontal: normalize(16),
      marginTop: normalize(24),
      marginBottom: normalize(12),
    },
    settingCard: {
      backgroundColor: themeColors.white,
      marginHorizontal: normalize(16),
      marginBottom: 1,
      paddingHorizontal: normalize(16),
      paddingVertical: normalize(16),
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIconContainer: {
      width: normalize(36),
      height: normalize(36),
      borderRadius: normalize(18),
      backgroundColor: themeColors.profileSettingIconBg15,
      justifyContent: "center",
      alignItems: "center",
      marginRight: normalize(12),
    },
    settingText: {
      fontSize: normalize(15),
      color: themeColors.dark,
      fontWeight: "600",
    },
    sectionCard: {
      marginHorizontal: normalize(16),
      marginBottom: normalize(20),
      borderRadius: normalize(20),
      paddingVertical: normalize(8),
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: normalize(4) },
      shadowOpacity: 0.1,
      shadowRadius: normalize(12),
      elevation: 4,
      backgroundColor: themeColors.white,
    },
    settingItem: {
      paddingHorizontal: normalize(16),
    },
    innerDivider: {
      height: 1,
      backgroundColor: themeColors.divider,
      marginHorizontal: normalize(16),
      marginVertical: normalize(4),
      opacity: 0.3,
    },
    settingRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: normalize(8),
    },
    settingValue: {
      fontSize: normalize(14),
      color: themeColors.gray,
    },
    logoutContainer: {
      marginHorizontal: normalize(16),
      marginTop: normalize(12),
    },
    footerInfo: {
      alignItems: "center",
      marginVertical: normalize(24),
      gap: normalize(4),
    },
    fs10: {
      fontSize: normalize(10),
    },
    opacity02: {
      opacity: 0.2,
    },
    mt30: {
      marginTop: normalize(30),
    },
    orangeIconBg: {
      backgroundColor: themeColors.profileOrangeIconBg15,
    },
    infoIconBg: {
      backgroundColor: themeColors.profileInfoIconBg15,
    },
    warningIconBg: {
      backgroundColor: themeColors.profileWarningIconBg15,
    },
    errorIconBg: {
      backgroundColor: themeColors.profileErrorIconBg15,
    },
    successIconBg: {
      backgroundColor: themeColors.homeSuccessBg10,
    },
  });

export default getStyles;
