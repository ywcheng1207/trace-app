import { useMutation, useQuery } from '@tanstack/react-query';

import {
  mockArchiveExercise,
  mockCreateExercise,
  mockGetExercise,
  mockGetExerciseUsage,
  mockListArchived,
  mockListExercises,
  mockPurgeExercise,
  mockQuickStartExercises,
  mockRestoreExercise,
  mockSetExerciseNote,
  mockSetExerciseVideo,
  mockUpdateExercise,
} from '@/features/exercises/api/mock';
import { ExerciseFormValues } from '@/features/exercises/api/schemas';
import { mockListExerciseVideos } from '@/features/exercises/api/video-mock';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

const invalidateLists = () => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() });
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedExercises() });
};

export const useExercises = () => {
  // TODO: 換成 apiFetch('/api/exercises', { schema })
  return useQuery({ queryKey: QUERY_KEYS.exercises(), queryFn: () => mockListExercises() });
};

export const useArchivedExercises = () => {
  // TODO: 換成 apiFetch('/api/exercises?archived=1', { schema })
  return useQuery({
    queryKey: QUERY_KEYS.archivedExercises(),
    queryFn: () => mockListArchived(),
  });
};

export const useExercise = (id: string) => {
  // TODO: 換成 apiFetch('/api/exercises/[id]', { schema })
  return useQuery({
    queryKey: QUERY_KEYS.exerciseDetail(id),
    queryFn: () => mockGetExercise(id),
  });
};

export const useCreateExercise = () => {
  return useMutation({
    mutationFn: (values: ExerciseFormValues) => mockCreateExercise(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() }),
  });
};

export const useUpdateExercise = () => {
  return useMutation({
    mutationFn: (input: { id: string; values: ExerciseFormValues }) =>
      mockUpdateExercise(input.id, input.values),
    onSuccess: (_result, input) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exerciseDetail(input.id) });
    },
  });
};

export const useArchiveExercise = () => {
  return useMutation({ mutationFn: (id: string) => mockArchiveExercise(id), onSuccess: invalidateLists });
};

export const useRestoreExercise = () => {
  return useMutation({ mutationFn: (id: string) => mockRestoreExercise(id), onSuccess: invalidateLists });
};

export const usePurgeExercise = () => {
  return useMutation({
    mutationFn: (id: string) => mockPurgeExercise(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.archivedExercises() }),
  });
};

const invalidateDetail = (id: string) => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exerciseDetail(id) });
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() });
};

export const useExerciseUsage = (id: string) => {
  // TODO: 換成 apiFetch('/api/exercises/[id]/usage', { schema: exerciseUsageSchema })
  return useQuery({
    queryKey: QUERY_KEYS.exerciseUsage(id),
    queryFn: () => mockGetExerciseUsage(id),
  });
};

export const useSetExerciseNote = () => {
  return useMutation({
    mutationFn: (input: { id: string; note: string }) => mockSetExerciseNote(input.id, input.note),
    onSuccess: (_result, input) => invalidateDetail(input.id),
  });
};

export const useSetExerciseVideo = () => {
  return useMutation({
    mutationFn: (input: { id: string; videoUrl: string }) =>
      mockSetExerciseVideo(input.id, input.videoUrl),
    onSuccess: (_result, input) => invalidateDetail(input.id),
  });
};

export const useExerciseVideos = (id: string, range: { start: string; end: string }) => {
  // TODO: 換成 apiFetch(`/api/exercises/${id}/videos?start=...&end=...`, { schema })
  return useQuery({
    queryKey: QUERY_KEYS.exerciseVideos(id, `${range.start}:${range.end}`),
    queryFn: () => mockListExerciseVideos(id, range.start, range.end),
  });
};

export const useQuickStartExercises = () => {
  return useMutation({
    mutationFn: () => mockQuickStartExercises(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises() }),
  });
};
