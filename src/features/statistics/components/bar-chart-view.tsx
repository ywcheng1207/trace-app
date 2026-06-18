import { StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { StatPoint } from '@/features/statistics/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type BarChartViewProps = {
  data: StatPoint[];
  color?: string;
  unit?: string;
};

type TooltipItem = {
  label?: string;
  value?: number;
};

export const BarChartView = ({ data, color, unit }: BarChartViewProps) => {
  const theme = useTheme();
  const barColor = color ?? theme.primary;
  const barData = data.map((point) => ({ value: point.value, label: point.label }));

  const renderTooltip = (item: TooltipItem) => {
    const formatted = item.value !== undefined ? item.value.toLocaleString() : '';
    const suffix = unit ? ` ${unit}` : '';
    return (
      <View style={[styles.tooltip, { backgroundColor: theme.text }]}>
        <Text style={[styles.tooltipText, { color: theme.background }]}>
          {`${formatted}${suffix}`}
        </Text>
      </View>
    );
  };

  return (
    <BarChart
      data={barData}
      barWidth={14}
      spacing={16}
      initialSpacing={Spacing.two}
      endSpacing={Spacing.two}
      frontColor={barColor}
      barBorderTopLeftRadius={4}
      barBorderTopRightRadius={4}
      rulesType="solid"
      rulesColor={theme.border}
      noOfSections={4}
      yAxisThickness={0}
      xAxisThickness={1}
      xAxisColor={theme.border}
      yAxisLabelWidth={36}
      yAxisTextStyle={{ color: theme.muted, fontSize: 10 }}
      xAxisLabelTextStyle={{ color: theme.muted, fontSize: 10 }}
      isAnimated
      focusBarOnPress
      renderTooltip={renderTooltip}
      leftShiftForTooltip={10}
    />
  );
};

const styles = StyleSheet.create({
  tooltip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.md,
    marginBottom: Spacing.one,
  },
  tooltipText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
});
