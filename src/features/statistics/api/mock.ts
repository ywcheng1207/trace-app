import { BODY_METRIC_FIELDS, BodyMetricField } from '@/features/schedule/api/schemas';
import { StatPoint, StatsSummary } from '@/features/statistics/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const METRIC_BASE: Record<BodyMetricField, number> = {
  weight: 75,
  bodyFat: 18,
  muscleMass: 35,
  chest: 100,
  waist: 80,
  hips: 95,
  leftThigh: 56,
  rightThigh: 56,
  leftCalf: 38,
  rightCalf: 38,
  leftUpperArm: 38,
  rightUpperArm: 38,
  leftForearm: 28,
  rightForearm: 28,
};

const wave = (index: number, base: number, amplitude: number): number =>
  Math.round(base + amplitude * (0.5 + 0.5 * Math.sin(index * 1.1)));

const buildTrend = (count: number, base: number, amplitude: number): StatPoint[] =>
  Array.from({ length: count }, (_, index) => ({
    label: String(index + 1),
    value: wave(index, base, amplitude),
  }));

// TODO: 換成 apiFetch('/api/stats/all?startDate=&endDate=', { schema: statsSummarySchema })
export const mockGetStats = async (rangeDays: number): Promise<StatsSummary> => {
  await delay(400);

  const points = rangeDays <= 7 ? 7 : 8;
  const volumeTrend = buildTrend(points, 4200, 2400);
  const totalVolume = volumeTrend.reduce((sum, point) => sum + point.value, 0);
  const workouts = Math.max(1, Math.round((rangeDays / 7) * 3));
  const totalSets = workouts * 18;

  const muscleDistribution: StatPoint[] = [
    { label: 'chest', value: 24 },
    { label: 'back', value: 28 },
    { label: 'legs', value: 32 },
    { label: 'shoulders', value: 16 },
    { label: 'arms', value: 20 },
    { label: 'core', value: 12 },
  ];

  const bodyMetricTrends = BODY_METRIC_FIELDS.map((field) => ({
    field,
    trend: buildTrend(points, METRIC_BASE[field], Math.max(1, METRIC_BASE[field] * 0.03)),
  }));

  return {
    totalVolume,
    totalSets,
    workouts,
    volumeTrend,
    muscleDistribution,
    bodyMetricTrends,
  };
};
