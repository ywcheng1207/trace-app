export const QUERY_KEYS = {
  profile: () => ['profile'] as const,
  userProfile: (userId: string) => ['user', 'profile', userId] as const,
  exercises: () => ['exercises', 'list'] as const,
  archivedExercises: () => ['exercises', 'archived'] as const,
  exerciseDetail: (id: string) => ['exercises', 'detail', id] as const,
  exerciseUsage: (id: string) => ['exercises', 'usage', id] as const,
  exerciseVideos: (id: string, rangeKey: string) =>
    ['exercises', 'videos', id, rangeKey] as const,
  scheduleMonth: (year: number, month: number) => ['schedule', 'month', year, month] as const,
  dayPlan: (date: string) => ['schedule', 'plan', date] as const,
  bodyMetric: (date: string) => ['schedule', 'metric', date] as const,
  dayNote: (date: string) => ['schedule', 'note', date] as const,
  stats: (rangeKey: string) => ['stats', rangeKey] as const,
  notifications: () => ['notifications'] as const,
  trainingTemplates: () => ['training-templates'] as const,
  aiUsage: () => ['ai-coach', 'usage'] as const,
  analysisTask: (id: string) => ['ai-coach', 'task', id] as const,
} as const;
