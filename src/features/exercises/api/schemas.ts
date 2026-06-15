import { z } from 'zod';

export const categorySchema = z.enum([
  'STRENGTH',
  'HYPERTROPHY',
  'POWER',
  'CARDIO',
  'MOBILITY',
  'OTHER',
]);
export type ExerciseCategory = z.infer<typeof categorySchema>;
export const EXERCISE_CATEGORIES = categorySchema.options;

export const forceSchema = z.enum([
  'PUSH',
  'PULL',
  'SQUAT',
  'HINGE',
  'LUNGE',
  'CARRY',
  'ROTATION',
  'STATIC',
  'LISS',
  'HIIT',
]);
export type ExerciseForce = z.infer<typeof forceSchema>;
export const EXERCISE_FORCES = forceSchema.options;

export const kineticChainSchema = z.enum(['OKC', 'CKC']);
export type ExerciseKineticChain = z.infer<typeof kineticChainSchema>;
export const KINETIC_CHAINS = kineticChainSchema.options;

export const mechanicSchema = z.enum(['COMPOUND', 'ISOLATION']);
export type ExerciseMechanic = z.infer<typeof mechanicSchema>;
export const MECHANICS = mechanicSchema.options;

// Compact muscle taxonomy (region -> muscles). Labels live in the `muscle` i18n namespace.
// muscleGroups stays string[] so a future anatomy-SVG selector needs no schema change.
export const MUSCLE_GROUPS = {
  chest: ['chest_upper', 'chest_mid', 'chest_lower'],
  back: ['lats', 'traps', 'rhomboids', 'lower_back'],
  shoulders: ['front_delt', 'side_delt', 'rear_delt'],
  arms: ['biceps', 'triceps', 'forearms'],
  legs: ['quads', 'hamstrings', 'glutes', 'calves', 'adductors'],
  core: ['abs', 'obliques'],
} as const;

export type MuscleRegion = keyof typeof MUSCLE_GROUPS;
export const MUSCLE_REGIONS = Object.keys(MUSCLE_GROUPS) as MuscleRegion[];

// Widened view for membership checks (indexing the `as const` object yields a union of
// tuples, which makes `.includes(string)` collapse its parameter to `never`).
export const MUSCLE_GROUP_VALUES: Record<MuscleRegion, readonly string[]> = MUSCLE_GROUPS;

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  note: z.string().nullable(),
  videoUrl: z.string().nullable(),
  muscleGroups: z.array(z.string()),
  category: categorySchema.nullable(),
  force: forceSchema.nullable(),
  kineticChain: kineticChainSchema.nullable(),
  mechanic: mechanicSchema.nullable(),
  createdAt: z.string(),
  deletedAt: z.string().nullable(),
});
export type Exercise = z.infer<typeof exerciseSchema>;

export const exerciseUsageSchema = z.object({
  planCount: z.number(),
  dates: z.array(z.string()),
});
export type ExerciseUsage = z.infer<typeof exerciseUsageSchema>;

export const exerciseFormSchema = z.object({
  name: z.string().min(1).max(255),
  note: z.string(),
  muscleGroups: z.array(z.string()),
  category: categorySchema.nullable(),
  force: forceSchema.nullable(),
  kineticChain: kineticChainSchema.nullable(),
  mechanic: mechanicSchema.nullable(),
});
export type ExerciseFormValues = z.infer<typeof exerciseFormSchema>;
