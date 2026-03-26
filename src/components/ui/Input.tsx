import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const { colors, fontSize, fontWeight, spacing, borderRadius } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry !== undefined;

  return (
    <View style={[{ marginBottom: spacing.md }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: fontSize.sm,
            fontWeight: fontWeight.medium,
            color: colors.textSecondary,
            marginBottom: spacing.xs,
            marginLeft: 4,
          }}
        >
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.inputBackground,
          borderRadius: borderRadius.md,
          borderWidth: 1.5,
          borderColor: error ? colors.error : focused ? colors.primary : colors.border,
          paddingHorizontal: spacing.md,
          height: 52,
        }}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={focused ? colors.primary : colors.textSecondary}
            style={{ marginRight: spacing.sm }}
          />
        )}
        <TextInput
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={isPassword ? !showPassword : false}
          placeholderTextColor={colors.textDisabled}
          style={{
            flex: 1,
            color: colors.text,
            fontSize: fontSize.md,
            fontWeight: fontWeight.regular,
          }}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text
          style={{
            color: colors.error,
            fontSize: fontSize.xs,
            marginTop: 4,
            marginLeft: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
