import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MessageSquare, Megaphone, BookOpen, Settings, Users, Package } from 'lucide-react-native';
import { getThemeColors, ThemeColors } from '../../utils/colors';
import { useTheme } from '../../hooks/ThemeContext';
import { Typography } from '../Typography';
import LinearGradient from 'react-native-linear-gradient';
import { normalize, moderateScale } from '../../utils/responsive';
import AppBottomSheet from '../BottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';

// const { height: SCREEN_HEIGHT } = Dimensions.get('screen'); // Removed unused variable

interface MoreMenuModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (utility: string) => void;
  activeUtility: string;
}

export const UTILITIES = (themeColors: ThemeColors) => {
  return [
    {
      id: 'Conversations',
      label: 'Conversations',
      icon: MessageSquare,
      color: themeColors.secondary,
    },
    { id: 'Campaign', label: 'Campaign', icon: Megaphone, color: themeColors.iconOrange },
    { id: 'KnowledgeBase', label: 'Knowledge Base', icon: BookOpen, color: themeColors.info },
    { id: 'Profile', label: 'Settings', icon: Settings, color: themeColors.error },
    { id: 'Templates', label: 'Templates', icon: BookOpen, color: themeColors.secondary },
    { id: 'Customer', label: 'Customers', icon: Users, color: themeColors.primary },
    { id: 'Product', label: 'Products', icon: Package, color: themeColors.warning },
  ];
};

const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  isVisible,
  onClose,
  onSelect,
  activeUtility,
}) => {
  const { theme } = useTheme();
  // const insets = useSafeAreaInsets(); // Removed unused variable
  const themeColors = getThemeColors(theme);
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const utilities = UTILITIES(themeColors);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [mountKey, setMountKey] = React.useState(0);

  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
      setMountKey((prev) => prev + 1);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <AppBottomSheet
      bottomSheetRef={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={['55%']}
      onClose={onClose}
      title="Explore Services"
    >
      <View key={mountKey} style={styles.grid}>
        {utilities
          .filter((item) => item.id !== activeUtility)
          .map((item, index) => {
            const isActive = activeUtility === item.id;

            return (
              <View key={item.id} style={styles.gridItem}>
                <Animated.View
                  entering={FadeInDown.delay(200 + index * 50).duration(500)}
                  style={styles.centered}
                >
                  <TouchableOpacity
                    onPress={() => {
                      onSelect(item.id);
                      onClose();
                    }}
                    activeOpacity={0.7}
                    style={styles.centered}
                  >
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: item.color + '1A' },
                        isActive && styles.activeIconBox,
                      ]}
                    >
                      <item.icon size={26} color={isActive ? themeColors.white : item.color} />
                    </View>
                    <Typography
                      variant="caption"
                      numberOfLines={1}
                      style={[
                        styles.label,
                        isActive ? styles.activeLabelText : styles.inactiveLabelText,
                      ]}
                    >
                      {item.label}
                    </Typography>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            );
          })}
      </View>

      {/* User Experience Tip */}
      <View style={styles.tipWrapper}>
        <LinearGradient
          colors={[themeColors.primary + '20', themeColors.primary + '08']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.tipGradient}
        >
          <View style={styles.tipBox}>
            <Typography
              style={styles.tipText}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              Active service will be pinned to your main tab bar.
            </Typography>
          </View>
        </LinearGradient>
      </View>
    </AppBottomSheet>
  );
};

const getStyles = (themeColors: ThemeColors) => {
  return StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: normalize(8),
      justifyContent: 'flex-start',
      marginBottom: normalize(12),
    },
    gridItem: {
      width: '33.33%',
      alignItems: 'center',
      marginBottom: normalize(16),
      paddingHorizontal: normalize(4),
    },
    centered: {
      width: '100%',
      alignItems: 'center',
    },
    iconBox: {
      width: moderateScale(50),
      height: moderateScale(50),
      borderRadius: moderateScale(16),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: moderateScale(8),
    },
    activeIconBox: {
      backgroundColor: themeColors.primary,
      shadowColor: themeColors.primary,
      shadowOffset: { width: 0, height: moderateScale(4) },
      shadowOpacity: 0.3,
      shadowRadius: moderateScale(8),
      elevation: 5,
    },
    label: {
      textAlign: 'center',
      fontSize: normalize(12),
      fontWeight: '500',
      minHeight: normalize(34),
      width: '100%',
    },
    activeLabelText: {
      fontWeight: '800',
      color: themeColors.primary,
    },
    inactiveLabelText: {
      color: themeColors.gray,
    },
    tipWrapper: {
      marginHorizontal: normalize(20),
      borderRadius: normalize(12),
      marginTop: normalize(4),
      marginBottom: Platform.OS === 'ios' ? normalize(40) : normalize(30),
      overflow: 'hidden',
    },
    tipGradient: {
      width: '100%',
    },
    tipBox: {
      padding: normalize(12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    tipText: {
      fontSize: normalize(11),
      textAlign: 'center',
      fontWeight: '700',
      color: themeColors.primary,
    },
  });
};

export default MoreMenuModal;
