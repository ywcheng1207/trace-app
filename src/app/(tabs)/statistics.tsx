import { subDays } from 'date-fns';
import { CalendarRange, SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { DatePicker } from '@/components/ui/date-picker';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { Loading } from '@/components/ui/loading';
import { PageHeader } from '@/components/ui/page-header';
import { Fonts, Spacing } from '@/constants/theme';
import { useProfile } from '@/features/profile/api/hooks';
import { BODY_METRIC_FIELDS } from '@/features/schedule/api/schemas';
import { useStats } from '@/features/statistics/api/hooks';
import { STATS_RANGES, StatPoint, StatsRange } from '@/features/statistics/api/schemas';
import { BarChartView } from '@/features/statistics/components/bar-chart-view';
import { ChartCard } from '@/features/statistics/components/chart-card';
import { InsightCard } from '@/features/statistics/components/insight-card';
import { MetricPreferencesSheet } from '@/features/statistics/components/metric-preferences-sheet';
import { MetricTrendCard } from '@/features/statistics/components/metric-trend-card';
import { StatSummaryCard } from '@/features/statistics/components/stat-summary-card';
import { computeInsights } from '@/features/statistics/insights';
import { toDateKey } from '@/lib/date';
import { useTheme } from '@/hooks/use-theme';

const StatisticsScreen = () => {
  const { t } = useTranslation(['statistics', 'nav', 'muscle', 'schedule']);
  const theme = useTheme();
  const { data: profile } = useProfile();

  const [rangeKind, setRangeKind] = useState<'preset' | 'custom'>('preset');
  const [presetDays, setPresetDays] = useState<number>(30);
  const [customStart, setCustomStart] = useState<string>(toDateKey(subDays(new Date(), 30)));
  const [customEnd, setCustomEnd] = useState<string>(toDateKey(new Date()));
  const [isMetricSheetOpen, setIsMetricSheetOpen] = useState(false);

  const range: StatsRange =
    rangeKind === 'custom'
      ? { kind: 'custom', start: customStart, end: customEnd }
      : { kind: 'preset', days: presetDays };
  const { data, isLoading } = useStats(range);

  const hiddenMetrics = profile?.hiddenMetrics ?? [];
  const visibleBodyFields = BODY_METRIC_FIELDS.filter((field) => !hiddenMetrics.includes(field));
  const trendByField = new Map((data?.bodyMetricTrends ?? []).map((item) => [item.field, item.trend]));
  const hasTraining = data !== undefined && data.totalSets > 0;
  const hasBody = visibleBodyFields.some((field) => (trendByField.get(field) ?? []).length > 0);

  const insights = data ? computeInsights(data) : null;
  const orientationConclusion = insights
    ? t(`insight_orientation_${insights.orientation.type.toLowerCase()}`)
    : '';
  const balanceTop = insights ? t(`muscle:region_${insights.muscleBalance.topLabel}`) : '';
  const balanceBottom = insights ? t(`muscle:region_${insights.muscleBalance.bottomLabel}`) : '';

  const summaryCards = hasTraining
    ? [
        {
          key: 'volume',
          label: t('summary_volume'),
          value: `${data.totalVolume.toLocaleString()} ${t('unit_kg')}`,
        },
        { key: 'sets', label: t('summary_sets'), value: String(data.totalSets) },
        { key: 'workouts', label: t('summary_workouts'), value: String(data.workouts) },
      ]
    : [];

  const muscleData: StatPoint[] = (data?.muscleDistribution ?? []).map((point) => ({
    label: t(`muscle:region_${point.label}`),
    value: point.value,
  }));

  const handlePreset = (days: number) => {
    setPresetDays(days);
    setRangeKind('preset');
  };

  const headerActions = (
    <View style={styles.headerActions}>
      <IconButton
        active={rangeKind === 'custom'}
        onPress={() => setRangeKind('custom')}
        accessibilityLabel={t('range_custom')}
      >
        <CalendarRange
          color={rangeKind === 'custom' ? theme.primary : theme.textSecondary}
          size={20}
        />
      </IconButton>
      <IconButton
        onPress={() => setIsMetricSheetOpen(true)}
        accessibilityLabel={t('metric_preferences_title')}
      >
        <SlidersHorizontal color={theme.textSecondary} size={20} />
      </IconButton>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title={t('nav:statistics')} subtitle={t('subtitle')} right={headerActions} />

        <View style={styles.ranges}>
          {STATS_RANGES.map((rangeOption) => (
            <Chip
              key={rangeOption}
              label={t(`range_${rangeOption}`)}
              selected={rangeKind === 'preset' && presetDays === rangeOption}
              onPress={() => handlePreset(rangeOption)}
            />
          ))}
        </View>

        {rangeKind === 'custom' ? (
          <View style={styles.customRange}>
            <View style={styles.customField}>
              <DatePicker
                label={t('range_start')}
                value={customStart}
                onChange={setCustomStart}
                maxDate={new Date()}
              />
            </View>
            <View style={styles.customField}>
              <DatePicker
                label={t('range_end')}
                value={customEnd}
                onChange={setCustomEnd}
                maxDate={new Date()}
              />
            </View>
          </View>
        ) : null}

        {!data || isLoading ? (
          <View style={styles.loading}>
            <Loading />
          </View>
        ) : (
          <View style={styles.body}>
            {insights ? (
              <View style={styles.insights}>
                <Text style={[styles.section, { color: theme.text }]}>{t('insights_section')}</Text>
                <InsightCard
                  title={t('insight_orientation_title')}
                  conclusion={orientationConclusion}
                  evidence={t('insight_orientation_evidence', {
                    pct: insights.orientation.dominantPct,
                  })}
                />
                <InsightCard
                  title={t('insight_balance_title')}
                  conclusion={t('insight_balance_conclusion', {
                    top: balanceTop,
                    bottom: balanceBottom,
                  })}
                  evidence={t('insight_balance_evidence', {
                    topPct: insights.muscleBalance.topPct,
                    bottomPct: insights.muscleBalance.bottomPct,
                  })}
                />
              </View>
            ) : null}

            <Text style={[styles.section, { color: theme.text }]}>{t('training_section')}</Text>
            {hasTraining ? (
              <View style={styles.body}>
                <View style={styles.summaryRow}>
                  {summaryCards.map((card) => (
                    <StatSummaryCard key={card.key} label={card.label} value={card.value} />
                  ))}
                </View>
                <ChartCard title={t('volume_trend')} subtitle={t('volume_trend_subtitle')}>
                  <BarChartView data={data.volumeTrend} unit={t('unit_kg')} />
                </ChartCard>
                <ChartCard
                  title={t('muscle_distribution')}
                  subtitle={t('muscle_distribution_subtitle')}
                >
                  <BarChartView data={muscleData} color={theme.accent} unit={t('unit_sets')} />
                </ChartCard>
              </View>
            ) : (
              <Card>
                <EmptyState title={t('training_no_data')} description={t('training_no_data_desc')} />
              </Card>
            )}

            <Text style={[styles.section, { color: theme.text }]}>{t('body_section')}</Text>
            {hasBody ? (
              visibleBodyFields.map((field) => (
                <MetricTrendCard
                  key={field}
                  title={t(`schedule:metric_${field}`)}
                  data={trendByField.get(field) ?? []}
                />
              ))
            ) : (
              <Card>
                <EmptyState title={t('body_no_data')} description={t('body_no_data_desc')} />
              </Card>
            )}
          </View>
        )}
      </ScrollView>

      <MetricPreferencesSheet
        visible={isMetricSheetOpen}
        onClose={() => setIsMetricSheetOpen(false)}
      />
    </SafeAreaView>
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  ranges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  customRange: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  customField: {
    flex: 1,
  },
  loading: {
    height: 200,
  },
  body: {
    gap: Spacing.three,
  },
  insights: {
    gap: Spacing.three,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  section: {
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
});
