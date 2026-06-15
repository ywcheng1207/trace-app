import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  icon: {
    marginBottom: Spacing.one,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  action: {
    marginTop: Spacing.three,
  },
});
