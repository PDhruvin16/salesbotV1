import { Dimensions, StyleSheet } from "react-native";
import { ThemeColors } from "../../utils/colors";
import { hp, moderateScale, normalize } from "../../utils/responsive";

const { width } = Dimensions.get("window");

export const getStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: themeColors.transparent,
    },
    scrollContent: {
      paddingHorizontal: moderateScale(16),
      paddingTop: moderateScale(10),
      paddingBottom: moderateScale(140), // Increased padding for better iOS visibility above bottom tabs
    },
    containerView: {
      flex: 1,
      backgroundColor: themeColors.transparent,
    },

    // --- CRED-LIKE PREMIUM STYLES ---
    premiumCard: {
      borderRadius: moderateScale(16),
      padding: moderateScale(16),
      marginBottom: moderateScale(16),
      backgroundColor: themeColors.white03,
      borderWidth: 1,
      borderColor: themeColors.white05,
      overflow: "hidden",
      minHeight: moderateScale(120),
    },
    glassCard: {
      backgroundColor: themeColors.white03,
      borderRadius: moderateScale(12),
      padding: moderateScale(12),
      borderWidth: 1,
      borderColor: themeColors.white04, // Closest to 0.08
    },
    neonText: {
      textShadowColor: themeColors.headerGradientStart,
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: moderateScale(8),
    },

    // Header Section
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: moderateScale(16),
      paddingVertical: moderateScale(6),
      marginBottom: moderateScale(2),
    },
    avatarRing: {
      width: moderateScale(44),
      height: moderateScale(44),
      borderRadius: moderateScale(22),
      padding: moderateScale(2),
      backgroundColor: themeColors.headerGradientStart,
    },
    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: moderateScale(20),
      borderWidth: 2,
      borderColor: themeColors.black,
    },

    // Horizontal Scroll Sections
    statsScroll: {
      paddingVertical: moderateScale(8),
      marginBottom: moderateScale(16),
    },
    miniMetricCard: {
      width: width * 0.4,
      marginRight: moderateScale(12),
      padding: moderateScale(12),
      borderRadius: moderateScale(16),
      backgroundColor: themeColors.white05,
      borderWidth: 1,
      borderColor: themeColors.white15,
    },
    miniMetricValue: {
      fontSize: moderateScale(20),
      fontWeight: "900",
      marginTop: moderateScale(6),
      color: themeColors.white,
    },
    miniMetricTrend: {
      fontSize: moderateScale(10),
      marginTop: moderateScale(4),
      fontWeight: "700",
    },

    // Main Dashboard Sections
    sectionWrapper: {
      marginBottom: moderateScale(24),
    },
    sectionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: moderateScale(12),
      gap: moderateScale(8), // Tight, consistent spacing between bar | icon | text
    },
    sectionIconCircle: {
      width: moderateScale(36),
      height: moderateScale(36),
      borderRadius: moderateScale(10),
      alignItems: "center",
      justifyContent: "center",
    },
    sectionTitleText: {
      fontSize: moderateScale(16),
      fontWeight: "800",
      letterSpacing: -0.4,
    },

    // Grid Layout for Metrics
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "stretch",
      gap: moderateScale(10),
    },
    gridCard: {
      flex: 1,
      minWidth: "45%",
      padding: moderateScale(16),
      borderRadius: moderateScale(16),
      borderWidth: 1,
      marginVertical: moderateScale(4),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: moderateScale(4) },
      shadowOpacity: 0.07,
      shadowRadius: moderateScale(12),
      elevation: 4,
      overflow: "hidden",
    },
    gridCardLabel: {
      fontSize: moderateScale(11),
      fontWeight: "600",
      marginBottom: moderateScale(6),
      color: themeColors.gray,
    },
    gridCardValue: {
      fontSize: moderateScale(24),
      fontWeight: "800",
      marginBottom: moderateScale(6),
      color: themeColors.dark,
    },
    themedCard: {
      backgroundColor: themeColors.white,
      borderColor: themeColors.border,
      shadowColor: themeColors.black,
    },
    cardLabel: {
      fontSize: moderateScale(12),
      fontWeight: "600",
      marginBottom: moderateScale(4),
      color: themeColors.gray,
    },
    cardValue: {
      fontSize: moderateScale(26),
      fontWeight: "800",
      marginBottom: moderateScale(4),
      letterSpacing: -0.6,
      color: themeColors.dark,
    },
    sectionTitleTextThemed: {
      fontSize: moderateScale(16),
      fontWeight: "800",
      letterSpacing: -0.4,
      color: themeColors.dark,
    },

    // Chart Container Enhancements
    chartCardPremium: {
      marginTop: moderateScale(8),
      marginBottom: moderateScale(12),
      borderRadius: moderateScale(22),
      borderWidth: 1,
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: moderateScale(6) },
      shadowOpacity: 0.08,
      shadowRadius: moderateScale(16),
      elevation: 5,
      overflow: "hidden",
    },
    chartTitle: {
      fontSize: moderateScale(14),
      fontWeight: "700",
      marginBottom: moderateScale(16),
      textAlign: "center",
    },
    chartLegendGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: moderateScale(16),
      gap: moderateScale(8),
      justifyContent: "center",
    },
    legendTag: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(6),
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(4),
      borderRadius: moderateScale(8),
    },
    legendDot: {
      width: moderateScale(6),
      height: moderateScale(6),
      borderRadius: moderateScale(3),
    },
    legendTagText: {
      fontSize: moderateScale(11),
      fontWeight: "600",
    },

    // Floating Action Button Style (Minimized Attendance)
    floatingAttendance: {
      position: "absolute",
      bottom: hp(12),
      alignSelf: "center",
      width: "90%",
      height: moderateScale(60),
      borderRadius: moderateScale(30),
      backgroundColor: themeColors.dark, // More standard than rgba(20,20,20)
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: moderateScale(12),
      borderWidth: 0, // Removed border
      borderColor: themeColors.transparent, // Removed border
      shadowColor: themeColors.headerGradientStart,
      shadowOffset: { width: 0, height: moderateScale(8) },
      shadowOpacity: 0.4,
      shadowRadius: moderateScale(10),
      elevation: 20,
    },
    punchRing: {
      width: moderateScale(40),
      height: moderateScale(40),
      borderRadius: moderateScale(20),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: themeColors.white15,
    },
    attendanceTextContainer: {
      flex: 1,
      marginLeft: moderateScale(12),
    },
    attendanceActionBtn: {
      paddingHorizontal: moderateScale(14),
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(20),
      backgroundColor: themeColors.headerGradientStart,
    },
    attendanceActionText: {
      color: themeColors.white,
      fontSize: moderateScale(13),
      fontWeight: "800",
    },

    // Dashboard Text Styles
    dashboardTitle: {
      fontSize: moderateScale(24),
      fontWeight: "900",
      letterSpacing: -0.5,
    },
    dashboardSubtitle: {
      fontSize: moderateScale(13),
      fontWeight: "500",
      marginTop: moderateScale(2),
    },

    // Toggle Enhancement (Fixed for Light Theme)
    modernToggle: {
      flexDirection: "row",
      borderRadius: moderateScale(12),
      padding: moderateScale(4),
      marginBottom: moderateScale(20),
      borderWidth: 1,
      alignItems: "center",
      overflow: "hidden",
      maxWidth: "100%",
    },
    toggleItem: {
      paddingHorizontal: moderateScale(14),
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(10),
    },
    toggleItemActive: {},
    toggleText: {
      fontSize: moderateScale(13),
      fontWeight: "700",
    },
    toggleTextActive: {
      color: themeColors.white,
    },

    toggleItemInactive: {
      backgroundColor: themeColors.transparent,
    },

    // Quick Action Enhancement
    quickActionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: moderateScale(20),
    },
    actionCircle: {
      alignItems: "center",
      gap: moderateScale(6),
    },
    iconBg: {
      width: moderateScale(52),
      height: moderateScale(52),
      borderRadius: moderateScale(26),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: themeColors.white05,
      borderWidth: 1,
      borderColor: themeColors.white15,
    },
    actionLabel: {
      fontSize: moderateScale(11),
      color: themeColors.gray,
      fontWeight: "600",
    },
    metricHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: moderateScale(12),
    },
    metricIconContainer: {
      width: moderateScale(28),
      height: moderateScale(28),
      borderRadius: moderateScale(8),
      alignItems: "center",
      justifyContent: "center",
    },
    trendBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(4),
      alignSelf: "flex-start",
      paddingHorizontal: moderateScale(6),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(6),
    },
    filterButton: {
      padding: moderateScale(8),
      borderRadius: moderateScale(10),
    },
    toggleRow: {
      flexDirection: "row",
      gap: moderateScale(2),
      alignItems: "center",
    },
    toggleSeparator: {
      width: 1,
      height: moderateScale(16),
      alignSelf: "center",
      marginHorizontal: moderateScale(2),
    },
    weeklyFilterBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: moderateScale(6),
      paddingHorizontal: moderateScale(14),
      height: moderateScale(36),
      borderRadius: moderateScale(18),
      borderWidth: 0, // No border, relies on the container
    },
    activeTrendRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: moderateScale(4),
      gap: moderateScale(4),
    },
    chartCenterLabel: {
      alignItems: "center",
    },
    chartContainerCentered: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: moderateScale(8),
      width: "100%",
    },
    barChartWrapper: {
      paddingLeft: moderateScale(8),
    },
    horizontalScrollContainer: {
      marginTop: moderateScale(16),
      marginHorizontal: moderateScale(-16),
      paddingHorizontal: moderateScale(16),
    },
    horizontalScrollContent: {
      paddingRight: moderateScale(16),
      paddingBottom: moderateScale(8),
    },
    chartCardWide: {
      width: width * 0.8, // Increased width slightly
      marginRight: moderateScale(12),
    },
    labelSmall: { fontSize: moderateScale(12) },
    valueLarge: { fontSize: moderateScale(24), marginBottom: moderateScale(6) },
    mb2: { marginBottom: moderateScale(2) },
    trendText: { fontSize: moderateScale(11), fontWeight: "700" },
    scrollContentPadding: { paddingBottom: moderateScale(100) },
    dashboardTitleLarge: { fontSize: moderateScale(24) },
    marginTop4: { marginTop: moderateScale(4) },
    toggleContainerOverride: {
      alignSelf: "center",
      paddingHorizontal: moderateScale(4),
    },
    toggleItemShadow: {
      elevation: 2,
      shadowOpacity: 0.1,
      shadowRadius: moderateScale(2),
      shadowOffset: { width: 0, height: 1 },
    },
    weeklyText: { fontSize: moderateScale(12), fontWeight: "700" },
    subText: {
      fontSize: moderateScale(11),
      marginTop: moderateScale(4),
      color: themeColors.gray,
    },
    centerLabelValue: { fontSize: moderateScale(14), fontWeight: "900" },
    centerLabelText: { fontSize: moderateScale(9), color: themeColors.info },
    marginTop24: { marginTop: moderateScale(20) },
    last7DaysText: {
      fontSize: moderateScale(10),
      marginTop: moderateScale(4),
    },
    centerLabelValueLarge: {
      fontSize: moderateScale(18),
      fontWeight: "900",
      color: themeColors.dark,
    },
    axisTextStyle: { fontSize: moderateScale(9), color: themeColors.gray },
    fullWidth: { width: "100%" },

    // ── Top Tab Navigator ─────────────────────────────────────────────────────
    flex1: { flex: 1 },
    transparentBg: { backgroundColor: "transparent" },

    homeTabsContainer: {
      flexDirection: "row",
      marginHorizontal: moderateScale(16),
      marginTop: moderateScale(12),
      marginBottom: moderateScale(8),
      borderRadius: moderateScale(28),
      padding: moderateScale(4),
      borderWidth: 1,
      borderColor: themeColors.border,
      gap: moderateScale(4),
      backgroundColor: themeColors.lightGrayBackground,
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: moderateScale(4) },
      shadowOpacity: 0.05,
      shadowRadius: moderateScale(8),
      elevation: 2,
    },
    homeTabsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateScale(2),
    },
    homeTab: {
      flex: 1,
      height: moderateScale(36),
      borderRadius: moderateScale(18),
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: themeColors.transparent,
    },
    homeTabInactive: {
      backgroundColor: "transparent",
    },
    homeTabShadow: {
      elevation: 3,
      shadowOpacity: 0.12,
      shadowRadius: moderateScale(3),
      shadowOffset: { width: 0, height: 1.5 },
    },
    homeTabText: {
      fontSize: moderateScale(13),
      fontWeight: "700",
    },
    grayText: { color: themeColors.gray },
    darkText: { color: themeColors.dark },

    // Themed Additions
    themedHomeTabsContainer: {
      backgroundColor: themeColors.lightGrayBackground,
      borderColor: themeColors.border,
    },
    homeTabActive: {
      backgroundColor: themeColors.white,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    homeTabTextActive: {
      color: themeColors.dark,
    },
    homeTabTextInactive: {
      color: themeColors.gray,
    },
    themedToggleSeparator: {
      backgroundColor: themeColors.border,
      alignSelf: "center",
    },
    themedWeeklyFilterBtn: {
      backgroundColor: themeColors.lightGrayBackground,
    },
    themedWeeklyText: {
      color: themeColors.dark,
    },
    themedDashboardTitle: {
      color: themeColors.dark,
    },
    themedDashboardSubtitle: {
      color: themeColors.gray,
    },
    themedFilterButton: {
      backgroundColor: themeColors.lightGrayBackground,
    },
    metricsGridMargin16: {
      marginBottom: moderateScale(16),
    },
    paddingBottom24: {
      paddingBottom: moderateScale(24),
    },
    flexMin45MarginV4: {
      flex: 1,
      minWidth: "45%",
      marginVertical: moderateScale(4),
    },
    borderLeft3: {
      borderLeftWidth: 3,
    },
    whiteText26: {
      fontSize: normalize(26),
      fontWeight: "800",
      color: themeColors.white,
      letterSpacing: -0.8,
    },
    whiteText22: {
      fontSize: normalize(22),
      fontWeight: "800",
      color: themeColors.white,
      letterSpacing: -0.8,
    },
    labelSmallWhite06: {
      fontSize: normalize(11),
      color: themeColors.authWhiteMediumText,
      fontWeight: "600",
      marginBottom: moderateScale(4),
    },
    subTextWhite05: {
      fontSize: normalize(10),
      color: themeColors.authWhiteMediumText,
    },
    activeTrendBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.tealLight, // Solid light green — visible in both light & dark theme
      alignSelf: "flex-start",
      paddingHorizontal: moderateScale(8),
      paddingVertical: moderateScale(3),
      borderRadius: moderateScale(20),
      gap: moderateScale(4),
    },
    activeTrendText: {
      fontSize: normalize(11),
      fontWeight: "700",
      color: themeColors.iconDarkGreen, // Dark green — high contrast on light green badge
    },
  });

export default getStyles;
