import { router, useNavigation } from "expo-router";
import { Filter, Zap, Mail, Lock, User, CheckCircle, Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from "react-native-reanimated";
import { CustomHeaderProps } from "../../components/Header";
import AppLayout from "../../components/Layouts";
import { Typography } from "../../components/Typography";
import CustomButton from "../../components/Button";
import CustomInput from "../../components/Input";
import Loader from "../../components/Loader";
import Skeleton from "../../components/Skeleton";
import Popup from "../../components/Popup";
import CustomDropdown from "../../components/Dropdown";
import AppBottomSheet from "../../components/BottomSheet";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { User as AuthUser } from "../../lib/authApi";
import { getThemeColors } from "../../utils/colors";
import { normalize } from "../../utils/responsive";
import { getStyles } from "./HomeStyle";

const SelectionCard: React.FC<{
  title: string;
  themeColors: any;
  children: React.ReactNode;
}> = ({ title, themeColors, children }) => (
  <View style={{
    backgroundColor: themeColors.white,
    borderRadius: normalize(16),
    padding: normalize(16),
    marginBottom: normalize(20),
    borderWidth: 1,
    borderColor: themeColors.border,
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  }}>
    <Typography variant="h3" style={{ marginBottom: normalize(16), color: themeColors.dark }}>
      {title}
    </Typography>
    {children}
  </View>
);

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<Record<string, unknown>>();
  const themeColors = useMemo(() => getThemeColors(theme), [theme]);
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);
  
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const [singleDropdownValue, setSingleDropdownValue] = useState<string>("");
  const [multiDropdownValues, setMultiDropdownValues] = useState<(string | number)[]>([]);
  const [multiSearchableDropdownValues, setMultiSearchableDropdownValues] = useState<(string | number)[]>([]);
  const [dynamicOptions, setDynamicOptions] = useState([
    { id: "1", label: "Option 1", value: "opt1" },
    { id: "2", label: "Option 2", value: "opt2" },
    { id: "3", label: "Option 3", value: "opt3" },
  ]);
  const [searchableDropdownValue, setSearchableDropdownValue] = useState<string>("");

  const headerConfig: CustomHeaderProps = {
    variant: {
      type: "home",
      title: user
        ? `${(user as AuthUser).first_name} ${(user as AuthUser).last_name}`.trim()
        : "Admin",
      subtitle: "Premium Dashboard",
      location: undefined,
      showProfile: true,
      profileImage: undefined,
    },
    onNotificationPress: () =>
      (navigation as unknown as { navigate: (name: string) => void }).navigate(
        "Notifications",
      ),
    onProfilePress: () => router.push("/(tabs)/settings"),
    notificationCount: 3,
  };

  const handleCreateOptionSingle = (newLabel: string) => {
    const newOption = {
      id: Date.now().toString(),
      label: newLabel,
      value: newLabel.toLowerCase().replace(/\s+/g, "_"),
    };
    setDynamicOptions([...dynamicOptions, newOption]);
    setSearchableDropdownValue(newOption.value);
  };

  const handleCreateOptionMulti = (newLabel: string) => {
    const newOption = {
      id: Date.now().toString(),
      label: newLabel,
      value: newLabel.toLowerCase().replace(/\s+/g, "_"),
    };
    setDynamicOptions([...dynamicOptions, newOption]);
    setMultiSearchableDropdownValues([...multiSearchableDropdownValues, newOption.value]);
  };

  return (
    <AppLayout headerProps={headerConfig}>
      {/* Dashboard Header Title Row */}
      <Animated.View
        entering={FadeInDown.duration(600).springify().damping(20)}
        style={styles.headerTop}
      >
        <View>
          <Typography
            style={[
              styles.dashboardTitle,
              styles.dashboardTitleLarge,
              styles.themedDashboardTitle,
            ]}
          >
            Components
          </Typography>
          <Typography
            style={[
              styles.dashboardSubtitle,
              styles.marginTop4,
              styles.themedDashboardSubtitle,
            ]}
          >
            Showcase of all UI Elements
          </Typography>
        </View>
        <TouchableOpacity
          style={[styles.filterButton, styles.themedFilterButton]}
        >
          <Filter size={normalize(20)} color={themeColors.dark} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.flex1}
        contentContainerStyle={{ padding: normalize(20), paddingBottom: normalize(100) }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.delay(100).duration(600).springify().damping(20)}
        >
          <View
            style={{
              borderRadius: normalize(20),
              shadowColor: themeColors.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 15,
              elevation: 10,
              marginBottom: normalize(24),
              overflow: 'hidden',
              backgroundColor: themeColors.primary, // Fallback color
            }}
          >
            <View
              style={{
                padding: normalize(24),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: normalize(16),
                  borderRadius: normalize(50),
                  marginBottom: normalize(16)
              }}>
                  <Zap size={normalize(32)} color="#FFFFFF" />
              </View>
              <Typography variant="h2" style={{ color: "#FFFFFF", marginBottom: normalize(8), textAlign: 'center' }}>
                Welcome to salesBot UI
              </Typography>
              <Typography variant="body1" style={{ color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 22 }}>
                Explore the entire library of custom-built, premium React Native components designed for peak performance and aesthetics.
              </Typography>
            </View>
          </View>
          
          {/* Typography Section */}
          <SelectionCard title="Typography" themeColors={themeColors}>
             <Typography variant="h1" style={{color: themeColors.dark}}>Heading 1</Typography>
             <Typography variant="h2" style={{marginTop: 8, color: themeColors.dark}}>Heading 2</Typography>
             <Typography variant="h3" style={{marginTop: 8, color: themeColors.dark}}>Heading 3</Typography>
             <Typography variant="body1" style={{marginTop: 8, color: themeColors.dark}}>Body 1 - Regular text used for standard content.</Typography>
             <Typography variant="body2" style={{marginTop: 8, color: themeColors.dark}}>Body 2 - Secondary text with a smaller footprint.</Typography>
             <Typography variant="caption" style={{marginTop: 8, color: themeColors.gray}}>Caption - For very small descriptive text.</Typography>
          </SelectionCard>

          {/* Buttons Section */}
          <SelectionCard title="Buttons" themeColors={themeColors}>
             <View style={{ gap: normalize(12) }}>
               <CustomButton title="Primary Button" variant="primary" onPress={() => {}} />
               <CustomButton title="Secondary Button" variant="secondary" onPress={() => {}} />
               <CustomButton title="Outline Button" variant="outline" onPress={() => {}} />
               <CustomButton title="Light Button" variant="light" onPress={() => {}} />
               <CustomButton title="With Icon" variant="primary" leftIcon={<CheckCircle size={18} color="#fff" />} onPress={() => {}} />
               <CustomButton title="Loading..." variant="primary" loading={true} onPress={() => {}} />
             </View>
          </SelectionCard>

          {/* Inputs Section */}
          <SelectionCard title="Inputs" themeColors={themeColors}>
             <CustomInput 
               label="Standard Input" 
               placeholder="Enter typical text here..."
               value=""
               onChangeText={() => {}}
             />
             <CustomInput 
               label="With Left Icon" 
               placeholder="Search..." 
               leftIcon={<Search size={18} color={themeColors.gray} />}
               value=""
               onChangeText={() => {}}
             />
             <CustomInput 
               label="Password Input" 
               placeholder="Enter secure password" 
               secureTextEntry={true}
               value="password123"
               onChangeText={() => {}}
             />
             <CustomInput 
               label="Input with Error" 
               placeholder="Invalid email address" 
               error="Please enter a valid business email."
               value="wrongemail@"
               onChangeText={() => {}}
             />
          </SelectionCard>
          
          {/* Dropdown Section */}
          <SelectionCard title="Dropdowns" themeColors={themeColors}>
             <View style={{ gap: normalize(16) }}>
               <CustomDropdown
                 label="Single Select"
                 options={dynamicOptions}
                 value={singleDropdownValue}
                 onChange={(val) => setSingleDropdownValue(val as string)}
                 placeholder="Choose one option..."
               />
               
               <CustomDropdown
                 label="Multi Select"
                 mode="multi"
                 options={dynamicOptions}
                 values={multiDropdownValues}
                 onChangeMulti={(vals) => setMultiDropdownValues(vals)}
                 placeholder="Choose multiple options..."
               />
               
               <CustomDropdown
                 label="Single Search & Create"
                 options={dynamicOptions}
                 value={searchableDropdownValue}
                 onChange={(val) => setSearchableDropdownValue(val as string)}
                 placeholder="Search or create new..."
                 searchable
                 enableCreate
                 onCreateOption={handleCreateOptionSingle}
               />

               <CustomDropdown
                 label="Multi Search & Create"
                 mode="multi"
                 options={dynamicOptions}
                 values={multiSearchableDropdownValues}
                 onChangeMulti={(vals) => setMultiSearchableDropdownValues(vals)}
                 placeholder="Search, check, or create..."
                 searchable
                 enableCreate
                 onCreateOption={handleCreateOptionMulti}
               />
             </View>
          </SelectionCard>

          {/* Loaders Section */}
          <SelectionCard title="Loaders & Spinners" themeColors={themeColors}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20 }}>
               <Loader visible={true} size="small" overlay={false} text="" />
               <Loader visible={true} size="large" overlay={false} text="Syncing..." />
             </View>
          </SelectionCard>
          
          {/* Skeletons Section */}
          <SelectionCard title="Skeleton Loading" themeColors={themeColors}>
             <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Skeleton variant="circular" width={60} height={60} />
                <View style={{ marginLeft: 16, flex: 1 }}>
                  <Skeleton variant="text" height={16} width="80%" />
                  <Skeleton variant="text" height={12} width="50%" />
                </View>
             </View>
             <Skeleton variant="rectangular" height={120} />
          </SelectionCard>

           <SelectionCard title="Modals & Popups" themeColors={themeColors}>
              <Typography variant="body2" style={{ marginBottom: 16, color: themeColors.dark }}>
                Interactive popups and dialogue boxes.
              </Typography>
              <View style={{ gap: 12 }}>
                <CustomButton title="Show Popup" variant="outline" onPress={() => setPopupVisible(true)} />
                <CustomButton title="Show Action Sheet" variant="outline" onPress={() => setActionSheetVisible(true)} />
              </View>
           </SelectionCard>

        </Animated.View>
      </ScrollView>
      
      {/* Global Modals Map */}
      <Popup
        isOpen={isPopupVisible}
        title="Component Popup"
        message="This is an elegant popup used across the application to confirm active user events."
        confirmLabel="Awesome"
        cancelLabel="Dismiss"
        onConfirm={() => setPopupVisible(false)}
        onClose={() => setPopupVisible(false)}
      />

      <AppBottomSheet
        visible={isActionSheetVisible}
        onClose={() => setActionSheetVisible(false)}
        title="Sample Action Sheet"
        subtitle="This is a premium action sheet component with selectable options."
        options={[
          { label: 'View Profile', onPress: () => console.log('Profile') },
          { label: 'Edit Settings', onPress: () => console.log('Settings') },
          { label: 'Delete Account', onPress: () => console.log('Delete'), variant: 'destructive' },
        ]}
      />
    </AppLayout>
  );
};

export default HomeScreen;
