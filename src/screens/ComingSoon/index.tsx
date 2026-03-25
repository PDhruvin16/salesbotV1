import { Clock3 } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Typography } from "../../components/Typography";
import { useTheme } from "../../hooks/ThemeContext";
import { getThemeColors } from "../../utils/colors";
import { normalize } from "../../utils/responsive";

const ComingSoonScreen = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
        <Clock3 size={normalize(48)} color={colors.primary} />
      </View>
      <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: normalize(8) }}>
        Coming Soon
      </Typography>
      <Typography variant="body1" style={{ color: colors.text.secondary, textAlign: "center" }}>
        This feature is currently under development. Please check back later!
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: normalize(24),
  },
  iconContainer: {
    width: normalize(96),
    height: normalize(96),
    borderRadius: normalize(48),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: normalize(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default ComingSoonScreen;
