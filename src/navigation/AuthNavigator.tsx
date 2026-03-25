import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import LoginScreen from "../screens/Auth/Login/LoginScreen";
import ResetPasswordScreen from "../screens/Auth/Reset/ResetPasswordScreen";
import colors from "../utils/colors";

const Stack = createStackNavigator();

const AUTH_STACK = [
  { name: "Login", component: LoginScreen },
  { name: "ResetPassword", component: ResetPasswordScreen },
  // { name: 'OTPVerification', component: OTPVerificationScreen },
];

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: colors.headerGradientStart },
        headerTintColor: colors.white,
      }}
    >
      {AUTH_STACK.map(({ name, component }) => (
        <Stack.Screen key={name} name={name as any} component={component} />
      ))}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
