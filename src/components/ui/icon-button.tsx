import { type ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  active?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
};

export const IconButton = ({
  children,
  onPress,
  active = false,
  disabled = false,
  accessibilityLabel,
}: IconButtonProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active, disabled }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: active ? theme.backgroundSelected : 'transparent' },
        pressed && !active && { backgroundColor: theme.backgroundElement },
        disabled && styles.disabled,
      ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.lg,
  },
  disabled: {
    opacity: 0.4,
  },
});
