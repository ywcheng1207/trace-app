import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { BODY_METRIC_FIELDS } from '@/features/schedule/api/schemas';
import {
  serializeStatsRange,
  StatsSummary,
  StatsRange,
} from '@/features/statistics/api/schemas';
import { apiFetch } from '@/lib/api/api-fetch';
import { QUERY_KEYS } from '@/lib/query/query-keys';

//
// Internal schema — transforms complex backend response to StatsSummary
//

const STATS_METRIC_FIELDS = ['weight', 'bodyFat', 'muscleMass'] as const;
type StatsMetricField = (typeof STATS_METRIC_FIELDS)[number];

const statsResponseSchema = z
  .object({
    ok: z.boolean(),
    summary: z.object({
      totalVolume: z.number(),
      totalSets: z.number(),
      completedWorkouts: z.number(),
    }),
    volumeData: z.array(z.object({ date: z.string(), volume: z.number() })),
    distribution: z.array(z.object({ name: z.string(), value: z.number() })),
    metrics: z.array(
      z.object({
        date: z.string(),
        weight: z.number().nullable(),
        bodyFat: z.number().nullable(),
        muscleMass: z.number().nullable(),
      }),
    ),
    setRepBuckets: z
      .object({
        strength: z.number(),
        hypertrophy: z.number(),
        endurance: z.number(),
      })
      .optional(),
  })
  .transform((data): StatsSummary => {
    const bodyMetricTrends = BODY_METRIC_FIELDS.map((field) => {
      if (!STATS_METRIC_FIELDS.includes(field as StatsMetricField)) {
        return { field, trend: [] };
      }
      const tracked = field as StatsMetricField;
      return {
        field,
        trend: data.metrics
          .filter((m) => m[tracked] !== null)
          .map((m) => ({
            label: m.date.slice(5),
            value: m[tracked] as number,
          })),
      };
    });

    return {
      totalVolume: data.summary.totalVolume,
      totalSets: data.summary.totalSets,
      workouts: data.summary.completedWorkouts,
      volumeTrend: data.volumeData.map((d) => ({
        label: d.date.slice(5),
        value: d.volume,
      })),
      muscleDistribution: data.distribution.map((d) => ({
        label: d.name.toLowerCase(),
        value: d.value,
      })),
      bodyMetricTrends,
      setRepBuckets: data.setRepBuckets ?? { strength: 0, hypertrophy: 0, endurance: 0 },
    };
  });

//
// Hook
//

const buildStatsUrl = (range: StatsRange): string => {
  if (range.kind === 'preset') {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - range.days + 1);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    return `/api/stats/all?startDate=${fmt(start)}&endDate=${fmt(end)}`;
  }
  return `/api/stats/all?startDate=${range.start}&endDate=${range.end}`;
};

export const useStats = (range: StatsRange) => {
  return useQuery({
    queryKey: QUERY_KEYS.stats(serializeStatsRange(range)),
    queryFn: () => apiFetch(buildStatsUrl(range), { schema: statsResponseSchema }),
    staleTime: 1000 * 60,
  });
};
