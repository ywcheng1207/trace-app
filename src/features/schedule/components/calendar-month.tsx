import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Fonts, Spacing } from '@/constants/theme';
import { DaySummary } from '@/features/schedule/api/schemas';
import { DayCell } from '@/features/schedule/components/day-cell';
import { buildMonthGrid } from '@/lib/date';
import { useTheme } from '@/hooks/use-theme';

type CalendarMonthProps = {
  month: Date;
  summaries: Map<string, DaySummary>;
  onPrev: () => void;
  onNext: () => void;
  onSelectDay: (key: string) => void;
};

const WEEKDAY_INDEXES = [0, 1, 2, 3, 4, 5, 6];

export const CalendarMonth = ({
  month,
  summaries,
  onPrev,
  onNext,
  onSelectDay,
}: CalendarMonthProps) => {
  const { t } = useTranslation('schedule');
  const theme = useTheme();
  const days = buildMonthGrid(month);

  return (
    <Card>
      <View style={styles.header}>
        <Pressable onPress={onPrev} hitSlop={8}>
          <ChevronLeft color={theme.text} size={22} />
        </Pressable>
        <Text style={[styles.monthLabel, { color: theme.text }]}>
          {format(month, 'yyyy / MM')}
        </Text>
        <Pressable onPress={onNext} hitSlop={8}>
          <ChevronRight color={theme.text} size={22} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAY_INDEXES.map((index) => (
          <Text key={index} style={[styles.weekday, { color: theme.textSecondary }]}>
            {t(`weekday${index}`)}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day) => (
          <DayCell
            key={day.key}
            day={day}
            summary={summaries.get(day.key)}
            onPress={() => onSelectDay(day.key)}
          />
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  monthLabel: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.two,
  },
});
