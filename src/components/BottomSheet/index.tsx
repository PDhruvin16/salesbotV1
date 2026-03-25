import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '../../hooks/ThemeContext';
import { getThemeColors } from '../../utils/colors';
import { Typography } from '../Typography';
import { normalize } from '../../utils/responsive';

export interface AppBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  snapPoints?: (string | number)[];
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
  index?: number;
  footerComponent?: (props: BottomSheetFooterProps) => React.ReactElement | null;
  handleComponent?: React.FC | null;
}

const AppBottomSheet: React.FC<AppBottomSheetProps> = ({
  bottomSheetRef,
  snapPoints = ['25%', '50%', '75%'],
  children,
  title,
  onClose,
  index = -1,
  footerComponent,
  handleComponent = null,
}) => {
  const { theme } = useTheme();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);

  // Backdrop renderer for premium dimmed background
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
      ref={bottomSheetRef}
      index={index}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onClose={onClose}
      handleComponent={handleComponent}
      footerComponent={footerComponent}
      backgroundStyle={backgroundStyle}
    >
      <BottomSheetView style={[styles.contentContainer, { backgroundColor: themeColors.white }]}>
        {/* Premium Handle Indicator */}
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: themeColors.lightGray }]} />
        </View>

        {title && (
          <View style={styles.headerContainer}>
            <View style={styles.titleWrapper}>
              <Typography
                variant="h5"
                weight="900"
                style={[styles.headerTitle, { color: themeColors.dark }]}
              >
                {title}
              </Typography>
            </View>
          </View>
        )}
        <View style={styles.body}>{children}</View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    borderRadius: normalize(32),
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -normalize(4) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(12),
    elevation: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(24),
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
  titleWrapper: {
    alignItems: 'center',
    gap: normalize(8),
  },
  headerTitle: {
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  body: {
    flex: 1,
    marginTop: normalize(8),
  },
});

export default AppBottomSheet;
