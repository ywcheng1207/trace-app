import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export const ChartCard = ({ title, subtitle, children }: ChartCardProps) => {
  const theme = useTheme();

  return (
    <Card>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
      {children}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: Spacing.half,
    marginBottom: Spacing.three,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
});
