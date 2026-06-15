import { Exercise, ExerciseFormValues } from '@/features/exercises/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const createId = () => `ex_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

let exercises: Exercise[] = [
  {
    id: 'ex_seed_1',
    name: 'Barbell Bench Press',
    note: 'Focus on a controlled eccentric.',
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
