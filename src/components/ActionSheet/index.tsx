import React, { ReactNode, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Typography } from '../Typography';
import { getThemeColors, ThemeColors } from '../../utils/colors';
import spacing from '../../utils/spacing';
import { useTheme } from '../../hooks/ThemeContext';
import { normalize } from '../../utils/responsive';

import AppBottomSheet from '../BottomSheet';
import BottomSheet, { BottomSheetFooter, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBottomTabBarHeight } from '../../utils/layout';

export interface ActionSheetOption {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'destructive';
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  options?: ActionSheetOption[];
  cancelLabel?: string;
  children?: ReactNode;
  footer?: ReactNode;
  snapPoints?: (string | number)[];
  useTabBarPadding?: boolean;
}

const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  onClose,
  title = 'Select Option',
  subtitle,
  options,
  cancelLabel = 'Cancel',
  children,
  footer,
  snapPoints = ['50%'],
  useTabBarPadding = true,
}) => {
  const { theme } = useTheme();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => getStyles(themeColors, insets.bottom, useTabBarPadding),
    [themeColors, insets.bottom, useTabBarPadding],
  );

  const handleOptionPress = (option: ActionSheetOption) => {
    option.onPress();
    onClose();
  };

  const renderFooter = useCallback(
    (props: any) => {
      if (!footer) return null;
      return (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View style={styles.footerContainer}>{footer}</View>
        </BottomSheetFooter>
      );
    },
    [footer, styles.footerContainer],
  );

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  return (
    <AppBottomSheet
      bottomSheetRef={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      onClose={onClose}
      title={title}
      footerComponent={renderFooter}
    >
      {/* Children branch: BottomSheetScrollView fills the body */}
      {children && (
        <BottomSheetScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {subtitle && (
            <Typography variant="body2" style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
          {children}
        </BottomSheetScrollView>
      )}

      {/* Options branch: no scroll needed */}
      {!children && options && (
        <View style={styles.modalInner}>
          <View style={styles.content}>
            <View style={styles.optionsContainer}>
              {options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    index === options.length - 1 && styles.optionButtonLast,
                  ]}
                  onPress={() => handleOptionPress(option)}
                >
                  <Typography
                    variant="body1"
                    style={[
                      styles.optionText,
                      option.variant === 'destructive' && styles.optionTextDestructive,
                    ]}
                  >
                    {option.label}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Typography variant="body1" style={styles.cancelText}>
                {cancelLabel}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </AppBottomSheet>
  );
};

const getStyles = (themeColors: ThemeColors, bottomInset: number, useTabBarPadding: boolean) =>
  StyleSheet.create({
    modalInner: {
      flex: 1,
      paddingHorizontal: normalize(spacing.md),
    },
    content: {
      paddingBottom: (() => {
        if (!useTabBarPadding) return normalize(spacing.xl);
        return getBottomTabBarHeight(bottomInset) + normalize(spacing.md);
      })(),
    },
    title: {
      textAlign: 'center',
      marginBottom: normalize(spacing.xs),
      color: themeColors.dark,
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: normalize(spacing.lg),
      color: themeColors.gray,
    },
    optionsContainer: {
      marginBottom: normalize(spacing.md),
    },
    optionButton: {
      paddingVertical: normalize(spacing.md),
      paddingHorizontal: normalize(spacing.md),
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    optionButtonLast: {
      borderBottomWidth: 0,
    },
    optionText: {
      color: themeColors.primary,
      textAlign: 'center',
    },
    optionTextDestructive: {
      color: themeColors.error,
    },
    cancelButton: {
      marginTop: normalize(spacing.md),
      paddingVertical: normalize(spacing.md),
      paddingHorizontal: normalize(spacing.md),
      borderRadius: normalize(12),
      backgroundColor: themeColors.white,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
    },
    cancelText: {
      color: themeColors.error,
      textAlign: 'center',
      fontWeight: '600',
    },
    customContent: {
      flex: 1,
      minHeight: 1, // Fix for some BottomSheet flex issues
    },
    scrollContent: {
      flex: 1,
    },
    scrollContentContainer: {
      paddingHorizontal: normalize(spacing.md),
      paddingBottom: (() => {
        if (!useTabBarPadding) return normalize(spacing.xl);
        return getBottomTabBarHeight(bottomInset) + normalize(spacing.xl);
      })(),
    },
    footerContainer: {
      paddingTop: normalize(spacing.sm),
      paddingBottom: (() => {
        if (!useTabBarPadding) return normalize(spacing.md);
        const totalBarHeight = getBottomTabBarHeight(bottomInset);
        return totalBarHeight + normalize(spacing.md);
      })(),
      backgroundColor: themeColors.white,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
      paddingHorizontal: normalize(spacing.md),
      width: '100%',
    },
  });

export default ActionSheet;
