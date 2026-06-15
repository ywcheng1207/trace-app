import { differenceInCalendarDays, parseISO } from 'date-fns';

import { BODY_METRIC_FIELDS, BodyMetricField } from '@/features/schedule/api/schemas';
import { StatPoint, StatsRange, StatsSummary } from '@/features/statistics/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const EMPTY_STATS: StatsSummary = {
  totalVolume: 0,
  totalSets: 0,
  workouts: 0,
  volumeTrend: [],
  muscleDistribution: [],
  bodyMetricTrends: [],
  setRepBuckets: { strength: 0, hypertrophy: 0, endurance: 0 },
};

const resolveRangeDays = (range: StatsRange): number => {
  if (range.kind === 'preset') return range.days;
  return Math.max(0, differenceInCalendarDays(parseISO(range.end), parseISO(range.start)) + 1);
};

// mock 訓練資料起始日；自訂區間若結束日早於此，視為尚無資料（demo 用空狀態）。
const DATA_START_KEY = '2026-05-01';
const isEmptyHistoricalRange = (range: StatsRange): boolean =>
  range.kind === 'custom' && range.end < DATA_START_KEY;

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
export const mockGetStats = async (range: StatsRange): Promise<StatsSummary> => {
  await delay(400);

  const rangeDays = resolveRangeDays(range);
  if (rangeDays <= 0 || isEmptyHistoricalRange(range)) return EMPTY_STATS;

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

  const setRepBuckets = {
    strength: Math.round(totalSets * 0.25),
    hypertrophy: Math.round(totalSets * 0.55),
    endurance: Math.round(totalSets * 0.2),
  };

  return {
    totalVolume,
    totalSets,
    workouts,
    volumeTrend,
    muscleDistribution,
    bodyMetricTrends,
    setRepBuckets,
  };
};
