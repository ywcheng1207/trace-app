import { addMonths, subMonths } from 'date-fns';
import { useRouter } from 'expo-router';
import { CalendarDays, List } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui/icon-button';
import { PageHeader } from '@/components/ui/page-header';
import { Spacing } from '@/constants/theme';
import { useScheduleMonth } from '@/features/schedule/api/hooks';
import { DaySummary } from '@/features/schedule/api/schemas';
import { CalendarMonth } from '@/features/schedule/components/calendar-month';
import { ScheduleListView } from '@/features/schedule/components/schedule-list-view';
import { useTheme } from '@/hooks/use-theme';

type ScheduleView = 'calendar' | 'list';

const ScheduleScreen = () => {
  const { t } = useTranslation('schedule');
  const theme = useTheme();
  const router = useRouter();
  const [month, setMonth] = useState(new Date());
  const [view, setView] = useState<ScheduleView>('calendar');

  const year = month.getFullYear();
  const monthNumber = month.getMonth() + 1;
  const { data } = useScheduleMonth(year, monthNumber);

  const summaryList = data ?? [];
  const summaries = new Map<string, DaySummary>(
    summaryList.map((summary): [string, DaySummary] => [summary.date, summary]),
  );

  const handleSelectDay = (key: string) => router.push(`/schedule/${key}`);

  const viewToggle = (
    <View style={styles.viewToggle}>
      <IconButton
        active={view === 'calendar'}
        onPress={() => setView('calendar')}
        accessibilityLabel={t('view_calendar')}
      >
        <CalendarDays
          color={view === 'calendar' ? theme.primary : theme.textSecondary}
          size={20}
        />
      </IconButton>
      <IconButton
        active={view === 'list'}
        onPress={() => setView('list')}
        accessibilityLabel={t('view_list')}
      >
        <List color={view === 'list' ? theme.primary : theme.textSecondary} size={20} />
      </IconButton>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader
          title={t('calendar_title')}
          subtitle={t('calendar_subtitle')}
          right={viewToggle}
        />
        {view === 'calendar' ? (
          <CalendarMonth
            month={month}
            summaries={summaries}
            onPrev={() => setMonth((current) => subMonths(current, 1))}
            onNext={() => setMonth((current) => addMonths(current, 1))}
            onSelectDay={handleSelectDay}
          />
        ) : (
          <ScheduleListView summaries={summaryList} onSelectDay={handleSelectDay} />
        )}
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
  viewToggle: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
});
