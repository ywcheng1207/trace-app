import { z } from 'zod';

export const statPointSchema = z.object({
  label: z.string(),
  value: z.number(),
});
export type StatPoint = z.infer<typeof statPointSchema>;

export const statsSummarySchema = z.object({
  totalVolume: z.number(),
  totalSets: z.number(),
  workouts: z.number(),
  volumeTrend: z.array(statPointSchema),
  muscleDistribution: z.array(statPointSchema),
  weightTrend: z.array(statPointSchema),
  bodyFatTrend: z.array(statPointSchema),
});
export type StatsSummary = z.infer<typeof statsSummarySchema>;

export const STATS_RANGES = [7, 30, 90] as const;
export type StatsRange = (typeof STATS_RANGES)[number];
