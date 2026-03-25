import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { Tabs, router, useSegments } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ChevronUp, Contact2, Home, Settings, Users } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../../src/components/Typography';
import { TabProvider } from '../../src/hooks/TabContext';
import { useTheme } from '../../src/hooks/ThemeContext';
import { getThemeColors } from '../../src/utils/colors';
import { normalize } from '../../src/utils/responsive';

// Components
import Sidebar from '../../src/components/Sidebar/Sidebar';
import getStyles from '../../src/navigation/BottomTabStyles';

const GlassViewAny = GlassView as any;
const AnimatedGlassViewAny = Animated.createAnimatedComponent(GlassViewAny);

const SPRING_CONFIG = {
  damping: 22,
  stiffness: 120,
  mass: 0.8,
};

const getTabIcon = (routeName: string, isFocused: boolean) => {
  if (Platform.OS === 'ios') {
    const symbolMap: Record<string, string> = {
      index: isFocused ? 'house.fill' : 'house',
      settings: isFocused ? 'gearshape.fill' : 'gearshape',
      leads: isFocused ? 'person.2.fill' : 'person.2',
      contacts: isFocused ? 'person.crop.rectangle.stack.fill' : 'person.crop.rectangle.stack',
    };
    return symbolMap[routeName] || 'house';
  }
  const iconMap: Record<string, any> = {
    index: Home,
    leads: Users,
    contacts: Contact2,
    settings: Settings,
  };
  return iconMap[routeName] || Home;
};

const getTabLabel = (routeName: string) => {
  const labelMap: Record<string, string> = {
    index: 'Home',
    leads: 'Leads',
    contacts: 'Contacts',
    settings: 'Settings',
  };
  return labelMap[routeName] || 'Home';
};

