import { useMutation, useQuery } from '@tanstack/react-query';

import { AppLocale, ProfileEditValues, profileResponseSchema } from '@/features/profile/api/schemas';
import { apiFetch } from '@/lib/api/api-fetch';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

const invalidateProfile = () => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile() });
};

export const useProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.profile(),
    queryFn: () => apiFetch('/api/users/profile', { schema: profileResponseSchema }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (values: ProfileEditValues) => {
      await apiFetch('/api/users/profile', {
        method: 'PATCH',
        body: {
          display_name: values.displayName,
          gender: values.gender,
          height: values.heightCm,
          birth_date: values.birthDate,
          timezone: values.timezone,
          // avatar excluded — upload flow not yet implemented
        },
      });
    },
    onSuccess: invalidateProfile,
  });
};

export const useUpdateLanguage = () => {
  // Language is managed locally via i18n — no backend endpoint available
  return useMutation({
    mutationFn: async (_locale: AppLocale) => {
      return;
    },
  });
};

export const useSetHiddenMetrics = () => {
  return useMutation({
    mutationFn: (hiddenMetrics: string[]) =>
      apiFetch('/api/users/profile', {
        method: 'PATCH',
        body: { hidden_metrics: hiddenMetrics },
      }),
    onSuccess: invalidateProfile,
  });
};
