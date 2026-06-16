import { Exercise } from '@/features/exercises/api/schemas';
import { PlanExercise, PlanSet } from '@/features/schedule/api/schemas';
import { TemplateExercise } from '@/features/training-templates/api/schemas';

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

export const createPlanExerciseFromTemplate = (item: TemplateExercise): PlanExercise => ({
  id: createId('pe'),
  exerciseId: item.exerciseId,
  cachedName: item.cachedName,
  note: null,
  sets: Array.from({ length: Math.max(1, item.setCount) }, () => createPlanSet()),
});

export const toTemplateExercises = (exercises: PlanExercise[]): TemplateExercise[] =>
  exercises.map((exercise) => ({
    exerciseId: exercise.exerciseId,
    cachedName: exercise.cachedName,
    setCount: exercise.sets.length,
  }));
