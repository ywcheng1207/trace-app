import { addMonths, format, parseISO, startOfDay, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Sheet } from '@/components/ui/sheet';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { buildMonthGrid, toDateKey } from '@/lib/date';
import { useTheme } from '@/hooks/use-theme';

type DatePickerProps = {
  value: string | null;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  maxDate?: Date;
};

const WEEKDAY_INDEXES = [0, 1, 2, 3, 4, 5, 6];

export const DatePicker = ({ value, onChange, label, placeholder, maxDate }: DatePickerProps) => {
  const { t } = useTranslation('schedule');
  const theme = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => (value ? parseISO(value) : new Date()));

  const days = buildMonthGrid(viewMonth);
  const maxTime = maxDate ? startOfDay(maxDate).getTime() : null;

  const handlePick = (date: Date) => {
    onChange(toDateKey(date));
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text> : null}
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[styles.field, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
      >
        <Text style={[styles.value, { color: value ? theme.text : theme.muted }]}>
          {value ? format(parseISO(value), 'yyyy / MM / dd') : (placeholder ?? '')}
        </Text>
      </Pressable>

      <Sheet visible={isOpen} onClose={() => setIsOpen(false)} title={label}>
        <View style={styles.calendar}>
          <View style={styles.header}>
            <Pressable onPress={() => setViewMonth((current) => subMonths(current, 1))} hitSlop={8}>
              <ChevronLeft color={theme.text} size={22} />
            </Pressable>
            <Text style={[styles.monthLabel, { color: theme.text }]}>
              {format(viewMonth, 'yyyy / MM')}
            </Text>
            <Pressable onPress={() => setViewMonth((current) => addMonths(current, 1))} hitSlop={8}>
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
            {days.map((day) => {
              const isSelected = value === day.key;
              const isDisabled = maxTime !== null && startOfDay(day.date).getTime() > maxTime;
              const numberColor = isSelected
                ? theme.primaryForeground
                : isDisabled
                  ? theme.muted
                  : day.inMonth
                    ? theme.text
                    : theme.muted;
              return (
                <Pressable
                  key={day.key}
                  onPress={() => handlePick(day.date)}
                  disabled={isDisabled}
                  style={styles.cell}
                >
                  <View style={[styles.cellInner, isSelected && { backgroundColor: theme.primary }]}>
                    <Text style={[styles.cellNumber, { color: numberColor }]}>
                      {format(day.date, 'd')}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '500',
  },
  field: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  value: {
    fontFamily: Fonts.sans,
    fontSize: 16,
  },
  calendar: {
    paddingBottom: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  monthLabel: {
    fontFamily: Fonts.sans,
    fontSize: 17,
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
  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  cellInner: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellNumber: {
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
});
