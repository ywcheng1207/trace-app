import { format, isBefore, startOfToday } from 'date-fns';
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

  const isPast = !day.isToday && isBefore(day.date, startOfToday());
  const numberColor = day.isToday
    ? theme.brandOrange
    : day.inMonth
      ? theme.text
      : theme.muted;

  const planColor = summary?.hasPlan
    ? summary.totalSets > 0 && summary.completedSets >= summary.totalSets
      ? theme.success
      : summary.completedSets > 0
        ? theme.warning
        : theme.primary
    : null;

  return (
    <Pressable onPress={onPress} style={styles.cell}>
      <View
        style={[
          styles.inner,
          { borderColor: 'transparent' },
          day.isToday && { borderColor: theme.brandOrange, backgroundColor: `${theme.brandOrange}1f` },
          isPast && styles.past,
        ]}
      >
        <Text
          style={[styles.number, { color: numberColor }, day.isToday && styles.todayNumber]}
        >
          {format(day.date, 'd')}
        </Text>
        <View style={styles.chips}>
          {planColor ? <View style={[styles.planChip, { backgroundColor: planColor }]} /> : null}
          {summary?.hasBodyMetric ? (
            <View style={[styles.dot, { backgroundColor: theme.success }]} />
          ) : null}
          {summary?.hasNote ? (
            <View style={[styles.dot, { backgroundColor: theme.brandYellow }]} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: `${100 / 7}%`,
    padding: Spacing.half,
  },
  inner: {
    minHeight: 58,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingTop: Spacing.one,
    paddingHorizontal: Spacing.one,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.two,
  },
  past: {
    opacity: 0.45,
  },
  number: {
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  todayNumber: {
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 6,
  },
  planChip: {
    width: 14,
    height: 5,
    borderRadius: Radius.full,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
  },
});
