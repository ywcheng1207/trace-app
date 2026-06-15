import { useMutation, useQuery } from '@tanstack/react-query';

import {
  mockGetProfile,
  mockSetHiddenMetrics,
  mockUpdateLanguage,
  mockUpdateProfile,
} from '@/features/profile/api/mock';
import { AppLocale, ProfileEditValues } from '@/features/profile/api/schemas';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

const invalidateProfile = () => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile() });
};

export const useProfile = () => {
  // TODO: 換成 apiFetch('/api/users/profile', { schema: profileSchema })
  return useQuery({
    queryKey: QUERY_KEYS.profile(),
    queryFn: () => mockGetProfile(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (values: ProfileEditValues) => mockUpdateProfile(values),
    onSuccess: invalidateProfile,
  });
};

export const useUpdateLanguage = () => {
  return useMutation({
    mutationFn: (language: AppLocale) => mockUpdateLanguage(language),
    onSuccess: invalidateProfile,
  });
};

export const useSetHiddenMetrics = () => {
  return useMutation({
    mutationFn: (hiddenMetrics: string[]) => mockSetHiddenMetrics(hiddenMetrics),
    onSuccess: invalidateProfile,
  });
};
