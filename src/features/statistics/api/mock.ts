import { StatPoint, StatsSummary } from '@/features/statistics/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

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

  const weightTrend = buildTrend(points, 75, 2);
  const bodyFatTrend = buildTrend(points, 18, 2);

  return {
    totalVolume,
    totalSets,
    workouts,
    volumeTrend,
    muscleDistribution,
    weightTrend,
    bodyFatTrend,
  };
};
