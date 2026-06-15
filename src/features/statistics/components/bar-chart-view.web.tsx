import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { StatPoint } from '@/features/statistics/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type BarChartViewProps = {
  data: StatPoint[];
  color?: string;
};

const MAX_HEIGHT = 140;

export const BarChartView = ({ data, color }: BarChartViewProps) => {
  const theme = useTheme();
  const barColor = color ?? theme.primary;
  const max = Math.max(...data.map((point) => point.value), 1);

  return (
    <View style={styles.row}>
      {data.map((point) => (
        <View key={point.label} style={styles.col}>
          <View
            style={[
              styles.bar,
              { height: Math.max(4, (point.value / max) * MAX_HEIGHT), backgroundColor: barColor },
            ]}
          />
          <Text style={[styles.label, { color: theme.muted }]} numberOfLines={1}>
            {point.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.one,
    height: MAX_HEIGHT + 24,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  bar: {
    width: '70%',
    borderTopLeftRadius: Radius.sm,
    borderTopRightRadius: Radius.sm,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 10,
  },
});
