import { CreateTemplateInput, TrainingTemplate } from '@/features/training-templates/api/schemas';

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const createId = () => `tpl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const TEMPLATE_NAME_TAKEN = 'TEMPLATE_NAME_TAKEN';

let templates: TrainingTemplate[] = [
  {
    id: 'tpl_seed_1',
    name: '推日 Push',
    exercises: [
      { exerciseId: 'ex_seed_1', cachedName: 'Barbell Bench Press', setCount: 4 },
      { exerciseId: 'ex_seed_3', cachedName: 'Lat Pulldown', setCount: 3 },
    ],
    createdAt: '2026-06-01T08:00:00.000Z',
  },
  {
    id: 'tpl_seed_2',
    name: '腿日 Legs',
    exercises: [
      { exerciseId: 'ex_seed_2', cachedName: 'Back Squat', setCount: 5 },
      { exerciseId: 'ex_removed_legacy', cachedName: 'Leg Press (已移除)', setCount: 3 },
    ],
    createdAt: '2026-06-02T08:00:00.000Z',
  },
];

const clone = (template: TrainingTemplate): TrainingTemplate => ({
  ...template,
  exercises: template.exercises.map((item) => ({ ...item })),
});

// TODO: 換成 apiFetch('/api/training-templates', { schema: z.array(trainingTemplateSchema) })
export const mockListTemplates = async (): Promise<TrainingTemplate[]> => {
  await delay(250);
  return templates.map(clone);
};

// TODO: 換成 apiFetch('/api/training-templates', { method: 'POST', body, schema })
export const mockCreateTemplate = async (input: CreateTemplateInput): Promise<TrainingTemplate> => {
  await delay(300);
  const name = input.name.trim();
  if (templates.some((template) => template.name === name)) {
    throw new Error(TEMPLATE_NAME_TAKEN);
  }
  const created: TrainingTemplate = {
    id: createId(),
    name,
    exercises: input.exercises.map((item) => ({ ...item })),
    createdAt: new Date().toISOString(),
  };
  templates = [created, ...templates];
  return clone(created);
};

// TODO: 換成 apiFetch('/api/training-templates/[id]', { method: 'DELETE' })
export const mockDeleteTemplate = async (id: string): Promise<void> => {
  await delay(250);
  templates = templates.filter((template) => template.id !== id);
};
