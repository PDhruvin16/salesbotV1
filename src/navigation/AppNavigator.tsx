import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useTheme } from "../hooks/ThemeContext";
import { getThemeColors } from "../utils/colors";
import BottomTabNavigator from "./BottomTabNavigator";

import { ProfileScreen } from "../screens/Profile";

import ComingSoonScreen from "../screens/ComingSoon";

export type AppStackParamList = {
  Main: undefined;
  Profile: undefined;
  Leads: undefined;
  Conversations: undefined;
  Campaign: undefined;
  KnowledgeBase: undefined;
  Customer: undefined;
  CompanyDetails: undefined;
  Templates: undefined;
  Notifications: undefined;
  Product: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const screens: {
  name: keyof AppStackParamList;
  component: React.ComponentType<any>;
}[] = [
  { name: "Main", component: BottomTabNavigator },
  { name: "Profile", component: ProfileScreen },
  { name: "Leads", component: ComingSoonScreen },
  { name: "Conversations", component: ComingSoonScreen },
  { name: "Campaign", component: ComingSoonScreen },
  { name: "KnowledgeBase", component: ComingSoonScreen },
  { name: "CompanyDetails", component: ComingSoonScreen },
  { name: "Templates", component: ComingSoonScreen },
  { name: "Notifications", component: ComingSoonScreen },
  { name: "Customer", component: ComingSoonScreen },
  { name: "Product", component: ComingSoonScreen },
];

const AppNavigator = () => {
  const { theme } = useTheme();
  const bgColor = getThemeColors(theme).appBackgroundGradient[0];

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: bgColor }, // Theme-aware: prevents white/black flash
      }}
    >
      {screens.map(({ name, component }) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
};

export default AppNavigator;
