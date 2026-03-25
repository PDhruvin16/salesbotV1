import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, {
    BaseAnimationBuilder,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { Typography } from "../../components/Typography";
import { getThemeColors } from "../../utils/colors";
import { moderateScale, normalize } from "../../utils/responsive";
import { getStyles } from "./HomeStyle";

// ─── CRED-style Gradient Presets ──────────────────────────────────────────────
// Each tuple is [gradientStart, gradientEnd]
export const CARD_GRADIENTS = {
  indigo: ["#4338CA", "#6366F1"] as [string, string],
  teal: ["#0F766E", "#14B8A6"] as [string, string],
  rose: ["#BE123C", "#FB7185"] as [string, string],
  amber: ["#B45309", "#FBBF24"] as [string, string],
  purple: ["#6D28D9", "#A855F7"] as [string, string],
  ocean: ["#1D4ED8", "#3B82F6"] as [string, string],
  forest: ["#15803D", "#22C55E"] as [string, string],
  midnight: ["#1E293B", "#334155"] as [string, string],
  salesbot: ["#1E3A8A", "#3B82F6", "#60A5FA"] as [string, string, string],
};

// ─── ScaleCard ────────────────────────────────────────────────────────────────

export interface ScaleCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accentColor?: string | string[];
  delay?: number;
  entering?: BaseAnimationBuilder | typeof BaseAnimationBuilder;
  styles: ReturnType<typeof getStyles>;
}

export const ScaleCard: React.FC<ScaleCardProps> = ({
  children,
  style,
  onPress,
  accentColor,
  delay = 0,
  entering,
  styles,
}) => {
  return (
    <UnifiedCard
      styles={styles}
      style={style}
      delay={delay}
      onPress={onPress}
      accentColor={accentColor}
      entering={entering}
    >
      {children}
    </UnifiedCard>
  );
};

// ─── UnifiedCard (Updated with LinearGradient) ────────────────────────────────
export interface UnifiedCardProps {
  children: React.ReactNode;
  accentColor?: string | string[];
  delay?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  entering?: BaseAnimationBuilder | typeof BaseAnimationBuilder;
  styles: ReturnType<typeof getStyles>;
}

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  children,
  accentColor,
  delay = 0,
  style,
  onPress,
  entering,
  styles,
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gradientColors = Array.isArray(accentColor)
    ? accentColor
    : accentColor
      ? [accentColor, accentColor]
      : null;

  return (
    <Animated.View
      entering={
        entering ||
        FadeInDown.delay(delay)
          .duration(600)
          .springify()
          .damping(18)
          .stiffness(100)
      }
      style={[
        styles.chartCardPremium,
        styles.themedCard,
        style,
        animatedStyle,
        componentStyles.overflowHidden,
      ]}
    >
      {gradientColors && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            componentStyles.leftAccent,
            componentStyles.zIndex2,
            { shadowColor: gradientColors[0] },
          ]}
        />
      )}
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.97, { damping: 10 }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 10 }))}
        style={styles.flex1}
      >
        <View style={componentStyles.cardInnerContent}>{children}</View>
      </Pressable>
    </Animated.View>
  );
};

// ─── GradientCard (Refactored to be a UnifiedCard) ───────────────────────────

export interface GradientCardProps {
  children: React.ReactNode;
  gradient?: [string, string]; // Kept for API compatibility, used for accent color
  delay?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  styles: ReturnType<typeof getStyles>;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  gradient = CARD_GRADIENTS.indigo,
  delay = 0,
  style,
  onPress,
  styles,
}) => {
  return (
    <UnifiedCard
      delay={delay}
      styles={styles}
      accentColor={gradient}
      style={[componentStyles.flexMin45, style]}
      onPress={onPress}
    >
      {children}
    </UnifiedCard>
  );
};

// ─── MetricCard (CRED dark gradient style) ────────────────────────────────────

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend: string;
  isUp: boolean;
  icon: React.ComponentType<Record<string, unknown>>;
  gradient?: [string, string];
  delay?: number;
  styles: ReturnType<typeof getStyles>;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  isUp,
  icon: Icon,
  gradient = CARD_GRADIENTS.indigo,
  delay = 0,
  styles,
}) => (
  <UnifiedCard
    delay={delay}
    styles={styles}
    accentColor={gradient}
    style={componentStyles.metricCardContainer}
  >
    <View style={componentStyles.metricHeader}>
      <View
        style={[
          componentStyles.metricIconPill,
          { backgroundColor: gradient[0] + "1A" },
        ]}
      >
        {Icon && <Icon size={moderateScale(18, 0.3)} color={gradient[0]} />}
      </View>
      <View
        style={[
          componentStyles.trendBadge,
          isUp ? componentStyles.trendBadgeUp : componentStyles.trendBadgeDown,
        ]}
      >
        <Typography
          style={[
            componentStyles.trendText,
            isUp ? componentStyles.trendTextUp : componentStyles.trendTextDown,
          ]}
        >
          {isUp ? "↑" : "↓"} {trend}
        </Typography>
      </View>
    </View>

    <Typography style={[styles.cardValue, componentStyles.metricValueSmall]}>
      {value}
    </Typography>
    <Typography style={[styles.cardLabel, componentStyles.noMargin]}>
      {label}
    </Typography>
  </UnifiedCard>
);

// ─── HeroBanner ───────────────────────────────────────────────────────────────

