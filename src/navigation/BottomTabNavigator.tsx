import {
    BottomTabBarProps,
    createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { ChevronUp, Contact2, Home, Users } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../components/Typography";
import { useTheme } from "../hooks/ThemeContext";
import { getThemeColors, ThemeColors } from "../utils/colors";

interface UtilityInfo {
  id: string;
  label: string;
  icon: React.ComponentType<Record<string, unknown>>;
}

interface TabItemProps {
  route: { name: string };
  _index: number;
  isFocused: boolean;
  onPress: () => void;
  activeUtilityInfo: UtilityInfo;
  themeColors: ThemeColors;
  activeUtility: string;
}

interface CustomTabBarProps extends BottomTabBarProps {
  themeColors: ThemeColors;
  activeUtilityInfo: UtilityInfo;
  activeUtility: string;
  onMorePress: (navigation: BottomTabBarProps["navigation"]) => void;
  isMoreVisible: boolean;
}

// Core Screens
import { HomeScreen } from "../screens/Home";
// Utility Screens
import { ProfileScreen } from "../screens/Profile";
import ComingSoonScreen from "../screens/ComingSoon";

// Components
import MoreMenuModal, { UTILITIES } from "../components/MoreMenu";

import { normalize } from "../utils/responsive";
import getStyles, { TAB_CENTER_OFFSET, TAB_WIDTH } from "./BottomTabStyles";

const Tab = createBottomTabNavigator();

const UtilityWrapper = React.memo(
  ({ activeUtility }: { activeUtility: string }) => {
    switch (activeUtility) {
      case "Profile":
        return <ProfileScreen />;
      default:
        return <ComingSoonScreen />;
    }
  },
);

const getTabIcon = (
  routeName: string,
  activeUtilityInfo: UtilityInfo,
): React.ComponentType<Record<string, unknown>> => {
  const iconMap: Record<
    string,
    React.ComponentType<Record<string, unknown>>
  > = {
    Home,
    Leads: Users,
    Contacts: Contact2,
    More: ChevronUp,
    ActiveUtility: activeUtilityInfo.icon,
  };
  return iconMap[routeName] || Home;
};

const getTabLabel = (
  routeName: string,
  activeUtilityInfo: UtilityInfo,
): string => {
  const labelMap: Record<string, string> = {
    Home: "Home",
    Leads: "Leads",
    Contacts: "Contacts",
    More: "More",
    ActiveUtility:
      activeUtilityInfo.id === "KnowledgeBase"
        ? "KB"
        : activeUtilityInfo.id === "Conversations"
          ? "Chats"
          : activeUtilityInfo.label,
  };
  return labelMap[routeName] || "Home";
};

const TabItemComponent: React.FC<TabItemProps> = ({
  route,
  _index,
  isFocused,
  onPress,
  activeUtilityInfo,
  themeColors,
}) => {
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);
  const scale = useSharedValue(isFocused ? 1 : 0.9);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.08 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [isFocused, scale]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedSpecialButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const Icon = getTabIcon(route.name, activeUtilityInfo);
  const label = getTabLabel(route.name, activeUtilityInfo);

  if (route.name === "More") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.tabItem}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[styles.specialButtonContainer, animatedSpecialButtonStyle]}
        >
          <View style={[styles.specialButton, { backgroundColor: themeColors.primary }]}>
            <LinearGradient
              colors={themeColors.primaryGradient}
              locations={themeColors.primaryGradientLocations}
              start={themeColors.primaryGradientStart}
              end={themeColors.primaryGradientEnd}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.specialButtonIconContainer}>
              <Typography variant="h4" style={styles.specialButtonText}>
                salesBot
              </Typography>
              <View style={styles.specialButtonMoreContainer}>
                <Typography
                  variant="caption"
                  style={styles.specialButtonMoreText}
                >
                  MORE
                </Typography>
                <Icon
                  size={normalize(11)}
                  color={themeColors.text.inverse}
                  strokeWidth={3}
                  style={styles.specialButtonChevron}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
        <Icon
          size={normalize(18)}
          color={isFocused ? themeColors.primary : themeColors.text.tertiary}
          strokeWidth={isFocused ? 2.5 : 2}
        />
        <Typography
          variant="caption"
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.tabLabel,
            {
              color: isFocused
                ? themeColors.primary
                : themeColors.text.tertiary,
              fontSize: normalize(9),
              width: TAB_WIDTH - normalize(8),
            },
          ]}
        >
          {label}
        </Typography>
      </Animated.View>
    </TouchableOpacity>
  );
};

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors: _descriptors,
  navigation,
  themeColors,
  activeUtilityInfo,
  activeUtility,
  onMorePress,
  isMoreVisible,
}) => {
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);
  const insets = useSafeAreaInsets();

  const activeRouteName = state.routes[state.index]?.name;
  const isRegularTab = ["Home", "Leads", "ActiveUtility", "Contacts"].includes(
    activeRouteName,
  );
  const indicatorVisible = isRegularTab;

  // The indicator should only show for the 4 tabs inside the pill
  const pillIndex = useMemo(() => {
    const regularRoutes = ["Home", "Leads", "ActiveUtility", "Contacts"];
    return regularRoutes.indexOf(activeRouteName);
  }, [activeRouteName]);

  const translateX = useSharedValue(
    TAB_CENTER_OFFSET + (pillIndex >= 0 ? pillIndex : 0) * TAB_WIDTH,
  );

  const opacity = useSharedValue(indicatorVisible ? 1 : 0);

  useEffect(() => {
    if (pillIndex >= 0) {
      translateX.value = withSpring(TAB_CENTER_OFFSET + pillIndex * TAB_WIDTH, {
        damping: 20,
        stiffness: 100,
        mass: 0.8,
      });
    }
    opacity.value = withTiming(indicatorVisible ? 1 : 0, { duration: 200 });
  }, [pillIndex, indicatorVisible, translateX, opacity]);

  const handleTabPress = (
    route: { name: string; key: string },
    isFocused: boolean,
  ) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (route.name === "More") {
      onMorePress(navigation);
      return;
    }

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const tabBottomPosition = useMemo(
    () =>
      Platform.OS === "ios"
        ? Math.max(insets.bottom, normalize(12))
        : normalize(12),
    [insets.bottom],
  );

  const containerStyle = useMemo(
    () => [{ bottom: tabBottomPosition }],
    [tabBottomPosition],
  );

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
      display: opacity.value === 0 ? "none" : "flex",
    };
  });

  return (
    <View style={styles.tabBarWrapper}>
      <View style={[styles.tabBarContainer, containerStyle]}>
        <Animated.View style={[styles.activePill, animatedIndicatorStyle]} />

        {state.routes.map(
          (route: { name: string; key: string }, index: number) => {
            if (route.name === "More") return null;

            const isFocused = state.index === index;

            return (
              <TabItemComponent
                key={
                  route.name === "ActiveUtility"
                    ? `ActiveUtility-${activeUtility}-${isFocused}`
                    : route.key
                }
                route={route}
                _index={index}
                isFocused={isFocused}
                onPress={() => handleTabPress(route, isFocused)}
                activeUtilityInfo={activeUtilityInfo}
                activeUtility={activeUtility}
                themeColors={themeColors}
              />
            );
          },
        )}
      </View>

      {/* Standalone More Button */}
      {state.routes.map(
        (route: { name: string; key: string }, index: number) => {
          if (route.name !== "More") return null;

          const isFocused = isMoreVisible;

          return (
            <View
              key={route.key}
              style={[styles.moreButtonOutside, { bottom: tabBottomPosition }]}
            >
              <TabItemComponent
                route={route}
                _index={index}
                isFocused={isFocused}
                onPress={() => handleTabPress(route, isFocused)}
                activeUtilityInfo={activeUtilityInfo}
                activeUtility={activeUtility}
                themeColors={themeColors}
              />
            </View>
          );
        },
      )}
    </View>
  );
};

