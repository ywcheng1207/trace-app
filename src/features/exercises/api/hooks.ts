import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import {
  categorySchema,
  Exercise,
  exerciseSchema,
  ExerciseFormValues,
  ExerciseUsage,
  ExerciseVideo,
  forceSchema,
  kineticChainSchema,
  mechanicSchema,
} from '@/features/exercises/api/schemas';
import { apiFetch } from '@/lib/api/api-fetch';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

//
// Internal response schemas — not exported
//

const exerciseApiItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    note: z.string().nullish(),
    muscleGroups: z.array(z.string()),
    mechanic: mechanicSchema.nullable(),
    category: categorySchema.nullable(),
    force: forceSchema.nullable(),
    kineticChain: kineticChainSchema.nullable(),
    createdAt: z.string(),
    deletedAt: z.string().nullable().optional(),
    _count: z.object({ planExercises: z.number() }).optional(),
  })
  .transform((data): z.infer<typeof exerciseSchema> => ({
    id: data.id,
    name: data.name,
    note: data.note ?? null,
    videoUrl: null,
    muscleGroups: data.muscleGroups,
    mechanic: data.mechanic,
    category: data.category,
    force: data.force,
    kineticChain: data.kineticChain,
    createdAt: data.createdAt,
    deletedAt: data.deletedAt ?? null,
  }));

const exerciseListResponseSchema = z
  .object({ ok: z.boolean(), exercises: z.array(exerciseApiItemSchema) })
  .transform((data) => data.exercises);

const exerciseDetailResponseSchema = z
  .object({ ok: z.boolean(), exercise: exerciseApiItemSchema })
  .transform((data) => data.exercise);

const exerciseUsageResponseSchema = z
  .object({
    ok: z.boolean(),
    plans: z.array(z.object({ id: z.string(), date: z.string() })),
  })
  .transform((data): ExerciseUsage => ({
    planCount: data.plans.length,
    dates: data.plans.map((p) => p.date),
  }));

//
// Cache invalidation helpers
//

const invalidateLists = () => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() });
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedExercises() });
};

const invalidateDetail = (id: string) => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exerciseDetail(id) });
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() });
};

//
// Query hooks
//

export const useExercises = () => {
  return useQuery({
    queryKey: QUERY_KEYS.exercises(),
    queryFn: () => apiFetch('/api/exercises', { schema: exerciseListResponseSchema }),
  });
};

export const useArchivedExercises = () => {
  return useQuery({
    queryKey: QUERY_KEYS.archivedExercises(),
    queryFn: () =>
      apiFetch('/api/exercises?deleted=true', { schema: exerciseListResponseSchema }),
  });
};

export const useExercise = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.exerciseDetail(id),
    queryFn: () =>
      apiFetch(`/api/exercises/${id}/info`, { schema: exerciseDetailResponseSchema }),
    enabled: !!id,
  });
};

export const useExerciseUsage = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.exerciseUsage(id),
    queryFn: () =>
      apiFetch(`/api/exercises/${id}/usage`, { schema: exerciseUsageResponseSchema }),
    enabled: !!id,
  });
};

const exerciseVideosResponseSchema = z
  .object({
    ok: z.boolean(),
    videos: z.array(
      z.object({
        id: z.string(),
        url: z.string(),
        poster: z.string().nullable(),
        date: z.string(),
        title: z.string().nullable(),
        hasAiAnalysis: z.boolean(),
      }),
    ),
  })
  .transform((data): ExerciseVideo[] =>
    data.videos.map((v) => ({
      id: v.id,
      exerciseId: '',
      url: v.url,
      posterUrl: v.poster,
      date: v.date,
      title: v.title,
      hasAiAnalysis: v.hasAiAnalysis,
      aiResult: null,
    })),
  );

export const useExerciseVideos = (id: string, range: { start: string; end: string }) => {
  return useQuery({
    queryKey: QUERY_KEYS.exerciseVideos(id, `${range.start}:${range.end}`),
    queryFn: () =>
      apiFetch(
        `/api/exercises/${id}/videos?startDate=${range.start}&endDate=${range.end}`,
        { schema: exerciseVideosResponseSchema },
      ),
    enabled: !!id,
  });
};

//
// Mutation hooks
//

export const useCreateExercise = () => {
  return useMutation({
    mutationFn: (values: ExerciseFormValues) =>
      apiFetch('/api/exercises', { method: 'POST', body: values }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() }),
  });
};

export const useUpdateExercise = () => {
  return useMutation({
    mutationFn: (input: { id: string; values: ExerciseFormValues }) =>
      apiFetch(`/api/exercises/${input.id}`, { method: 'PUT', body: input.values }),
    onSuccess: (_result, input) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.exerciseDetail(input.id),
      });
    },
  });
};

export const useArchiveExercise = () => {
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/exercises/${id}`, { method: 'DELETE', body: {} }),
    onSuccess: invalidateLists,
  });
};

export const useRestoreExercise = () => {
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/exercises/${id}/restore`, { method: 'PATCH', body: {} }),
    onSuccess: invalidateLists,
  });
};

export const usePurgeExercise = () => {
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/exercises/${id}/purge`, { method: 'DELETE', body: {} }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedExercises() }),
  });
};

export const useSetExerciseNote = () => {
  return useMutation({
    mutationFn: (input: { id: string; note: string }) =>
      apiFetch(`/api/exercises/${input.id}`, {
        method: 'PATCH',
        body: { note: input.note },
      }),
    onSuccess: (_result, input) => invalidateDetail(input.id),
  });
};

export const useSetExerciseVideo = () => {
  // Video management operates on PlanExercise (POST /api/exercises/video).
  // The planExerciseId is passed as `id`, not the Exercise id.
  return useMutation({
    mutationFn: (input: { id: string; videoUrl: string; videoPosterUrl?: string }) =>
      apiFetch('/api/exercises/video', {
        method: 'POST',
        body: {
          exerciseId: input.id,
          videoUrl: input.videoUrl,
          videoPosterUrl: input.videoPosterUrl ?? null,
        },
      }),
  });
};

type QuickStartInput = {
  categoryIds: string[];
  language: string;
  confirmed?: boolean;
};

export const useQuickStartExercises = () => {
  return useMutation({
    mutationFn: (input: QuickStartInput) =>
      apiFetch('/api/exercises/quick-start', { method: 'POST', body: input }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() }),
  });
};
