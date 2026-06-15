export const QUERY_KEYS = {
  userProfile: (userId: string) => ['user', 'profile', userId] as const,
} as const;
