import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;

  Login: undefined;
  OTPVerification: { phone?: string };

  Home: undefined;
  BeatPlan: undefined;
  Outlets: undefined;
  Requests: undefined;
  Profile: undefined;
  Order: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function setNavigationRef(_: unknown) {
  // kept for backward compatibility
}
