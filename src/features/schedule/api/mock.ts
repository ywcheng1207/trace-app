import {
  BODY_METRIC_FIELDS,
  BodyMetric,
  DaySummary,
  TrainingPlan,
} from '@/features/schedule/api/schemas';
import { toDateKey } from '@/lib/date';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const createId = () => `s_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const TODAY = toDateKey(new Date());

const plans = new Map<string, TrainingPlan>();
const metrics = new Map<string, BodyMetric>();
const notes = new Map<string, string>();

plans.set(TODAY, {
  date: TODAY,
  exercises: [
    {
      id: createId(),
      exerciseId: 'ex_seed_1',
      cachedName: 'Barbell Bench Press',
      note: null,
      sets: [
        { id: createId(), weight: 60, reps: 10, distance: null, heartRate: null, rpe: null, time: null, isCompleted: true },
        { id: createId(), weight: 60, reps: 8, distance: null, heartRate: null, rpe: null, time: null, isCompleted: false },
      ],
    },
  ],
});
metrics.set(TODAY, {
  date: TODAY,
  weight: 75,
  bodyFat: 18,
  muscleMass: null,
  chest: null,
  waist: 80,
  hips: null,
});
notes.set(TODAY, 'Felt strong on bench today.');

const clonePlan = (plan: TrainingPlan): TrainingPlan => ({
  date: plan.date,
  exercises: plan.exercises.map((exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) => ({ ...set })),
  })),
});

const buildSummary = (date: string): DaySummary => {
  const plan = plans.get(date);
  const sets = plan ? plan.exercises.flatMap((exercise) => exercise.sets) : [];
  return {
    date,
    hasPlan: plan !== undefined && plan.exercises.length > 0,
    totalSets: sets.length,
    completedSets: sets.filter((set) => set.isCompleted).length,
    hasBodyMetric: metrics.has(date),
    hasNote: notes.has(date),
  };
};

// TODO: 換成 apiFetch('/api/schedule/events?year=&month=', { schema: z.array(daySummarySchema) })
export const mockGetMonthSummaries = async (year: number, month: number): Promise<DaySummary[]> => {
  await delay(300);
  const prefix = `${year}-${String(month).padStart(2, '0')}-`;
  const keys = new Set<string>();
  for (const key of plans.keys()) if (key.startsWith(prefix)) keys.add(key);
  for (const key of metrics.keys()) if (key.startsWith(prefix)) keys.add(key);
  for (const key of notes.keys()) if (key.startsWith(prefix)) keys.add(key);
  return [...keys].map(buildSummary);
};

// TODO: 換成 apiFetch('/api/training-plans?date=', { schema: trainingPlanSchema })
export const mockGetDayPlan = async (date: string): Promise<TrainingPlan | null> => {
  await delay(250);
  const plan = plans.get(date);
  return plan ? clonePlan(plan) : null;
};

// TODO: 換成 apiFetch('/api/body-metrics?date=', { schema: bodyMetricSchema })
export const mockGetBodyMetric = async (date: string): Promise<BodyMetric | null> => {
  await delay(250);
  const metric = metrics.get(date);
  return metric ? { ...metric } : null;
};

// TODO: 換成 apiFetch('/api/training-notes?date=', { schema })
export const mockGetDayNote = async (date: string): Promise<string> => {
  await delay(200);
  return notes.get(date) ?? '';
};

// TODO: 換成 apiFetch('/api/training-plans', { method: 'POST', body: plan, schema })
export const mockSaveDayPlan = async (plan: TrainingPlan): Promise<void> => {
  await delay(350);
  if (plan.exercises.length === 0) plans.delete(plan.date);
  else plans.set(plan.date, clonePlan(plan));
};

// TODO: 換成 apiFetch('/api/body-metrics', { method: 'POST', body: metric, schema })
export const mockSaveBodyMetric = async (metric: BodyMetric): Promise<void> => {
  await delay(350);
  const hasAny = BODY_METRIC_FIELDS.some((field) => metric[field] !== null);
  if (!hasAny) metrics.delete(metric.date);
  else metrics.set(metric.date, { ...metric });
};

// TODO: 換成 apiFetch('/api/training-notes', { method: 'POST', body, schema })
export const mockSaveDayNote = async (date: string, note: string): Promise<void> => {
  await delay(300);
  if (note.trim() === '') notes.delete(date);
  else notes.set(date, note);
};
