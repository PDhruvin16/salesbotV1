import React, { ReactNode, useMemo } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import CustomHeader, { CustomHeaderProps } from '../Header';
import { getThemeColors } from '../../utils/colors';
import { useTheme } from '../../context/ThemeContext';

/**
 * App layout: header, gradient bar, and content area.
 * Always uses light/white theme colors (no theme context).
 * Screen content (e.g. Home) may apply dark theme independently.
 */
interface AppLayoutProps {
  children: ReactNode;
  headerProps?: CustomHeaderProps;
  showHeader?: boolean;
}

import LinearGradient from 'react-native-linear-gradient';

const AppLayout: React.FC<AppLayoutProps> = ({ children, headerProps, showHeader = true }) => {
  const { theme } = useTheme();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);
  const shouldShowHeader = showHeader && headerProps;

  return (
    <LinearGradient
      colors={themeColors.appBackgroundGradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.container]}
    >
      <StatusBar
        translucent
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
      />

      <View style={styles.headerContainer}>
        {shouldShowHeader && headerProps ? <CustomHeader {...headerProps} /> : null}
      </View>

      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 60 : 40,
    zIndex: 0,
  },
  headerContainer: {
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default AppLayout;
