import { format, getDay, parseISO } from 'date-fns';
import { ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Fonts, Spacing } from '@/constants/theme';
import { DaySummary } from '@/features/schedule/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type ScheduleListViewProps = {
  summaries: DaySummary[];
  onSelectDay: (key: string) => void;
};

type ScheduleListItemProps = {
  summary: DaySummary;
  onPress: () => void;
};

const ScheduleListItem = ({ summary, onPress }: ScheduleListItemProps) => {
  const { t } = useTranslation('schedule');
  const theme = useTheme();

  const date = parseISO(summary.date);
  const dateLabel = `${format(date, 'MM/dd')} · ${t(`weekday${getDay(date)}`)}`;
  const planVariant =
    summary.totalSets > 0 && summary.completedSets >= summary.totalSets
      ? 'success'
      : summary.completedSets > 0
        ? 'warning'
        : 'primary';

  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={[styles.date, { color: theme.text }]}>{dateLabel}</Text>
            <View style={styles.badges}>
              {summary.hasPlan ? (
                <Badge
                  label={`${t('training_plan')} ${summary.completedSets}/${summary.totalSets}`}
                  variant={planVariant}
                />
              ) : null}
              {summary.hasBodyMetric ? (
                <Badge label={t('body_metric')} variant="success" />
              ) : null}
              {summary.hasNote ? <Badge label={t('note')} variant="warning" /> : null}
            </View>
          </View>
          <ChevronRight color={theme.muted} size={20} />
        </View>
      </Card>
    </Pressable>
  );
};

export const ScheduleListView = ({ summaries, onSelectDay }: ScheduleListViewProps) => {
  const { t } = useTranslation('schedule');

  const withData = summaries
    .filter((summary) => summary.hasPlan || summary.hasBodyMetric || summary.hasNote)
    .sort((left, right) => left.date.localeCompare(right.date));

  if (withData.length === 0) {
    return <EmptyState title={t('list_empty_title')} description={t('list_empty_desc')} />;
  }

  return (
    <View style={styles.list}>
      {withData.map((summary) => (
        <ScheduleListItem
          key={summary.date}
          summary={summary}
          onPress={() => onSelectDay(summary.date)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  info: {
    flex: 1,
    gap: Spacing.two,
  },
  date: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
});
