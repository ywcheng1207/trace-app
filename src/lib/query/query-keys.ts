export const QUERY_KEYS = {
  profile: () => ['profile'] as const,
  userProfile: (userId: string) => ['user', 'profile', userId] as const,
  exercises: () => ['exercises', 'list'] as const,
  archivedExercises: () => ['exercises', 'archived'] as const,
  exerciseDetail: (id: string) => ['exercises', 'detail', id] as const,
  scheduleMonth: (year: number, month: number) => ['schedule', 'month', year, month] as const,
  dayPlan: (date: string) => ['schedule', 'plan', date] as const,
  bodyMetric: (date: string) => ['schedule', 'metric', date] as const,
  dayNote: (date: string) => ['schedule', 'note', date] as const,
  stats: (rangeDays: number) => ['stats', rangeDays] as const,
  notifications: () => ['notifications'] as const,
} as const;
