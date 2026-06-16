import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/ui/card';
import { Fonts, Spacing } from '@/constants/theme';
import { StatPoint } from '@/features/statistics/api/schemas';
import { BarChartView } from '@/features/statistics/components/bar-chart-view';
import { useTheme } from '@/hooks/use-theme';

type MetricTrendCardProps = {
  title: string;
  data: StatPoint[];
  color?: string;
};

export const MetricTrendCard = ({ title, data, color }: MetricTrendCardProps) => {
  const theme = useTheme();

  return (
    <Card>
      <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
      <BarChartView data={data} color={color ?? theme.success} />
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.three,
  },
});
