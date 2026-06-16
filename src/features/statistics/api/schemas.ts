import { z } from 'zod';

export const statPointSchema = z.object({
  label: z.string(),
  value: z.number(),
});
export type StatPoint = z.infer<typeof statPointSchema>;

export const bodyMetricTrendSchema = z.object({
  field: z.string(),
  trend: z.array(statPointSchema),
});
export type BodyMetricTrend = z.infer<typeof bodyMetricTrendSchema>;

export const setRepBucketsSchema = z.object({
  strength: z.number(),
  hypertrophy: z.number(),
  endurance: z.number(),
});
export type SetRepBuckets = z.infer<typeof setRepBucketsSchema>;

export const statsSummarySchema = z.object({
  totalVolume: z.number(),
  totalSets: z.number(),
  workouts: z.number(),
  volumeTrend: z.array(statPointSchema),
  muscleDistribution: z.array(statPointSchema),
  bodyMetricTrends: z.array(bodyMetricTrendSchema),
  setRepBuckets: setRepBucketsSchema,
});
export type StatsSummary = z.infer<typeof statsSummarySchema>;

export const STATS_RANGES = [7, 30, 90] as const;
export type StatsPreset = (typeof STATS_RANGES)[number];

export type StatsRange =
  | { kind: 'preset'; days: number }
  | { kind: 'custom'; start: string; end: string };

export const serializeStatsRange = (range: StatsRange): string =>
  range.kind === 'preset' ? `preset:${range.days}` : `custom:${range.start}:${range.end}`;
