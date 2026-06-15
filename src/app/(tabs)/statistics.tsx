import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Loading } from '@/components/ui/loading';
import { PageHeader } from '@/components/ui/page-header';
import { Fonts, Spacing } from '@/constants/theme';
import { useStats } from '@/features/statistics/api/hooks';
import { STATS_RANGES, StatPoint } from '@/features/statistics/api/schemas';
import { BarChartView } from '@/features/statistics/components/bar-chart-view';
import { StatSummaryCard } from '@/features/statistics/components/stat-summary-card';
import { useTheme } from '@/hooks/use-theme';

const StatisticsScreen = () => {
  const { t } = useTranslation(['statistics', 'nav', 'muscle']);
  const theme = useTheme();
  const [rangeDays, setRangeDays] = useState<number>(30);
  const { data, isLoading } = useStats(rangeDays);

  const summaryCards = data
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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title={t('nav:statistics')} subtitle={t('subtitle')} />

        <View style={styles.ranges}>
          {STATS_RANGES.map((range) => (
            <Chip
              key={range}
              label={t(`range_${range}`)}
              selected={rangeDays === range}
              onPress={() => setRangeDays(range)}
            />
          ))}
        </View>

        {!data || isLoading ? (
          <View style={styles.loading}>
            <Loading />
          </View>
        ) : (
          <View style={styles.body}>
            <View style={styles.summaryRow}>
              {summaryCards.map((card) => (
                <StatSummaryCard key={card.key} label={card.label} value={card.value} />
              ))}
            </View>

            <Text style={[styles.section, { color: theme.text }]}>{t('training_section')}</Text>
            <Card>
              <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>
                {t('volume_trend')}
              </Text>
              <BarChartView data={data.volumeTrend} />
            </Card>
            <Card>
              <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>
                {t('muscle_distribution')}
              </Text>
              <BarChartView data={muscleData} color={theme.accent} />
            </Card>

            <Text style={[styles.section, { color: theme.text }]}>{t('body_section')}</Text>
            <Card>
              <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>
                {t('weight_trend')}
              </Text>
              <BarChartView data={data.weightTrend} color={theme.success} />
            </Card>
            <Card>
              <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>
                {t('body_fat_trend')}
              </Text>
              <BarChartView data={data.bodyFatTrend} color={theme.warning} />
            </Card>
          </View>
        )}
      </ScrollView>
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
  ranges: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  loading: {
    height: 200,
  },
  body: {
    gap: Spacing.three,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  section: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  chartTitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.three,
  },
});
