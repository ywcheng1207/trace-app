import { addMonths, subMonths } from 'date-fns';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PageHeader } from '@/components/ui/page-header';
import { Spacing } from '@/constants/theme';
import { useScheduleMonth } from '@/features/schedule/api/hooks';
import { DaySummary } from '@/features/schedule/api/schemas';
import { CalendarMonth } from '@/features/schedule/components/calendar-month';
import { useTheme } from '@/hooks/use-theme';

const ScheduleScreen = () => {
  const { t } = useTranslation('schedule');
  const theme = useTheme();
  const router = useRouter();
  const [month, setMonth] = useState(new Date());

  const year = month.getFullYear();
  const monthNumber = month.getMonth() + 1;
  const { data } = useScheduleMonth(year, monthNumber);

  const summaries = new Map<string, DaySummary>(
    (data ?? []).map((summary): [string, DaySummary] => [summary.date, summary]),
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title={t('calendar_title')} subtitle={t('calendar_subtitle')} />
        <CalendarMonth
          month={month}
          summaries={summaries}
          onPrev={() => setMonth((current) => subMonths(current, 1))}
          onNext={() => setMonth((current) => addMonths(current, 1))}
          onSelectDay={(key) => router.push(`/schedule/${key}`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
