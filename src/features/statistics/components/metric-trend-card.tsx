import { StatPoint } from '@/features/statistics/api/schemas';
import { BarChartView } from '@/features/statistics/components/bar-chart-view';
import { ChartCard } from '@/features/statistics/components/chart-card';
import { useTheme } from '@/hooks/use-theme';

type MetricTrendCardProps = {
  title: string;
  data: StatPoint[];
  color?: string;
  unit?: string;
};

export const MetricTrendCard = ({ title, data, color, unit }: MetricTrendCardProps) => {
  const theme = useTheme();

  return (
    <ChartCard title={title}>
      <BarChartView data={data} color={color ?? theme.success} unit={unit} />
    </ChartCard>
  );
};
