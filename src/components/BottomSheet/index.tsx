import React, { ReactNode, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooter,
  BottomSheetScrollView,
  BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '../../context/ThemeContext';
import { getThemeColors, ThemeColors } from '../../utils/colors';
import { Typography } from '../Typography';
import { normalize } from '../../utils/responsive';
import spacing from '../../utils/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getBottomTabBarHeight } from '../../utils/layout';

export interface BottomSheetOption {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'destructive';
}

export interface AppBottomSheetProps {
  bottomSheetRef?: React.RefObject<BottomSheet | null>;
  visible?: boolean;
  snapPoints?: (string | number)[];
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  index?: number;
  options?: BottomSheetOption[];
  cancelLabel?: string;
  footer?: ReactNode;
  useTabBarPadding?: boolean;
  handleComponent?: React.FC | null;
}

const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  bottomSheetRef,
  visible,
  snapPoints = ['25%', '50%', '75%'],
  children,
  title,
  subtitle,
  onClose,
  index = -1,
  options,
  cancelLabel = 'Cancel',
  footer,
  useTabBarPadding = true,
  handleComponent = null,
}) => {
  const { theme } = useTheme();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => getStyles(themeColors, insets.bottom, useTabBarPadding),
    [themeColors, insets.bottom, useTabBarPadding],
  );

  const internalRef = React.useRef<BottomSheet>(null);
  const ref = bottomSheetRef || internalRef;

  const resolvedIndex = visible !== undefined ? (visible ? (options ? 0 : 1) : -1) : index;

  const handleOptionPress = (option: BottomSheetOption) => {
    option.onPress();
    onClose?.();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const renderFooterWrapper = useCallback(
    (props: BottomSheetFooterProps) => {
      if (!footer) return null;
      return (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View style={styles.footerContainer}>{footer}</View>
        </BottomSheetFooter>
      );
    },
    [footer, styles.footerContainer],
  );

  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: themeColors.white,
      borderTopLeftRadius: normalize(32),
      borderTopRightRadius: normalize(32),
      borderWidth: 1,
      borderColor: themeColors.border,
    }),
    [themeColors],
  );

  return (
    <BottomSheet
      ref={ref}
      index={resolvedIndex}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onClose={onClose}
      handleComponent={handleComponent}
      footerComponent={footer ? renderFooterWrapper : undefined}
      backgroundStyle={backgroundStyle}
    >
      <BottomSheetView style={[styles.contentContainer, { backgroundColor: themeColors.white }]}>
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: themeColors.lightGray }]} />
        </View>

        {title && (
          <View style={styles.headerContainer}>
            <Typography variant="h5" weight="900" style={[styles.headerTitle, { color: themeColors.dark }]}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" style={styles.subtitle}>
                {subtitle}
              </Typography>
            )}
          </View>
        )}

        {children && (
          <BottomSheetScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {children}
          </BottomSheetScrollView>
        )}

        {!children && options && (
          <View style={styles.modalInner}>
            <View style={styles.content}>
              <View style={styles.optionsContainer}>
                {options.map((option, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionButton,
                      idx === options.length - 1 && styles.optionButtonLast,
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
      </BottomSheetView>
    </BottomSheet>
  );
};

const getStyles = (themeColors: ThemeColors, bottomInset: number, useTabBarPadding: boolean) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      borderTopLeftRadius: normalize(32),
      borderTopRightRadius: normalize(32),
    },
    handleContainer: {
      alignItems: 'center',
      paddingVertical: normalize(12),
    },
    handle: {
      width: normalize(42),
      height: normalize(5),
      borderRadius: normalize(3),
    },
    headerContainer: {
      paddingTop: normalize(8),
      paddingBottom: normalize(16),
      alignItems: 'center',
    },
    headerTitle: {
      letterSpacing: -0.8,
      textAlign: 'center',
      marginBottom: normalize(spacing.xs),
    },
    subtitle: {
      textAlign: 'center',
      color: themeColors.gray,
      marginTop: normalize(4),
    },
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
    optionsContainer: {
      marginBottom: normalize(spacing.md),
      paddingHorizontal: normalize(spacing.md),
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
      marginHorizontal: normalize(spacing.md),
      paddingVertical: normalize(spacing.md),
      paddingHorizontal: normalize(spacing.md),
      borderRadius: normalize(12),
      backgroundColor: themeColors.white,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    cancelText: {
      color: themeColors.error,
      textAlign: 'center',
      fontWeight: '600',
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
        return getBottomTabBarHeight(bottomInset) + normalize(spacing.md);
      })(),
      backgroundColor: themeColors.white,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
      paddingHorizontal: normalize(spacing.md),
      width: '100%',
    },
  });

export default AppBottomSheet;
