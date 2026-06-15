import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

export const Badge = ({ label, variant = 'default' }: BadgeProps) => {
  const theme = useTheme();

  const colorByVariant: Record<BadgeVariant, string> = {
    default: theme.muted,
    primary: theme.primary,
    success: theme.success,
    danger: theme.danger,
    warning: theme.warning,
  };
  const color = colorByVariant[variant];

  return (
    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}55` }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
});
