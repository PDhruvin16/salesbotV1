import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Lock, Mail, Shield, Zap, TrendingUp } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "../../../components/Button";
import CustomInput from "../../../components/Input";
import Loader from "../../../components/Loader";
import { Typography } from "../../../components/Typography";
import { useTheme } from "../../../hooks/ThemeContext";
import {
  useAuth,
} from "../../../hooks/useAuth";
import {
  PATTERNS,
  validateForm,
  ValidationErrors,
  ValidationRules,
} from "../../../utils/Validator";
import { getThemeColors } from "../../../utils/colors";
import { extractErrorMessage } from "../../../utils/errorMessageExtractor";
import { normalize } from "../../../utils/responsive";
import { showAlert } from "../../../utils/showAlert";
import { getStyles } from "./LoginStyle";

type AuthStackParamList = {
  Login: { message?: string } | undefined;
  ResetPassword: { token?: string; email?: string } | undefined;
  ForgotPassword: undefined;
};

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const FALLBACK_SCROLL_Y = {
  email: 0,
  password: normalize(200),
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const isMountedRef = useRef(true);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const passwordInputRef = useRef<TextInput | null>(null);
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const themeColors = React.useMemo(() => getThemeColors(theme), [theme]);
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);

  const { loginAsync, isLoading } = useAuth();

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    const msg = route?.params?.message;
    if (msg) {
      showAlert("Success", msg);
      navigation.setParams?.({ message: undefined });
    }
  }, [route?.params?.message, navigation]);

  const validationRules: ValidationRules = {
    email: { required: true, pattern: PATTERNS.email, message: "Please enter a valid email address" },
    password: { required: true, minLength: 6, message: "Password must be at least 6 characters" },
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateSingleField(fieldName);
  };

  const validateSingleField = (fieldName: string) => {
    const formData = { email, password };
    const fieldValue = formData[fieldName as keyof typeof formData];
    const fieldRules = validationRules[fieldName];
    if (fieldRules) {
      const fieldErrors = validateForm({ [fieldName]: fieldValue }, { [fieldName]: fieldRules });
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldErrors[fieldName]) next[fieldName] = fieldErrors[fieldName];
        else delete next[fieldName];
        return next;
      });
    }
  };

  const validateAllFields = (): boolean => {
    const formData = { email, password };
    const validationErrors = validateForm(formData, validationRules);
    setErrors(validationErrors);
    const allTouched: { [key: string]: boolean } = {};
    Object.keys(validationRules).forEach((key) => { allTouched[key] = true; });
    setTouched(allTouched);
    setSubmitted(true);
    return Object.keys(validationErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateAllFields()) return;
    try {
      const response = await loginAsync({ email, password });
      
      // If the backend indicates an initial password change is needed:
      // Assuming it might pass force_password_change in data, fallback safely
      const dataAny = response.data as any;
      if (dataAny?.force_password_change) {
        navigation.navigate("ResetPassword", { 
          token: dataAny.access_token || response.data.access, 
          email 
        });
        return;
      }
    } catch (error: unknown) {
      if (isMountedRef.current) {
        const errorMessage = extractErrorMessage(error);
        setErrors((prev) => ({ ...prev, general: errorMessage }));
      }
    }
  };

  const getFieldError = (fieldName: string): string | undefined =>
    touched[fieldName] || submitted ? errors[fieldName] : undefined;

  const scrollToInput = (yOffset: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: Math.max(0, yOffset - normalize(20)), animated: true });
    }, Platform.OS === "android" ? 150 : 100);
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const content = (
    <>
      <Loader visible={isLoading} text="Logging in..." />

      <LinearGradient
        colors={themeColors.appBackgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradientBackground}
      >
        <StatusBar
          translucent
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
          backgroundColor="transparent"
        />
        <View
          style={[
            styles.statusBarMask,
            { height: insets.top, backgroundColor: themeColors.appBackgroundGradient[0] },
          ]}
        />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              keyboardVisible && { paddingBottom: keyboardHeight },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.contentWrapper}>

              {/* ════════════════════════════
                  HERO SECTION (above card)
              ════════════════════════════ */}
              <View style={styles.heroSection}>
                {/* Decorative background blobs */}
                <View style={styles.heroBlob1} />
                <View style={styles.heroBlob2} />
                <View style={styles.heroBlob3} />

                {/* App Logo */}
                <View style={[styles.logoContainer, { overflow: 'hidden', backgroundColor: themeColors.primary }]}>
                  <LinearGradient
                    colors={themeColors.primaryGradient}
                    locations={themeColors.primaryGradientLocations}
                    start={themeColors.primaryGradientStart}
                    end={themeColors.primaryGradientEnd}
                    style={StyleSheet.absoluteFill}
                  />
                  <Zap size={normalize(38)} color="#FFFFFF" strokeWidth={2.5} />
                </View>

                {/* App Name */}
                <View style={{ height: normalize(40), width: '100%' }}>
                  <MaskedView
                    style={{ flex: 1, flexDirection: 'row', height: '100%' }}
                    maskElement={
                      <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Typography style={[styles.appName, { marginBottom: 0 }]}>
                          {"Sales Bot"}
                        </Typography>
                      </View>
                    }
                  >
                    <LinearGradient
                      colors={themeColors.primaryGradient}
                      locations={themeColors.primaryGradientLocations}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ flex: 1 }}
                    />
                  </MaskedView>
                </View>

                {/* Tagline */}
                <Typography style={styles.tagline}>
                  AI-Powered Sales Assistant
                </Typography>

                {/* Trust badges */}
                <View style={styles.badgesRow}>
                  <View style={styles.badge}>
                    <Shield size={normalize(10)} color={themeColors.primary} />
                    <Typography style={styles.badgeText}>SECURE</Typography>
                  </View>
                  <View style={styles.badge}>
                    <TrendingUp size={normalize(10)} color={themeColors.primary} />
                    <Typography style={styles.badgeText}>AI POWERED</Typography>
                  </View>
                  <View style={styles.badge}>
                    <Zap size={normalize(10)} color={themeColors.primary} />
                    <Typography style={styles.badgeText}>FAST</Typography>
                  </View>
                </View>
              </View>

              {/* ════════════════════════════
                  LOGIN CARD
              ════════════════════════════ */}
              <View style={styles.cardWrapper}>
                <View style={styles.card}>

                  {/* "Welcome back to Sales bot 👋" */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: normalize(20) }}>
                    <Typography style={[styles.welcomeText, { marginBottom: 0, textAlignVertical: 'center' }]}>
                      {"Welcome back to "}
                    </Typography>
                    <View style={{ height: normalize(26), justifyContent: 'center', marginTop: Platform.OS === 'ios' ? normalize(2) : 0 }}>
                      <MaskedView
                        style={{ height: normalize(21), width: normalize(115) }}
                        maskElement={
                          <Text style={[styles.welcomeHighlight, { backgroundColor: 'transparent', textAlignVertical: 'center' }]}>
                            {"Sales bot 👋"}
                          </Text>
                        }
                      >
                        <LinearGradient
                          colors={themeColors.primaryGradient}
                          locations={themeColors.primaryGradientLocations}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{ flex: 1 }}
                        >
                           <Text style={[styles.welcomeHighlight, { opacity: 0 }]}>{"Sales bot 👋"}</Text>
                        </LinearGradient>
                      </MaskedView>
                    </View>
                  </View>

                  {/* Email */}
                  <CustomInput
                    label="Email Id"
                    value={email}
                    onFocus={() => scrollToInput(FALLBACK_SCROLL_Y.email)}
                    onChangeText={(text: string) => {
                      setEmail(text.trim());
                      if (errors.general) {
                        setErrors((prev) => { const n = { ...prev }; delete n.general; return n; });
                      }
                      if (touched.email || submitted) validateSingleField("email");
                    }}
                    onBlur={() => handleBlur("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="demo1@yopmail.com"
                    leftIcon={<Mail size={normalize(18)} color={themeColors.gray} />}
                    required
                    error={getFieldError("email")}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      scrollToInput(FALLBACK_SCROLL_Y.password);
                      setTimeout(() => passwordInputRef.current?.focus(), 100);
                    }}
                  />

                  {/* Password */}
                  <CustomInput
                    label="Password"
                    ref={passwordInputRef}
                    value={password}
                    onFocus={() => scrollToInput(FALLBACK_SCROLL_Y.password)}
                    onChangeText={(text: string) => {
                      setPassword(text);
                      if (errors.general) {
                        setErrors((prev) => { const n = { ...prev }; delete n.general; return n; });
                      }
                      if (touched.password || submitted) validateSingleField("password");
                    }}
                    onBlur={() => handleBlur("password")}
                    secureTextEntry
                    placeholder="••••••••"
                    leftIcon={<Lock size={normalize(18)} color={themeColors.gray} />}
                    required
                    error={getFieldError("password")}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />

                  {/* Forgot Password */}
                  <View style={styles.forgotPasswordRow}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgotPassword")}
                      activeOpacity={0.7}
                    >
                      <Typography style={styles.forgotPasswordText}>Forgot password?</Typography>
                    </TouchableOpacity>
                  </View>

                  {/* General error */}
                  {errors.general ? (
                    <Typography style={styles.errorText}>{errors.general}</Typography>
                  ) : null}

                  {/* Login Button */}
                  <CustomButton
                    title="Login"
                    onPress={handleLogin}
                    loading={isLoading}
                    disabled={isLoading}
                    size="medium"
                    variant="primary"
                    style={styles.loginButton}
                  />
                </View>
              </View>


            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </>
  );

  return Platform.OS === "ios" ? (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={0}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    <View style={{ flex: 1 }}>{content}</View>
  );
};

export default LoginScreen;
