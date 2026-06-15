import { useQuery } from '@tanstack/react-query';

import { mockGetStats } from '@/features/statistics/api/mock';
import { QUERY_KEYS } from '@/lib/query/query-keys';

export const useStats = (rangeDays: number) => {
  // TODO: 換成 apiFetch('/api/stats/all?startDate=&endDate=', { schema })
  return useQuery({
    queryKey: QUERY_KEYS.stats(rangeDays),
    queryFn: () => mockGetStats(rangeDays),
    staleTime: 1000 * 60,
  });
};
