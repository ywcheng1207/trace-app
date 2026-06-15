import { Exercise, ExerciseFormValues, ExerciseUsage } from '@/features/exercises/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const createId = () => `ex_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

let exercises: Exercise[] = [
  {
    id: 'ex_seed_1',
    name: 'Barbell Bench Press',
    note: 'Focus on a controlled eccentric.',
    videoUrl: 'https://videos.trace.app/demo/bench-press.mp4',
    muscleGroups: ['chest_mid', 'front_delt', 'triceps'],
    category: 'HYPERTROPHY',
    force: 'PUSH',
    kineticChain: 'CKC',
    mechanic: 'COMPOUND',
    createdAt: '2026-05-01T08:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'ex_seed_2',
    name: 'Back Squat',
    note: null,
    videoUrl: null,
    muscleGroups: ['quads', 'glutes', 'lower_back'],
    category: 'STRENGTH',
    force: 'SQUAT',
    kineticChain: 'CKC',
    mechanic: 'COMPOUND',
    createdAt: '2026-05-02T08:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'ex_seed_3',
    name: 'Lat Pulldown',
    note: null,
    videoUrl: null,
    muscleGroups: ['lats', 'biceps'],
    category: 'HYPERTROPHY',
    force: 'PULL',
    kineticChain: 'OKC',
    mechanic: 'COMPOUND',
    createdAt: '2026-05-03T08:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'ex_seed_4',
    name: 'Plank',
    note: 'Brace the core, neutral spine.',
    videoUrl: null,
    muscleGroups: ['abs', 'obliques'],
    category: 'MOBILITY',
    force: 'STATIC',
    kineticChain: 'CKC',
    mechanic: 'ISOLATION',
    createdAt: '2026-05-04T08:00:00.000Z',
    deletedAt: null,
  },
];

const clone = (item: Exercise): Exercise => ({ ...item, muscleGroups: [...item.muscleGroups] });

// TODO: 換成 apiFetch('/api/exercises', { schema: z.array(exerciseSchema) })
export const mockListExercises = async (): Promise<Exercise[]> => {
  await delay(350);
  return exercises.filter((item) => item.deletedAt === null).map(clone);
};

// TODO: 換成 apiFetch('/api/exercises?archived=1', { schema: z.array(exerciseSchema) })
export const mockListArchived = async (): Promise<Exercise[]> => {
  await delay(350);
  return exercises.filter((item) => item.deletedAt !== null).map(clone);
};

// TODO: 換成 apiFetch('/api/exercises/[id]', { schema: exerciseSchema })
export const mockGetExercise = async (id: string): Promise<Exercise | null> => {
  await delay(250);
  const found = exercises.find((item) => item.id === id);
  return found ? clone(found) : null;
};

// TODO: 換成 apiFetch('/api/exercises', { method: 'POST', body, schema: exerciseSchema })
export const mockCreateExercise = async (values: ExerciseFormValues): Promise<Exercise> => {
  await delay(400);
  const created: Exercise = {
    id: createId(),
    name: values.name,
    note: values.note.trim() === '' ? null : values.note,
    videoUrl: null,
    muscleGroups: values.muscleGroups,
    category: values.category,
    force: values.force,
    kineticChain: values.kineticChain,
    mechanic: values.mechanic,
    createdAt: new Date().toISOString(),
    deletedAt: null,
  };
  exercises = [created, ...exercises];
  return clone(created);
};

// TODO: 換成 apiFetch('/api/exercises/[id]', { method: 'PUT', body, schema: exerciseSchema })
export const mockUpdateExercise = async (
  id: string,
  values: ExerciseFormValues,
): Promise<Exercise | null> => {
  await delay(400);
  let updated: Exercise | null = null;
  exercises = exercises.map((item) => {
    if (item.id !== id) return item;
    updated = {
      ...item,
      name: values.name,
      note: values.note.trim() === '' ? null : values.note,
      muscleGroups: values.muscleGroups,
      category: values.category,
      force: values.force,
      kineticChain: values.kineticChain,
      mechanic: values.mechanic,
    };
    return updated;
  });
  return updated ? clone(updated) : null;
};

