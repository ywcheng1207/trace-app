import { z } from 'zod';

export const planSetSchema = z.object({
  id: z.string(),
  weight: z.number().nullable(),
  reps: z.number().nullable(),
  distance: z.number().nullable(),
  heartRate: z.number().nullable(),
  rpe: z.number().nullable(),
  time: z.number().nullable(),
  isCompleted: z.boolean(),
});
export type PlanSet = z.infer<typeof planSetSchema>;

export const planExerciseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  cachedName: z.string(),
  note: z.string().nullable(),
  sets: z.array(planSetSchema),
});
export type PlanExercise = z.infer<typeof planExerciseSchema>;

export const trainingPlanSchema = z.object({
  date: z.string(),
  exercises: z.array(planExerciseSchema),
});
export type TrainingPlan = z.infer<typeof trainingPlanSchema>;

export const BODY_METRIC_FIELDS = [
  'weight',
  'bodyFat',
  'muscleMass',
  'chest',
  'waist',
  'hips',
] as const;
export type BodyMetricField = (typeof BODY_METRIC_FIELDS)[number];

export const bodyMetricSchema = z.object({
  date: z.string(),
  weight: z.number().nullable(),
  bodyFat: z.number().nullable(),
  muscleMass: z.number().nullable(),
  chest: z.number().nullable(),
  waist: z.number().nullable(),
  hips: z.number().nullable(),
});
export type BodyMetric = z.infer<typeof bodyMetricSchema>;

export const daySummarySchema = z.object({
  date: z.string(),
  hasPlan: z.boolean(),
  totalSets: z.number(),
  completedSets: z.number(),
  hasBodyMetric: z.boolean(),
  hasNote: z.boolean(),
});
export type DaySummary = z.infer<typeof daySummarySchema>;
