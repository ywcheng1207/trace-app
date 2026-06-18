import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { CreateTemplateInput, TrainingTemplate } from '@/features/training-templates/api/schemas';
import { apiFetch } from '@/lib/api/api-fetch';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

//
// Internal response schemas
//

const templateListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    // The richer fields (createdAt, exerciseId, _count) require the updated
    // backend; tolerate their absence so the list still renders against prod
    // until that deploy lands.
    createdAt: z.string().optional(),
    exercises: z.array(
      z.object({
        exerciseId: z.string().optional(),
        exercise: z.object({ name: z.string() }),
        _count: z.object({ sets: z.number() }).optional(),
      }),
    ),
  })
  .transform((t): TrainingTemplate => ({
    id: t.id,
    name: t.name,
    createdAt: t.createdAt ?? new Date().toISOString(),
    exercises: t.exercises.map((ex) => ({
      exerciseId: ex.exerciseId ?? '',
      cachedName: ex.exercise.name,
      setCount: ex._count?.sets ?? 0,
    })),
  }));

const templateListResponseSchema = z
  .object({ ok: z.boolean(), templates: z.array(templateListItemSchema) })
  .transform((data) => data.templates);

const invalidateTemplates = () => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainingTemplates() });
};

//
// Hooks
//

export const useTrainingTemplates = () => {
  return useQuery({
    queryKey: QUERY_KEYS.trainingTemplates(),
    queryFn: () => apiFetch('/api/training-templates', { schema: templateListResponseSchema }),
    staleTime: 1000 * 60,
  });
};

export const useCreateTemplate = () => {
  return useMutation({
    mutationFn: (input: CreateTemplateInput) =>
      apiFetch('/api/training-templates', {
        method: 'POST',
        body: {
          name: input.name,
          exercises: input.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: Array.from({ length: Math.max(1, ex.setCount) }, () => ({
              weight: 0,
              reps: 8,
            })),
          })),
        },
      }),
    onSuccess: invalidateTemplates,
  });
};

export const useDeleteTemplate = () => {
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/training-templates/${id}`, { method: 'DELETE', body: {} }),
    onSuccess: invalidateTemplates,
  });
};
