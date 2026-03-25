import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useTheme } from "../hooks/ThemeContext";
import { getThemeColors } from "../utils/colors";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";

type Props = {
  isAuthenticated: boolean;
};

const Stack = createStackNavigator();

const RootNavigator = ({ isAuthenticated }: Props) => {
  const { theme } = useTheme();
  const bgColor = getThemeColors(theme).appBackgroundGradient[0];

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: bgColor }, // Theme-aware: prevents flash on auth/app transitions
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
