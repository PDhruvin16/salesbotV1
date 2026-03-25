import React, { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AppProviders from '../src/lib/AppProviders';
import { useAuthStatus } from '../src/hooks/useAuth';
import { useTheme } from '../src/hooks/ThemeContext';
import { getThemeColors } from '../src/utils/colors';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isAuthenticated } = useAuthStatus();
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);

  const segments = useSegments();
  const inAuthGroup = segments[0] === 'auth';

  useEffect(() => {
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/auth');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, inAuthGroup]);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: themeColors.appBackgroundGradient[0] },
      }}
    >
      {/* Root Tab Group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Auth Group */}
      <Stack.Screen name="auth" options={{ headerShown: false }} />

    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutContent />
    </AppProviders>
  );
}