const BottomTabNavigator: React.FC = () => {
  const { theme } = useTheme();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);
  const insets = useSafeAreaInsets();

  // State
  const [activeUtility, setActiveUtility] = useState<string>("Conversations");
  const [isMoreVisible, setIsMoreVisible] = useState<boolean>(false);
  const [tabNav, setTabNav] = useState<BottomTabBarProps["navigation"] | null>(
    null,
  );

  const activeUtilityInfo = useMemo((): UtilityInfo => {
    const list = UTILITIES(themeColors);
    return (
      list.find((u) => u.id === activeUtility) ||
      list.find((u) => u.id === "Conversations") ||
      list[0]
    );
  }, [activeUtility, themeColors]);

  const handleSelectUtility = useCallback(
    (id: string): void => {
      setActiveUtility(id);
      if (tabNav) {
        tabNav.navigate("ActiveUtility");
      }
    },
    [tabNav],
  );

  const handleMorePress = useCallback(
    (navigation: BottomTabBarProps["navigation"]): void => {
      setTabNav(navigation);
      setIsMoreVisible(true);
    },
    [],
  );

  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => {
      const bottomGradientStyle = {
        height:
          Platform.OS === "ios"
            ? normalize(120) + insets.bottom
            : normalize(110),
      };

      return (
        <View style={styles.tabBarWrapper}>
          <LinearGradient
            colors={themeColors.bottomTabGradient}
            style={[styles.bottomGradient, bottomGradientStyle]}
            pointerEvents="none"
          />
          <CustomTabBar
            {...props}
            themeColors={themeColors}
            activeUtilityInfo={activeUtilityInfo}
            activeUtility={activeUtility}
            onMorePress={handleMorePress}
            isMoreVisible={isMoreVisible}
          />
        </View>
      );
    },
    [
      themeColors,
      insets.bottom,
      activeUtilityInfo,
      activeUtility,
      handleMorePress,
      styles,
      isMoreVisible,
    ],
  );

  return (
    <>
      <Tab.Navigator
        tabBar={renderTabBar}
        screenOptions={{
          headerShown: false,
          lazy: true,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Leads" component={ComingSoonScreen} />
        <Tab.Screen name="ActiveUtility">
          {() => <UtilityWrapper activeUtility={activeUtility} />}
        </Tab.Screen>
        <Tab.Screen name="Contacts" component={ComingSoonScreen} />
        <Tab.Screen name="More" component={View} />
      </Tab.Navigator>
      <MoreMenuModal
        isVisible={isMoreVisible}
        onClose={() => setIsMoreVisible(false)}
        activeUtility={activeUtility}
        onSelect={handleSelectUtility}
      />
    </>
  );
};

export default BottomTabNavigator;
