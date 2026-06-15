import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  label: string;
  onPress?: PressableProps['onPress'];
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

const SIZES: Record<ButtonSize, { height: number; fontSize: number; paddingHorizontal: number }> = {
  sm: { height: 36, fontSize: 14, paddingHorizontal: Spacing.three },
  md: { height: 48, fontSize: 16, paddingHorizontal: Spacing.four },
  lg: { height: 56, fontSize: 17, paddingHorizontal: Spacing.four },
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) => {
  const theme = useTheme();
  const sizeStyle = SIZES[size];
  const isDisabled = disabled || loading;

  const backgroundByVariant: Record<ButtonVariant, string> = {
    primary: theme.primary,
    danger: theme.danger,
    secondary: theme.backgroundElement,
    ghost: 'transparent',
  };
  const textByVariant: Record<ButtonVariant, string> = {
    primary: theme.primaryForeground,
    danger: theme.primaryForeground,
    secondary: theme.text,
    ghost: theme.primary,
  };

  const backgroundColor = backgroundByVariant[variant];
  const textColor = textByVariant[variant];
  const borderColor = variant === 'ghost' ? 'transparent' : backgroundColor;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          backgroundColor,
          borderColor,
        },
        fullWidth && styles.fullWidth,
        (pressed || isDisabled) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor, fontSize: sizeStyle.fontSize }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  dimmed: {
    opacity: 0.6,
  },
  label: {
    fontFamily: Fonts.sans,
    fontWeight: '600',
  },
});
