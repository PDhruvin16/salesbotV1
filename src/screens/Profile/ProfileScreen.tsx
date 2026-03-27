import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
    Activity,
    Bell,
    Briefcase,
    ChevronRight,
    CreditCard,
    FileText,
    HelpCircle,
    Languages,
    LogOut,
    Mail,
    MapPin,
    Phone,
    Shield,
    Sun,
    Target,
    User,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from "../../components/Button";
import { CustomHeaderProps } from "../../components/Header";
import AppLayout from "../../components/Layouts";
import { Typography } from "../../components/Typography";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { getThemeColors } from "../../utils/colors";
import { normalize } from "../../utils/responsive";
import { getStyles } from "./ProfileStyle";

import { User as AuthUser } from "../../lib/authApi";

const ProfileScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);
  const { user, logout } = useAuth();
  const userData = user as AuthUser | null;
  const navigation = useNavigation();

  const headerProps: CustomHeaderProps = {
    variant: { type: "basic", title: "Profile" },
    onBack: () => navigation.goBack(),
  };

  return (
    <AppLayout headerProps={headerProps}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Typography variant="h1" style={styles.avatarText}>
                  {userData?.first_name
                    ? userData.first_name.charAt(0).toUpperCase()
                    : "R"}
                </Typography>
              </View>
              <View style={styles.onlineStatus} />
            </View>
            <View style={styles.profileMainInfo}>
              <Typography variant="h4" weight="800" style={styles.name}>
                {userData
                  ? `${userData.first_name} ${userData.last_name}`.trim()
                  : "Rajesh Kumar"}
              </Typography>
              <Typography
                variant="body2"
                weight="500"
                style={styles.designation}
              >
                Premium Executive •{" "}
                {(typeof userData?.location === "string"
                  ? userData.location
                  : "Mumbai West") || "Mumbai West"}
              </Typography>
              <View style={styles.badgeRow}>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Typography
                    variant="caption"
                    weight="800"
                    style={[styles.successLabel, styles.fs10]}
                  >
                    ACTIVE
                  </Typography>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.divider, styles.opacity02]} />

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <View style={styles.contactIconBg}>
                <Mail size={normalize(16)} color={themeColors.primary} />
              </View>
              <Typography variant="body2" style={styles.contactText}>
                {userData?.email || "rajesh@toagosei.in"}
              </Typography>
            </View>
            <View style={styles.contactRow}>
              <View style={styles.contactIconBg}>
                <Phone size={normalize(16)} color={themeColors.primary} />
              </View>
              <Typography variant="body2" style={styles.contactText}>
                +91 7984252173
              </Typography>
            </View>
          </View>
        </View>

        {/* Monthly Target Card */}
        <View style={[styles.targetCard, { padding: 0, overflow: 'hidden', backgroundColor: themeColors.primary }]}>
          <View
            style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              padding: normalize(16),
              width: '100%',
              backgroundColor: 'transparent'
            }}
          >
            <View style={[styles.targetIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Target size={normalize(20)} color={themeColors.white} />
            </View>
            <View style={styles.targetInfo}>
              <Typography
                variant="caption"
                weight="600"
                style={[styles.targetLabel, { color: 'rgba(255,255,255,0.8)' }]}
              >
                Monthly Sales Performance
              </Typography>
              <Typography variant="h4" weight="800" style={[styles.targetValue, { color: themeColors.white }]}>
                ₹5,00,000{" "}
                <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Target
                </Typography>
              </Typography>
            </View>
            <View style={[styles.targetProgress, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Typography variant="h5" weight="800" style={{ color: themeColors.white }}>
                68%
              </Typography>
            </View>
          </View>
        </View>

        <Typography
          variant="overline"
          weight="800"
          style={[styles.sectionTitle, styles.mt30]}
        >
          APP SETTINGS
        </Typography>

        <View style={styles.sectionCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[styles.settingIconContainer, styles.orangeIconBg]}
                >
                  <Sun size={normalize(20)} color={themeColors.iconOrange} />
                </View>
                <Typography variant="body1" style={styles.settingText}>
                  Dark Mode
                </Typography>
              </View>
              <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                trackColor={{
                  false: themeColors.lightGray,
                  true: themeColors.primary,
                }}
                thumbColor={themeColors.white}
              />
            </View>
          </View>
        </View>

        {/* Footer Info */}
        <View style={[styles.footerInfo, { marginTop: normalize(30) }]}>
          <Typography variant="caption" style={styles.grayLabel}>
            App Version 2.0.26
          </Typography>
          <Typography variant="caption" style={styles.grayLabel}>
            Last Login: Today, 10:45 AM
          </Typography>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <CustomButton
            title="Logout"
            onPress={logout}
            variant="outline"
            leftIcon={
              <LogOut size={normalize(18)} color={themeColors.primary} />
            }
          />
        </View>
      </ScrollView>
    </AppLayout>
  );
};

export default ProfileScreen;
