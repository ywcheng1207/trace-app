import { AiAdvice, AiUsage, AnalysisTask } from '@/features/ai-coach/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const createId = () => `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const AI_QUOTA_EXCEEDED = 'AI_QUOTA_EXCEEDED';
export const ANALYSIS_IN_PROGRESS = 'ANALYSIS_IN_PROGRESS';

const PROCESSING_AFTER_MS = 2000;
const DONE_AFTER_MS = 6000;

let usage: AiUsage = { dailyUsed: 0, dailyLimit: 5 };

const ADVICE_POINTS = [
  '下放階段控制 2–3 秒，保持張力。',
  '核心收緊、肋骨下收，避免腰椎過度伸展。',
  '雙腳踩穩、用力時吐氣，維持呼吸節奏。',
  '動作底部短暫停頓，避免反彈借力。',
];

// TODO: 換成 apiFetch('/api/ai-coach/usage', { schema: aiUsageSchema })
export const mockGetAiUsage = async (): Promise<AiUsage> => {
  await delay(150);
  return { ...usage };
};

// TODO: 換成 apiFetch('/api/exercises/[id]/ai-advice', { method: 'POST', schema: aiAdviceSchema })
export const mockGetExerciseAdvice = async (exerciseId: string): Promise<AiAdvice> => {
  await delay(1200);
  if (usage.dailyUsed >= usage.dailyLimit) throw new Error(AI_QUOTA_EXCEEDED);
  usage = { ...usage, dailyUsed: usage.dailyUsed + 1 };
  return { exerciseId, points: ADVICE_POINTS, createdAt: new Date().toISOString() };
};

type StoredTask = { task: AnalysisTask; startedAt: number };
const tasks = new Map<string, StoredTask>();
const activeByExercise = new Map<string, string>();

const buildResult = () => ({
  breakdown: ['啟動：髖膝同步發力', '中段：軀幹維持中立', '鎖定：頂端完全伸展但不過度'],
  suggestions: ['離心再放慢約 0.5 秒', '握距可再收窄一指幅', '頂端停頓 1 秒強化控制'],
});

const advanceTask = (stored: StoredTask): AnalysisTask => {
  const elapsed = Date.now() - stored.startedAt;
  if (elapsed >= DONE_AFTER_MS) {
    stored.task = { ...stored.task, status: 'DONE', result: buildResult() };
    activeByExercise.delete(stored.task.exerciseId);
  } else if (elapsed >= PROCESSING_AFTER_MS) {
    stored.task = { ...stored.task, status: 'PROCESSING' };
  }
  return { ...stored.task };
};

// TODO: 換成 apiFetch('/api/upload/authorize') + apiFetch('/api/ai-coach/analyze', { method: 'POST' })
export const mockStartAnalysis = async (exerciseId: string): Promise<AnalysisTask> => {
  await delay(500);
  const activeId = activeByExercise.get(exerciseId);
  if (activeId && tasks.has(activeId)) throw new Error(ANALYSIS_IN_PROGRESS);
  if (usage.dailyUsed >= usage.dailyLimit) throw new Error(AI_QUOTA_EXCEEDED);
  usage = { ...usage, dailyUsed: usage.dailyUsed + 1 };

  const task: AnalysisTask = {
    id: createId(),
    exerciseId,
    status: 'PENDING',
    result: null,
    createdAt: new Date().toISOString(),
  };
  tasks.set(task.id, { task, startedAt: Date.now() });
  activeByExercise.set(exerciseId, task.id);
  return { ...task };
};

// TODO: 換成 apiFetch('/api/ai-coach/tasks/[id]', { schema: analysisTaskSchema })
export const mockGetAnalysisTask = async (id: string): Promise<AnalysisTask | null> => {
  await delay(200);
  const stored = tasks.get(id);
  if (!stored) return null;
  return advanceTask(stored);
};
