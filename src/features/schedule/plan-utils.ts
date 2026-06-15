import { Exercise } from '@/features/exercises/api/schemas';
import { PlanExercise, PlanSet } from '@/features/schedule/api/schemas';

const createId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const createPlanSet = (): PlanSet => ({
  id: createId('set'),
  weight: null,
  reps: null,
  distance: null,
  heartRate: null,
  rpe: null,
  time: null,
  isCompleted: false,
});

export const createPlanExercise = (exercise: Exercise): PlanExercise => ({
  id: createId('pe'),
  exerciseId: exercise.id,
  cachedName: exercise.name,
  note: null,
  sets: [createPlanSet()],
});
