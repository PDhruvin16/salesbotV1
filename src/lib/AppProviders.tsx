import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Loader from '../components/Loader';
import { AppDataProvider } from '../hooks/AppDataContext';
import { ThemeProvider } from '../hooks/ThemeContext';
import { persistor, store } from '../redux/store';
import './interceptor'; // Initialize axios interceptors

const queryClient = new QueryClient();

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});

interface IProps {
  children: ReactNode;
}

const AppProviders: React.FC<IProps> = ({ children }) => {
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
                <AppDataProvider>{children}</AppDataProvider>
              </QueryClientProvider>
            </PersistGate>
          </ThemeProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default AppProviders;
