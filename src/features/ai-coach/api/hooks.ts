import { useMutation, useQuery } from '@tanstack/react-query';

import {
  mockGetAiUsage,
  mockGetAnalysisTask,
  mockGetExerciseAdvice,
  mockStartAnalysis,
} from '@/features/ai-coach/api/mock';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

const POLL_INTERVAL_MS = 1500;

const invalidateUsage = () => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiUsage() });
};

export const useAiUsage = () => {
  // TODO: 換成 apiFetch('/api/ai-coach/usage', { schema: aiUsageSchema })
  return useQuery({ queryKey: QUERY_KEYS.aiUsage(), queryFn: () => mockGetAiUsage() });
};

export const useExerciseAdvice = () => {
  return useMutation({
    mutationFn: (exerciseId: string) => mockGetExerciseAdvice(exerciseId),
    onSuccess: invalidateUsage,
  });
};

export const useStartAnalysis = () => {
  return useMutation({
    mutationFn: (exerciseId: string) => mockStartAnalysis(exerciseId),
    onSuccess: invalidateUsage,
  });
};

export const useAnalysisTask = (taskId: string | null) => {
  // TODO: 換成 apiFetch('/api/ai-coach/tasks/[id]', { schema: analysisTaskSchema })
  return useQuery({
    queryKey: QUERY_KEYS.analysisTask(taskId ?? 'none'),
    queryFn: () => mockGetAnalysisTask(taskId ?? ''),
    enabled: taskId !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'DONE' || status === 'FAILED' ? false : POLL_INTERVAL_MS;
    },
  });
};
