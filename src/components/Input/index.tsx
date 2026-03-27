import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { InputProps } from '../../types/components';
import { getThemeColors, ThemeColors } from '../../utils/colors';
import { moderateScale } from '../../utils/responsive';
import { Typography } from '../Typography';

function CustomInputInner(
  {
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    autoCorrect = false,
    multiline = false,
    numberOfLines = 1,
    error,
    disabled = false,
    leftIcon,
    rightIcon,
    onRightIconPress,
    style,
    inputStyle,
    required = false,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    ...restProps
  }: InputProps & TextInputProps,
  ref: React.Ref<TextInput>,
) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const themeColors = getThemeColors(theme);
  const styles = React.useMemo(() => getStyles(themeColors, theme), [themeColors, theme]);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const combinedInputStyle = React.useMemo(() => {
    const base: (ViewStyle | TextStyle)[] = [styles.input];
    if (isFocused) base.push(styles.focused);
    if (error) base.push(styles.inputError);
    if (disabled) base.push(styles.disabled);
    if (leftIcon) base.push(styles.inputWithLeftIcon);
    if (rightIcon || secureTextEntry) base.push(styles.inputWithRightIcon);
    return [base, inputStyle];
  }, [styles, isFocused, error, disabled, leftIcon, rightIcon, secureTextEntry, inputStyle]);

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity style={styles.iconContainer} onPress={togglePasswordVisibility}>
          {showPassword ? (
            <Eye size={moderateScale(20)} color={themeColors.primary} />
          ) : (
            <EyeOff size={moderateScale(20)} color={themeColors.gray} />
          )}
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      const content =
        typeof rightIcon === 'string' ? (
          <Text style={styles.iconText}>{rightIcon}</Text>
        ) : (
          rightIcon
        );
      return (
        <TouchableOpacity style={styles.iconContainer} onPress={onRightIconPress}>
          {content}
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, style] as any}>
      {label && (
        <Typography variant="label" style={styles.label}>
          {label}
          {required && (
            <Typography variant="label" style={styles.required}>
              {' '}
              *
            </Typography>
          )}
        </Typography>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.focusedContainer : null,
          error ? styles.errorContainer : null,
          disabled ? styles.disabledContainer : null,
          multiline ? styles.multilineAlign : null,
        ]}
      >
        {leftIcon && (
          <View style={[styles.leftIconContainer, multiline && styles.multilineLeftIcon]}>
            {typeof leftIcon === 'string' ? (
              <Text style={styles.iconText}>{leftIcon}</Text>
            ) : (
              leftIcon
            )}
          </View>
        )}

        <TextInput
          {...restProps}
          ref={ref}
          style={combinedInputStyle as any}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={themeColors.gray}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={(e) => {
            handleFocus();
            onFocusProp?.(e);
          }}
          onBlur={(e) => {
            handleBlur();
            onBlurProp?.(e);
          }}
        />

        {renderRightIcon()}
      </View>

      {error && (
        <Typography variant="caption" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
}

const CustomInput = React.forwardRef(CustomInputInner) as React.ForwardRefExoticComponent<
  InputProps & TextInputProps & React.RefAttributes<TextInput>
>;

const getStyles = (themeColors: ThemeColors, theme: string) =>
  StyleSheet.create({
    container: {
      marginBottom: moderateScale(16),
    },
    label: {
      marginBottom: moderateScale(6),
      fontFamily: 'DMSans-Medium',
    },
    required: {
      color: themeColors.error,
    },

    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
      borderRadius: moderateScale(16),
      backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.08)',
    },
    focusedContainer: {
      borderColor: themeColors.primary,
      backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.01)' : 'rgba(255,255,255,0.02)',
    },
    errorContainer: {
      borderColor: themeColors.error,
    },
    disabledContainer: {
      backgroundColor: themeColors.lightGray,
      opacity: 0.6,
    },
    input: {
      flex: 1,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(14),
      fontSize: moderateScale(15),
      fontFamily: 'DMSans-Regular',
      color: themeColors.dark,
      minHeight: moderateScale(48),
    },
    focused: {
      borderColor: themeColors.primary,
    },
    iconContainer: {
      paddingHorizontal: moderateScale(12),
    },
    iconText: {
      fontSize: moderateScale(16),
      color: themeColors.gray,
    },

    inputWithLeftIcon: {
      paddingLeft: moderateScale(4),
    },
    inputWithRightIcon: {
      paddingRight: moderateScale(4),
    },

    inputError: {
      borderColor: themeColors.error,
    },
    disabled: {
      backgroundColor: themeColors.lightGray,
      opacity: 0.6,
    },
    leftIconContainer: {
      paddingLeft: moderateScale(14),
      paddingRight: moderateScale(4),
    },
    multilineLeftIcon: {
      marginTop: moderateScale(12),
    },
    errorText: {
      color: themeColors.error,
      fontSize: moderateScale(12),
      marginTop: moderateScale(4),
    },
    multilineAlign: {
      alignItems: 'flex-start',
    },
  });

CustomInput.displayName = 'CustomInput';

export default CustomInput;
