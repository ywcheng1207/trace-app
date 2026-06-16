import { StatsSummary } from '@/features/statistics/api/schemas';

export type TrainingOrientation = 'STRENGTH' | 'HYPERTROPHY' | 'ENDURANCE';

export type StatsInsights = {
  orientation: {
    type: TrainingOrientation;
    dominantPct: number;
  };
  muscleBalance: {
    topLabel: string;
    topPct: number;
    bottomLabel: string;
    bottomPct: number;
  };
};

const pct = (value: number, total: number): number =>
  total === 0 ? 0 : Math.round((value / total) * 100);

// 純函式：依區間訓練資料判定訓練取向與肌群均衡度。無副作用、可測。
export const computeInsights = (summary: StatsSummary): StatsInsights | null => {
  if (summary.totalSets === 0 || summary.muscleDistribution.length === 0) return null;

  const { strength, hypertrophy, endurance } = summary.setRepBuckets;
  const bucketTotal = strength + hypertrophy + endurance;
  if (bucketTotal === 0) return null;

  const orientationEntries: { type: TrainingOrientation; value: number }[] = [
    { type: 'STRENGTH', value: strength },
    { type: 'HYPERTROPHY', value: hypertrophy },
    { type: 'ENDURANCE', value: endurance },
  ];
  const dominant = orientationEntries.reduce((best, entry) =>
    entry.value > best.value ? entry : best,
  );

  const muscleTotal = summary.muscleDistribution.reduce((sum, point) => sum + point.value, 0);
  const top = summary.muscleDistribution.reduce((best, point) =>
    point.value > best.value ? point : best,
  );
  const bottom = summary.muscleDistribution.reduce((least, point) =>
    point.value < least.value ? point : least,
  );

  return {
    orientation: {
      type: dominant.type,
      dominantPct: pct(dominant.value, bucketTotal),
    },
    muscleBalance: {
      topLabel: top.label,
      topPct: pct(top.value, muscleTotal),
      bottomLabel: bottom.label,
      bottomPct: pct(bottom.value, muscleTotal),
    },
  };
};
