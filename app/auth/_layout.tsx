import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../src/hooks/ThemeContext';
import { getThemeColors } from '../../src/utils/colors';

export default function AuthLayout() {
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: themeColors.appBackgroundGradient[0] },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="reset-password" options={{ title: 'Reset Password' }} />
    </Stack>
  );
}
