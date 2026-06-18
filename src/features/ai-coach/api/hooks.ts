import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { AiAdvice, AiUsage, AnalysisTask, analysisTaskSchema } from '@/features/ai-coach/api/schemas';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

// Error sentinels — re-exported so callers don't need to import from mock
export const AI_QUOTA_EXCEEDED = 'AI_QUOTA_EXCEEDED';
export const ANALYSIS_IN_PROGRESS = 'ANALYSIS_IN_PROGRESS';

const POLL_INTERVAL_MS = 1500;

const invalidateUsage = () => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiUsage() });
};

// No dedicated usage endpoint exists yet — return a permissive stub so the UI
// never blocks. The real rate-limit is enforced server-side.
export const useAiUsage = () => {
  return useQuery<AiUsage>({
    queryKey: QUERY_KEYS.aiUsage(),
    queryFn: async (): Promise<AiUsage> => ({ dailyUsed: 0, dailyLimit: 10 }),
    staleTime: 1000 * 60 * 5,
  });
};

// AI advice is async: POST triggers background analysis, result lands in exercise.note.
// The hook returns immediately with a stub AiAdvice so the component flow works;
// the real note is available after re-fetching the exercise detail.
export const useExerciseAdvice = () => {
  return useMutation<AiAdvice, Error, string>({
    mutationFn: async (exerciseId: string): Promise<AiAdvice> => {
      // TODO: extend when /api/exercises/[id]/ai-advice GET polling is wired to the UI
      return {
        exerciseId,
        points: [],
        createdAt: new Date().toISOString(),
      };
    },
    onSuccess: invalidateUsage,
  });
};

// Video analysis requires a full upload flow (POST /api/upload/authorize → upload → POST
// /api/ai-coach/analyze). That upload flow is not yet implemented in the UI, so we keep
// a stub that returns a PENDING task the component can render.
export const useStartAnalysis = () => {
  return useMutation<AnalysisTask, Error, string>({
    mutationFn: async (exerciseId: string): Promise<AnalysisTask> => {
      const task: AnalysisTask = {
        id: `task_${Date.now()}`,
        exerciseId,
        status: 'PENDING',
        result: null,
        createdAt: new Date().toISOString(),
      };
      return task;
    },
    onSuccess: invalidateUsage,
  });
};

const analysisTaskResponseSchema = z
  .object({ ok: z.boolean(), status: z.string(), analysis: z.unknown().optional() })
  .transform((data): AnalysisTask | null => {
    if (data.status === 'idle' || data.status === 'invalid_input') return null;
    const status =
      data.status === 'success'
        ? 'DONE'
        : data.status === 'error'
          ? 'FAILED'
          : data.status === 'loading'
            ? 'PENDING'
            : 'PROCESSING';
    const result =
      status === 'DONE' && data.analysis
        ? analysisTaskSchema.shape.result.parse(data.analysis)
        : null;
    return {
      id: '',
      exerciseId: '',
      status,
      result,
      createdAt: new Date().toISOString(),
    };
  });

// taskId is actually a planExerciseId in the real backend; keep the generic name so
// callers don't need to change.
export const useAnalysisTask = (taskId: string | null) => {
  return useQuery({
    queryKey: QUERY_KEYS.analysisTask(taskId ?? 'none'),
    queryFn: async (): Promise<AnalysisTask | null> => {
      if (!taskId) return null;
      // TODO: uncomment when video upload flow is complete
      // return apiFetch(`/api/ai-coach/analyze?planExerciseId=${taskId}`, {
      //   schema: analysisTaskResponseSchema,
      // });
      return null;
    },
    enabled: taskId !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'DONE' || status === 'FAILED' ? false : POLL_INTERVAL_MS;
    },
  });
};
