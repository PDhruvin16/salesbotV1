import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  StatusBar
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { GlassView } from 'expo-glass-effect';
import { 
  Zap,
  Users,
  Contact2,
  MessageSquare,
  Megaphone,
  X,
  Target,
  Package,
  Bot,
  Terminal,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react-native';
import { Typography } from '../Typography';
import { normalize, moderateScale } from '../../utils/responsive';
import SidebarItem from './SidebarItem';
import { router } from 'expo-router';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLLAPSED_WIDTH = normalize(68);
const EXPANDED_WIDTH = SCREEN_WIDTH > 400 ? SCREEN_WIDTH * 0.52 : SCREEN_WIDTH * 0.68;

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  themeColors: any;
  activeRoute: string;
}

const GlassViewAny = GlassView as any;

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  onClose,
  themeColors,
  activeRoute,
}) => {
  const insets = useSafeAreaInsets();
  
  // Header is roughly insets.top + normalize(70)
  // Bottom bar is tabBottomPosition + TAB_BAR_HEIGHT (normalize(64))
  const tabBottomPosition = Platform.OS === 'ios' ? Math.max(insets.bottom, normalize(12)) : normalize(24);
  const totalBottomOffset = tabBottomPosition + normalize(64) + normalize(12);
  const totalTopOffset = insets.top + normalize(75);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const animatedSidebarStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH, { duration: 300 }),
      transform: [
        {
          translateX: withTiming(isVisible ? 0 : -(isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH) - 20, {
            duration: 400,
            easing: Easing.bezier(0.33, 1, 0.68, 1),
          })
        }
      ],
    };
  });

  const contentFadeAnim = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isExpanded ? 1 : 0, { duration: 250 }),
      width: isExpanded ? 'auto' : 0,
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 300 }),
    };
  });

  const menuItems = [
    { id: 'contacts', label: 'Contact', icon: Contact2, route: '/(tabs)/contacts' as any, color: '#3B82F6' },
    { id: 'customer', label: 'Customer', icon: UserCheck, route: '/(tabs)/customer' as any, color: '#10B981' },
    { id: 'product', label: 'Product', icon: Package, route: '/(tabs)/product' as any, color: '#F59E0B' },
    { id: 'leads', label: 'Lead', icon: Target, route: '/(tabs)/leads' as any, color: '#EF4444' },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare, route: '/(tabs)/conversations' as any, color: '#8B5CF6' },
    { id: 'campaign', label: 'Campaign', icon: Megaphone, route: '/(tabs)/campaign' as any, color: '#EC4899' },
    { id: 'agent', label: 'Agent', icon: Bot, route: '/(tabs)/agent' as any, color: '#6366F1' },
    { id: 'playground', label: 'Playground', icon: Terminal, route: '/(tabs)/playground' as any, color: '#14B8A6' },
  ];


  if (!isVisible && Platform.OS === 'android') return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isVisible ? 'auto' : 'none'}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        >
          {Platform.OS === 'android' ? (
             <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
               <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
             </BlurView>
          ) : (
             <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Sidebar Content - Floating Acrylic Card */}
      <Animated.View style={[
        styles.sidebarContainer, 
        animatedSidebarStyle, 
        { 
          top: totalTopOffset, 
          bottom: totalBottomOffset, 
        }
      ]}>
        <GlassViewAny
          intensity={Platform.OS === 'ios' ? 98 : 100}
          tint="light"
          style={styles.glassContent}
        >
          {Platform.OS === 'android' && (
            <BlurView
              intensity={100}
              tint="light"
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: 'rgba(255,255,255,0.95)',
                }
              ]}
            />
          )}

          <View style={styles.contentContainer}>
            {/* Header Section */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={toggleExpand}
              style={[styles.brandHeader, { width: '100%', paddingHorizontal: isExpanded ? normalize(20) : 0, alignItems: 'stretch' }]}
            >
              <View style={[styles.logoRow, { width: '100%', justifyContent: isExpanded ? 'space-between' : 'center', gap: 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: isExpanded ? normalize(12) : 0 }}>
                  <View style={[styles.logoBox, { overflow: 'hidden', backgroundColor: themeColors.primary }]}>
                    <LinearGradient
                      colors={themeColors.primaryGradient}
                      locations={themeColors.primaryGradientLocations}
                      start={themeColors.primaryGradientStart}
                      end={themeColors.primaryGradientEnd}
                      style={StyleSheet.absoluteFill}
                    />
                    <Zap size={normalize(18)} color="white" strokeWidth={2.5} />
                  </View>
                  <Animated.View style={[styles.brandTextContainer, contentFadeAnim]}>
                    <Typography variant="h3" style={styles.brandName} numberOfLines={1}>Salesbot</Typography>
                  </Animated.View>
                </View>
                {isExpanded && (
                  <View style={styles.closeButtonSmall}>
                    <PanelLeftClose color={themeColors.textPrimary} size={normalize(18)} strokeWidth={2.5} />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={styles.scrollContent}
            >
            <View style={[styles.sectionDivider, { alignItems: isExpanded ? 'flex-start' : 'center', paddingHorizontal: isExpanded ? normalize(20) : 0 }]}>
               <Typography style={[styles.sectionDividerText, !isExpanded && { fontSize: normalize(8), textAlign: 'center' }]}>MENU</Typography>
            </View>
              {menuItems.map((item, index) => (
                <SidebarItem
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  isActive={activeRoute === item.id}
                  isExpanded={isExpanded}
                  themeColors={themeColors}
                  onPress={() => {
                    onClose();
                    router.push(item.route as any);
                  }}
                />
              ))}

            </ScrollView>

            <View style={[styles.footer, { paddingHorizontal: isExpanded ? normalize(12) : 0 }]}>

              <View style={[styles.footerBadge, !isExpanded && { justifyContent: 'center', gap: 0 }]}>
                {isExpanded ? (
                  <>
                    <View style={styles.footerTextContainer}>
                      <Typography variant="caption" style={styles.versionText}>v2.4.0 • PROD</Typography>
                    </View>
                    <LinearGradient
                       colors={[themeColors.primary + '20', themeColors.primary + '05']}
                       start={{ x: 0, y: 0 }}
                       end={{ x: 1, y: 0 }}
                       style={styles.proGradient}
                    >
                      <View style={styles.proPill}>
                        <Typography style={[styles.proText, { color: themeColors.primary }]}>ACTIVE</Typography>
                      </View>
                    </LinearGradient>
                  </>
                ) : (
                  <View style={[styles.footerTextContainer, { alignItems: 'center' }]}>
                    <Typography variant="caption" style={[styles.versionText, { textAlign: 'center' }]}>v2.4.0</Typography>
                  </View>
                )}
              </View>
            </View>
          </View>
        </GlassViewAny>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 1001,
    overflow: 'hidden',
    elevation: Platform.OS === 'android' ? 10 : 25,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    borderTopRightRadius: normalize(32),
    borderBottomRightRadius: normalize(32),
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  glassContent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  brandHeader: {
    paddingTop: normalize(12),
    paddingBottom: normalize(8),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButton: {
    width: normalize(36),
    height: normalize(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextContainer: {
    overflow: 'hidden',
  },
  brandName: {
    flex: 1,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontSize: normalize(16),
  },
  closeButtonSmall: {
    padding: normalize(8),
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: normalize(10),
  },
  scrollContent: {
    paddingVertical: normalize(12),
    paddingBottom: normalize(32),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginHorizontal: normalize(24),
    marginVertical: normalize(16),
  },
  sectionDivider: {
    paddingHorizontal: normalize(24),
    marginTop: normalize(16),
    marginBottom: normalize(8),
  },
  sectionDividerText: {
    fontWeight: '800',
    opacity: 0.35,
    letterSpacing: 1.2,
    fontSize: normalize(10),
  },
  footer: {
    padding: normalize(12),
    paddingBottom: normalize(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: normalize(4),
    flexWrap: 'nowrap',
  },
  footerTextContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  versionText: {
    opacity: 0.5,
    fontWeight: '700',
    fontSize: normalize(10),
  },
  proGradient: {
    borderRadius: normalize(8),
    overflow: 'hidden',
  },
  proPill: {
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(3),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  proText: {
    fontSize: normalize(8.5),
    fontWeight: '900',
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default Sidebar;