export interface HeroBannerProps {
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  themeColors: any;
  styles: any;
  delay?: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  stats,
  themeColors,
  styles,
  delay = 0,
}) => (
  <Animated.View
    entering={FadeInDown.delay(delay).duration(700).springify().damping(20)}
    style={[
      componentStyles.heroContainer,
      { shadowColor: themeColors.primary },
    ]}
  >
    <LinearGradient
      colors={["#1E3A8A", "#2563EB", "#3B82F6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <View style={componentStyles.heroPatternCont}>
      <View
        style={[
          componentStyles.heroCircle,
          { top: -20, right: -20, opacity: 0.2 },
        ]}
      />
      <View
        style={[
          componentStyles.heroCircle,
          { bottom: -40, left: -20, opacity: 0.1 },
        ]}
      />
    </View>

    <View style={componentStyles.heroContent}>
      <Typography style={componentStyles.heroTitle}>{title}</Typography>
      <Typography style={componentStyles.heroSubtitle}>{subtitle}</Typography>

      <View style={componentStyles.heroStatsRow}>
        {stats.map((s, i) => (
          <View key={i} style={componentStyles.heroStatItem}>
            <Typography style={componentStyles.heroStatValue}>
              {s.value}
            </Typography>
            <Typography style={componentStyles.heroStatLabel}>
              {s.label}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  </Animated.View>
);

// ─── SectionTitle ─────────────────────────────────────────────────────────────

export interface SectionTitleProps {
  icon: React.ComponentType<Record<string, unknown>>;
  title: string;
  iconColor: string;
  delay?: number;
  themeColors: ReturnType<typeof getThemeColors>;
  styles: ReturnType<typeof getStyles>;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  icon: Icon,
  title,
  iconColor,
  delay = 0,
  styles,
  themeColors,
}) => (
  <Animated.View
    entering={FadeInDown.delay(delay).duration(500).springify().damping(18)}
    style={[styles.sectionTitleRow, componentStyles.marginBottom14]}
  >
    {/* Left colored accent bar */}
    <View
      style={[
        componentStyles.accentBar,
        {
          backgroundColor: iconColor,
        },
      ]}
    />
    {/* Icon circle */}
    <LinearGradient
      colors={[iconColor + "30", iconColor + "15"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.sectionIconCircle,
        componentStyles.sectionIconCircleOverride,
      ]}
    >
      <Icon size={moderateScale(18, 0.3)} color={iconColor} />
    </LinearGradient>
    {/* Title text — no extra marginLeft, gap on parent handles spacing */}
    <Typography
      style={[
        styles.sectionTitleTextThemed,
        {
          color: themeColors.dark,
        },
        componentStyles.sectionTitleTextOverride,
      ]}
    >
      {title}
    </Typography>
  </Animated.View>
);

import { StyleSheet } from "react-native";

const componentStyles = StyleSheet.create({
  gradientCardContainer: {
    shadowOpacity: 0.35,
    elevation: 8,
  },
  gradientCardPressable: {
    overflow: "hidden",
    flex: 1,
  },
  gradientCardInner: {
    flex: 1,
    padding: moderateScale(18),
  },
  frostOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  metricCardContainer: {
    flex: 1,
    minWidth: "45%",
    marginVertical: moderateScale(4),
  },
  leftAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: moderateScale(6),
  },
  cardInnerContent: {
    padding: moderateScale(16),
    paddingLeft: moderateScale(22),
  },
  flexMin45: {
    flex: 1,
    minWidth: "45%",
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  metricIconPill: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
  },
  metricValueSmall: {
    fontSize: moderateScale(24),
    letterSpacing: -0.5,
    marginBottom: moderateScale(2),
  },
  noMargin: {
    marginBottom: 0,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(3),
    alignSelf: "flex-start",
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(20),
  },
  trendText: {
    fontSize: moderateScale(11),
    fontWeight: "700",
  },
  marginBottom14: {
    marginBottom: moderateScale(14),
  },
  accentBar: {
    width: 3,
    height: moderateScale(22),
    borderRadius: 2,
    // No marginRight here — sectionTitleRow gap handles spacing uniformly
  },
  sectionIconCircleOverride: {
    borderRadius: moderateScale(10),
    width: moderateScale(34),
    height: moderateScale(34),
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitleTextOverride: {
    letterSpacing: -0.4,
    fontSize: moderateScale(16),
    fontWeight: "700",
    // No marginLeft — gap on parent handles spacing
  },
  trendBadgeUp: {
    backgroundColor: "#D1FAE5", // Solid green-100 — visible in light theme
  },
  trendBadgeDown: {
    backgroundColor: "#FEE2E2", // Solid red-100 — visible in light theme
  },
  trendTextUp: {
    color: "#047857", // Dark green — clearly readable on green badge
  },
  trendTextDown: {
    color: "#B91C1C", // Dark red — clearly readable on red badge
  },
  overflowHidden: {
    overflow: "hidden",
  },
  zIndex2: {
    zIndex: 2,
  },
  heroContainer: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(12),
    marginBottom: moderateScale(24),
    borderRadius: moderateScale(24),
    height: moderateScale(160),
    overflow: "hidden",
    elevation: 12,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  heroPatternCont: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  heroCircle: {
    position: "absolute",
    width: moderateScale(150),
    height: moderateScale(150),
    borderRadius: 75,
    backgroundColor: "white",
  },
  heroContent: {
    padding: moderateScale(20),
    flex: 1,
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: normalize(20),
    fontWeight: "900",
    color: "white",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: normalize(13),
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontWeight: "600",
  },
  heroStatsRow: {
    flexDirection: "row",
    marginTop: moderateScale(20),
    gap: moderateScale(24),
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    paddingTop: moderateScale(12),
  },
  heroStatItem: {
    alignItems: "flex-start",
  },
  heroStatValue: {
    fontSize: normalize(18),
    fontWeight: "800",
    color: "white",
  },
  heroStatLabel: {
    fontSize: normalize(10),
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
  },
});

export default ScaleCard;
