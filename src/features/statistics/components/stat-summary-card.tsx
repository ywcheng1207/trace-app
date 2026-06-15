import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/card';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StatSummaryCardProps = {
  label: string;
  value: string;
};

export const StatSummaryCard = ({ label, value }: StatSummaryCardProps) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1}>
        {label}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
  },
  value: {
    fontFamily: Fonts.sans,
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
});
