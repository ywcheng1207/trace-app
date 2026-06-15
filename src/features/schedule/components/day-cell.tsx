import { format } from 'date-fns';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { DaySummary } from '@/features/schedule/api/schemas';
import { CalendarDay } from '@/lib/date';
import { useTheme } from '@/hooks/use-theme';

type DayCellProps = {
  day: CalendarDay;
  summary?: DaySummary;
  onPress: () => void;
};

export const DayCell = ({ day, summary, onPress }: DayCellProps) => {
  const theme = useTheme();

  const numberColor = day.isToday
    ? theme.primaryForeground
    : day.inMonth
      ? theme.text
      : theme.muted;

  return (
    <Pressable onPress={onPress} style={styles.cell}>
      <View style={[styles.inner, day.isToday ? { backgroundColor: theme.primary } : null]}>
        <Text style={[styles.number, { color: numberColor }]}>{format(day.date, 'd')}</Text>
      </View>
      <View style={styles.dots}>
        {summary?.hasPlan ? <View style={[styles.dot, { backgroundColor: theme.primary }]} /> : null}
        {summary?.hasBodyMetric ? (
          <View style={[styles.dot, { backgroundColor: theme.success }]} />
        ) : null}
        {summary?.hasNote ? <View style={[styles.dot, { backgroundColor: theme.accent }]} /> : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: Spacing.one,
    gap: Spacing.half,
  },
  inner: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
    height: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
  },
});
