import { z } from 'zod';

export const templateExerciseSchema = z.object({
  exerciseId: z.string(),
  cachedName: z.string(),
  setCount: z.number(),
});
export type TemplateExercise = z.infer<typeof templateExerciseSchema>;

export const trainingTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  exercises: z.array(templateExerciseSchema),
  createdAt: z.string(),
});
export type TrainingTemplate = z.infer<typeof trainingTemplateSchema>;

export type CreateTemplateInput = {
  name: string;
  exercises: TemplateExercise[];
};