// TODO: 換成 apiFetch('/api/exercises/[id]', { method: 'DELETE', schema })
export const mockArchiveExercise = async (id: string): Promise<void> => {
  await delay(300);
  exercises = exercises.map((item) =>
    item.id === id ? { ...item, deletedAt: new Date().toISOString() } : item,
  );
};

// TODO: 換成 apiFetch('/api/exercises/[id]/restore', { method: 'POST', schema })
export const mockRestoreExercise = async (id: string): Promise<void> => {
  await delay(300);
  exercises = exercises.map((item) => (item.id === id ? { ...item, deletedAt: null } : item));
};

// TODO: 換成 apiFetch('/api/exercises/[id]/purge', { method: 'POST', schema })
export const mockPurgeExercise = async (id: string): Promise<void> => {
  await delay(300);
  exercises = exercises.filter((item) => item.id !== id);
};

// TODO: 換成 apiFetch('/api/exercises/[id]/note', { method: 'PATCH', body: { note }, schema })
export const mockSetExerciseNote = async (id: string, note: string): Promise<Exercise | null> => {
  await delay(300);
  let updated: Exercise | null = null;
  exercises = exercises.map((item) => {
    if (item.id !== id) return item;
    updated = { ...item, note: note.trim() === '' ? null : note };
    return updated;
  });
  return updated ? clone(updated) : null;
};

// TODO: 換成 apiFetch('/api/upload/authorize' + apiFetch('/api/exercises/[id]/video', ...)
export const mockSetExerciseVideo = async (id: string, videoUrl: string): Promise<void> => {
  await delay(300);
  exercises = exercises.map((item) => (item.id === id ? { ...item, videoUrl } : item));
};

// TODO: 換成 apiFetch('/api/exercises/[id]/usage', { schema: exerciseUsageSchema })
export const mockGetExerciseUsage = async (id: string): Promise<ExerciseUsage> => {
  await delay(250);
  // mock：以 id 衍生穩定的引用數，demo 用。
  const seed = id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const planCount = seed % 3;
  const dates = Array.from({ length: planCount }, (_, index) => `2026-06-${String(10 + index).padStart(2, '0')}`);
  return { planCount, dates };
};

const STARTER_EXERCISES: ExerciseFormValues[] = [
  { name: 'Barbell Bench Press', note: '', muscleGroups: ['chest_mid', 'front_delt', 'triceps'], category: 'HYPERTROPHY', force: 'PUSH', kineticChain: 'CKC', mechanic: 'COMPOUND' },
  { name: 'Back Squat', note: '', muscleGroups: ['quads', 'glutes'], category: 'STRENGTH', force: 'SQUAT', kineticChain: 'CKC', mechanic: 'COMPOUND' },
  { name: 'Deadlift', note: '', muscleGroups: ['hamstrings', 'glutes', 'lower_back'], category: 'STRENGTH', force: 'HINGE', kineticChain: 'CKC', mechanic: 'COMPOUND' },
  { name: 'Pull-up', note: '', muscleGroups: ['lats', 'biceps'], category: 'HYPERTROPHY', force: 'PULL', kineticChain: 'CKC', mechanic: 'COMPOUND' },
  { name: 'Overhead Press', note: '', muscleGroups: ['front_delt', 'side_delt', 'triceps'], category: 'STRENGTH', force: 'PUSH', kineticChain: 'OKC', mechanic: 'COMPOUND' },
  { name: 'Plank', note: '', muscleGroups: ['abs', 'obliques'], category: 'MOBILITY', force: 'STATIC', kineticChain: 'CKC', mechanic: 'ISOLATION' },
];

// TODO: 換成 apiFetch('/api/exercises/quick-start', { method: 'POST', schema })
export const mockQuickStartExercises = async (): Promise<void> => {
  await delay(500);
  const created: Exercise[] = STARTER_EXERCISES.map((values) => ({
    id: createId(),
    name: values.name,
    note: null,
    videoUrl: null,
    muscleGroups: values.muscleGroups,
    category: values.category,
    force: values.force,
    kineticChain: values.kineticChain,
    mechanic: values.mechanic,
    createdAt: new Date().toISOString(),
    deletedAt: null,
  }));
  exercises = [...created, ...exercises];
};