const TabItem = ({ routeName, isFocused, onPress, themeColors, theme, isMoreTrigger = false }: any) => {
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);
  const iconName = useMemo(() => getTabIcon(routeName, isFocused), [routeName, isFocused]);
  const label = getTabLabel(routeName);

  const iconColor = isFocused 
    ? (theme === 'dark' ? '#C09AFF' : themeColors.primary) // Brighter purple for dark mode visibility
    : (theme === 'dark' ? 'rgba(255,255,255,0.4)' : themeColors.gray);

  if (isMoreTrigger) {
    return (
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        style={styles.specialButtonContainer}
        activeOpacity={0.85}
      >
        <Animated.View style={[styles.specialButton, {
          borderRadius: 999,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }]}>
          <LinearGradient
            colors={themeColors.primaryGradient}
            locations={themeColors.primaryGradientLocations}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Typography variant="h4" style={styles.specialButtonText}>salesBot</Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: -1.5 }}>
              <Typography variant="caption" style={styles.specialButtonMoreText}>MORE</Typography>
              <ChevronUp size={normalize(11)} color="white" strokeWidth={3.5} style={{ marginLeft: 1.5, marginTop: -0.5 }} />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (!isFocused) Haptics.selectionAsync();
        onPress();
      }}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      <View style={[styles.pillContainer, Platform.OS === 'android' && { gap: normalize(4) }]}>
        <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
          {Platform.OS === 'ios' ? (
            <SymbolView
              name={iconName as any}
              size={normalize(23)}
              tintColor={iconColor}
              fallback={<Home size={normalize(23)} color={iconColor} />}
            />
          ) : (
            React.createElement(getTabIcon(routeName, isFocused) as any, {
              size: normalize(21), // Slightly smaller for Android to match visual weight
              color: iconColor,
              strokeWidth: 2.0 // Softer stroke for premium feel
            })
          )}
        </View>
        <Typography
          variant="caption"
          weight={isFocused ? (Platform.OS === 'android' ? '700' : '900') : '600'} // Android 700 is closer to iOS 900 visual weight
          style={[
            styles.tabLabel,
            { 
              color: iconColor,
              marginTop: Platform.OS === 'android' ? normalize(1) : 0, // Reduced margin
              fontSize: Platform.OS === 'android' ? normalize(10.5) : normalize(11),
              includeFontPadding: false,
            }
          ]}
        >
          {label}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const CustomTabBar = ({ state, themeColors, onMorePress }: any) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);
  const insets = useSafeAreaInsets();
  const activeRouteName = state.routes[state.index]?.name;

  const tabBottomPosition = useMemo(
    () => (Platform.OS === 'ios' ? Math.max(insets.bottom, normalize(12)) : normalize(24)),
    [insets.bottom],
  );

  // Liquid sliding highlight logic
  const translateX = useSharedValue(0);
  const pillOpacity = useSharedValue(1);
  const SCREEN_WIDTH_RAW = Dimensions.get('window').width;
  const TAB_BAR_WIDTH_RAW = SCREEN_WIDTH_RAW - (normalize(20) * 2);
  const CONTAINER_PADDING = normalize(8); 
  const INNER_BAR_WIDTH = TAB_BAR_WIDTH_RAW - (CONTAINER_PADDING * 2);
  const MORE_BUTTON_WIDTH = normalize(64);
  const SIDE_TAB_WIDTH = (INNER_BAR_WIDTH - MORE_BUTTON_WIDTH) / 2;
  const PILL_HORIZONTAL_PADDING = normalize(6);
  const PILL_WIDTH = SIDE_TAB_WIDTH - (PILL_HORIZONTAL_PADDING * 2);

  useEffect(() => {
    let targetX = 0;
    let visible = false;

    if (activeRouteName === 'index') {
      targetX = PILL_HORIZONTAL_PADDING;
      visible = true;
    } else if (activeRouteName === 'settings') {
      targetX = SIDE_TAB_WIDTH + MORE_BUTTON_WIDTH + PILL_HORIZONTAL_PADDING;
      visible = true;
    }

    translateX.value = withSpring(targetX, SPRING_CONFIG);
    pillOpacity.value = withSpring(visible ? 1 : 0, { damping: 20 });
  }, [activeRouteName, SIDE_TAB_WIDTH, MORE_BUTTON_WIDTH, PILL_HORIZONTAL_PADDING]);

  const slidingPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + CONTAINER_PADDING }],
    width: PILL_WIDTH,
    opacity: pillOpacity.value,
    backgroundColor: themeColors.primary + (Platform.OS === 'android' ? '40' : '30'), // More prominent pill
  }));

  return (
    <View style={styles.tabBarWrapper}>
      <LinearGradient
        colors={themeColors.bottomTabGradient || (theme === 'dark' ? [
          'rgba(13,13,13,0)',
          'rgba(13,13,13,0.5)',
          'rgba(13,13,13,0.9)',
          'rgba(13,13,13,1)',
        ] : [
          'rgba(240,244,255,0)',
          'rgba(240,244,255,0.4)',
          'rgba(240,244,255,0.8)'
        ])}
        style={[styles.bottomGradient, { height: normalize(120), bottom: 0 }]}
        pointerEvents="none"
      />

      <GlassViewAny
        intensity={Platform.OS === 'ios' ? 150 : 0} // Strong blur for iOS, 0 for Android (handled by BlurView)
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={[styles.tabBarContainer, {
          bottom: tabBottomPosition,
          backgroundColor: Platform.OS === 'ios'
            ? (theme === 'dark' ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.2)')
            : (theme === 'dark' ? '#121214' : '#FFFFFF'),
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
          borderWidth: 1.2,
        }]}
      >
        {Platform.OS === 'android' && (
          <BlurView
            intensity={theme === 'dark' ? 50 : 40}
            tint={theme === 'dark' ? 'dark' : 'light'}
            style={[
              StyleSheet.absoluteFill, 
              { 
                borderRadius: normalize(32), 
                overflow: 'hidden',
                backgroundColor: theme === 'dark' ? '#1A1A1E' : '#FFFFFF'
              }
            ]}
          />
        )}

        {/* Animated Sliding Highlight Pill */}
        <Animated.View style={[
          {
            position: 'absolute',
            height: '70%', // Slightly smaller height for a more defined pill look
            top: '15%',
            borderRadius: normalize(16),
            zIndex: 0, // Above BlurView but below items
          },
          slidingPillStyle
        ]} />

        <TabItem
          routeName="index"
          isFocused={activeRouteName === 'index'}
          themeColors={themeColors}
          theme={theme}
          onPress={() => router.push('/(tabs)/' as any)}
        />

        <TabItem
          isMoreTrigger
          routeName="more_trigger"
          isFocused={false}
          themeColors={themeColors}
          theme={theme}
          onPress={onMorePress}
        />

        <TabItem
          routeName="settings"
          isFocused={activeRouteName === 'settings'}
          themeColors={themeColors}
          theme={theme}
          onPress={() => router.push('/(tabs)/settings' as any)}
        />
      </GlassViewAny>
    </View>
  );
};


