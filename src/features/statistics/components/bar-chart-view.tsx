import { BarChart } from 'react-native-gifted-charts';

import { StatPoint } from '@/features/statistics/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type BarChartViewProps = {
  data: StatPoint[];
  color?: string;
};

export const BarChartView = ({ data, color }: BarChartViewProps) => {
  const theme = useTheme();
  const barColor = color ?? theme.primary;
  const barData = data.map((point) => ({
    value: point.value,
    label: point.label,
    frontColor: barColor,
  }));

  return (
    <BarChart
      data={barData}
      barWidth={16}
      spacing={14}
      frontColor={barColor}
      hideRules
      yAxisThickness={0}
      xAxisThickness={0}
      noOfSections={4}
      xAxisLabelTextStyle={{ color: theme.muted, fontSize: 10 }}
      yAxisTextStyle={{ color: theme.muted, fontSize: 10 }}
    />
  );
};
