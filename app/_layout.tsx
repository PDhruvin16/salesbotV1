import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Global Contexts and Providers
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// App Dependencies
import { persistor, store } from '../src/redux/store';
import '../src/lib/interceptor'; // Initialize axios interceptors globally
import Loader from '../src/components/Loader';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { useAuthStatus } from '../src/hooks/useAuth';
import { getThemeColors } from '../src/utils/colors';

const queryClient = new QueryClient();

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});

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
    <GestureHandlerRootView style={styles.gestureHandler}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <ThemeProvider>
            <PersistGate
              loading={<Loader visible={true} text="Loading..." />}
              persistor={persistor}
            >
              <QueryClientProvider client={queryClient}>
                <RootLayoutContent />
              </QueryClientProvider>
            </PersistGate>
          </ThemeProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
