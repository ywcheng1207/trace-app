import { useQuery } from '@tanstack/react-query';

import { mockGetProfile } from '@/features/profile/api/mock';
import { QUERY_KEYS } from '@/lib/query/query-keys';

export const useProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.profile(),
    // TODO: 換成 apiFetch('/api/users/profile', { schema: profileSchema })
    queryFn: () => mockGetProfile(),
    staleTime: 1000 * 60 * 5,
  });
};
