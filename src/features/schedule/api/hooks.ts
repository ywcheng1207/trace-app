import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import {
  bodyMetricSchema,
  BodyMetric,
  DaySummary,
  TrainingPlan,
} from '@/features/schedule/api/schemas';
import { apiFetch } from '@/lib/api/api-fetch';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

//
// Internal response schemas
//

// GET /api/schedule/events → DaySummary[]
const scheduleEventItemSchema = z.object({
  trainingPlan: z
    .array(z.object({ name: z.string(), isCompleted: z.boolean() }))
    .optional(),
  completionPercentage: z.number().optional(),
  note: z.string().optional(),
  noteTitle: z.string().optional(),
  bodyMetric: z.record(z.string(), z.number()).optional(),
});

const scheduleEventsResponseSchema = z
  .object({
    ok: z.boolean(),
    events: z.record(z.string(), scheduleEventItemSchema),
  })
  .transform((data): DaySummary[] =>
    Object.entries(data.events).map(([date, event]) => {
      const exercises = event.trainingPlan ?? [];
      return {
        date,
        hasPlan: exercises.length > 0,
        totalSets: exercises.length,
        completedSets: exercises.filter((e) => e.isCompleted).length,
        hasBodyMetric: !!event.bodyMetric && Object.keys(event.bodyMetric).length > 0,
        hasNote: !!(event.note?.trim()),
      };
    }),
  );

// GET /api/body-metrics?date= → BodyMetric | null
const bodyMetricResponseSchema = z
  .object({ ok: z.boolean(), metric: bodyMetricSchema.nullable() })
  .transform((data) => data.metric);

// GET /api/schedule/${day} → note string | null
const dayNoteResponseSchema = z
  .object({ ok: z.boolean(), initialNote: z.string().optional() })
  .transform((data) => data.initialNote ?? null);

//
// Helpers
//

const invalidateSchedule = () => {
  void queryClient.invalidateQueries({ queryKey: ['schedule'] });
};

//
// Query hooks
//

export const useScheduleMonth = (year: number, month: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.scheduleMonth(year, month),
    queryFn: () =>
      apiFetch(`/api/schedule/events?year=${year}&month=${month}`, {
        schema: scheduleEventsResponseSchema,
      }),
  });
};

export const useDayPlan = (date: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.dayPlan(date),
    queryFn: async (): Promise<TrainingPlan> => {
      const raw = await apiFetch<{
        ok: boolean;
        plan: Array<{
          id: string;
          exerciseId: string;
          exerciseName: string;
          planExerciseNote: string | null;
          setsData: Array<{
            id: string;
            weight: number | null;
            reps: number | null;
            time: number | null;
            distance: number | null;
            heartRate: number | null;
            rpe: number | null;
            isCompleted: boolean;
          }>;
        }>;
      }>(`/api/training-plans?date=${date}`);

      return {
        date,
        exercises: raw.plan.map((pe) => ({
          id: pe.id,
          exerciseId: pe.exerciseId,
          cachedName: pe.exerciseName,
          note: pe.planExerciseNote,
          sets: pe.setsData.map((s) => ({
            id: s.id,
            weight: s.weight,
            reps: s.reps,
            distance: s.distance,
            heartRate: s.heartRate,
            rpe: s.rpe,
            time: s.time,
            isCompleted: s.isCompleted,
          })),
        })),
      };
    },
    enabled: !!date,
  });
};

export const useBodyMetric = (date: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.bodyMetric(date),
    queryFn: () =>
      apiFetch(`/api/body-metrics?date=${date}`, { schema: bodyMetricResponseSchema }),
    enabled: !!date,
  });
};

export const useDayNote = (date: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.dayNote(date),
    queryFn: () =>
      apiFetch(`/api/schedule/${date}`, { schema: dayNoteResponseSchema }),
    enabled: !!date,
  });
};

//
// Mutation hooks
//

export const useSaveDayPlan = () => {
  return useMutation({
    mutationFn: async (plan: TrainingPlan) => {
      const allSets = plan.exercises.flatMap((e) => e.sets);
      const totalSets = allSets.length;
      const completedSets = allSets.filter((s) => s.isCompleted).length;
      const completionPercentage = totalSets > 0 ? completedSets / totalSets : 0;

      await apiFetch('/api/training-plans', {
        method: 'POST',
        body: {
          date: plan.date,
          totalSets,
          completedSets,
          completionPercentage,
          exercises: plan.exercises.map((ex, idx) => ({
            id: ex.id,
            exerciseId: ex.exerciseId,
            order: idx,
            planExerciseNote: ex.note ?? '',
            exerciseName: ex.cachedName,
            videoUrl: null,
            videoPosterUrl: null,
            sets: ex.sets.map((s, setIdx) => ({
              id: s.id,
              set: setIdx + 1,
              weight: s.weight,
              reps: s.reps,
              time: s.time,
              distance: s.distance,
              heartRate: s.heartRate,
              rpe: s.rpe,
              isCompleted: s.isCompleted,
            })),
          })),
        },
      });
    },
    onSuccess: invalidateSchedule,
  });
};

export const useSaveBodyMetric = () => {
  return useMutation({
    mutationFn: (metric: BodyMetric) =>
      apiFetch('/api/body-metrics', { method: 'POST', body: metric }),
    onSuccess: invalidateSchedule,
  });
};

export const useSaveDayNote = () => {
  return useMutation({
    mutationFn: (input: { date: string; note: string }) =>
      apiFetch('/api/training-notes', {
        method: 'PUT',
        body: { date: input.date, note: input.note, noteTitle: '' },
      }),
    onSuccess: invalidateSchedule,
  });
};