function TabLayoutContent() {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const segments = useSegments();
  // Reliable path-based active routing for Sidebar
  const pathname = useSegments().join('/');

  const activeRoute = useMemo(() => {
    // pathname approach: "(tabs)/leads", "(tabs)/contacts"
    if (!pathname || pathname === '(tabs)' || pathname === '(tabs)/index') return 'index';
    
    // Check for exact matches in segments
    const segs = segments as string[];
    if (segs.includes('leads')) return 'leads';
    if (segs.includes('contacts')) return 'contacts';
    if (segs.includes('customer')) return 'customer';
    if (segs.includes('product')) return 'product';
    if (segs.includes('conversations')) return 'conversations';
    if (segs.includes('campaign')) return 'campaign';
    if (segs.includes('agent')) return 'agent';
    if (segs.includes('playground')) return 'playground';
    if (segs.includes('knowledgebase')) return 'knowledgebase';
    if (segs.includes('templates')) return 'templates';
    if (segs.includes('settings')) return 'settings';

    // Fallback search in pathname
    const lowerPath = pathname.toLowerCase();
    if (lowerPath.includes('leads')) return 'leads';
    if (lowerPath.includes('contact')) return 'contacts';
    if (lowerPath.includes('customer')) return 'customer';
    if (lowerPath.includes('product')) return 'product';
    if (lowerPath.includes('conversation')) return 'conversations';
    if (lowerPath.includes('campaign')) return 'campaign';
    if (lowerPath.includes('agent')) return 'agent';
    if (lowerPath.includes('playground')) return 'playground';
    
    return 'index';
  }, [segments, pathname]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar
            {...props}
            themeColors={themeColors}
            onMorePress={() => setIsSidebarVisible(true)}
          />
        )}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />

        {/* Hidden routes still accessible via sidebar */}
        <Tabs.Screen name="leads" options={{ href: null }} />
        <Tabs.Screen name="contacts" options={{ href: null }} />
        <Tabs.Screen name="customer" options={{ href: null }} />
        <Tabs.Screen name="product" options={{ href: null }} />
        <Tabs.Screen name="agent" options={{ href: null }} />
        <Tabs.Screen name="playground" options={{ href: null }} />
        <Tabs.Screen name="campaign" options={{ href: null }} />
        <Tabs.Screen name="conversations" options={{ href: null }} />
        <Tabs.Screen name="more_trigger" options={{ href: null }} />
        
        {/* Existing hidden routes */}
        <Tabs.Screen name="utility" options={{ href: null }} />
        <Tabs.Screen name="knowledgebase" options={{ href: null }} />
        <Tabs.Screen name="templates" options={{ href: null }} />
      </Tabs>

      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
        themeColors={themeColors}
        activeRoute={activeRoute}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <TabProvider>
      <TabLayoutContent />
    </TabProvider>
  );
}
