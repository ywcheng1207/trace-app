import { z } from 'zod';

export const aiAdviceSchema = z.object({
  exerciseId: z.string(),
  points: z.array(z.string()),
  createdAt: z.string(),
});
export type AiAdvice = z.infer<typeof aiAdviceSchema>;

export const analysisStatusSchema = z.enum(['PENDING', 'PROCESSING', 'DONE', 'FAILED']);
export type AnalysisStatus = z.infer<typeof analysisStatusSchema>;

export const analysisResultSchema = z.object({
  breakdown: z.array(z.string()),
  suggestions: z.array(z.string()),
});
export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export const analysisTaskSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  status: analysisStatusSchema,
  result: analysisResultSchema.nullable(),
  createdAt: z.string(),
});
export type AnalysisTask = z.infer<typeof analysisTaskSchema>;

export const aiUsageSchema = z.object({
  dailyUsed: z.number(),
  dailyLimit: z.number(),
});
export type AiUsage = z.infer<typeof aiUsageSchema>;

export const VIDEO_MAX_DURATION_SEC = 60;
export const VIDEO_MAX_SIZE_MB = 100;
