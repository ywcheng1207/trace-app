import { useQuery } from '@tanstack/react-query';

import { mockGetStats } from '@/features/statistics/api/mock';
import { serializeStatsRange, StatsRange } from '@/features/statistics/api/schemas';
import { QUERY_KEYS } from '@/lib/query/query-keys';

export const useStats = (range: StatsRange) => {
  // TODO: 換成 apiFetch('/api/stats/all?startDate=&endDate=', { schema })
  return useQuery({
    queryKey: QUERY_KEYS.stats(serializeStatsRange(range)),
    queryFn: () => mockGetStats(range),
    staleTime: 1000 * 60,
  });
};
