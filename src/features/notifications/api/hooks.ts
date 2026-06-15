import { useMutation, useQuery } from '@tanstack/react-query';

import {
  mockGetNotifications,
  mockMarkAllNotificationsRead,
  mockMarkNotificationRead,
} from '@/features/notifications/api/mock';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

const POLL_INTERVAL_MS = 1000 * 10;

const invalidateNotifications = () => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications() });
};

export const useNotifications = () => {
  // TODO: 換成 apiFetch('/api/notifications', { schema: z.array(systemNotificationSchema) })
  return useQuery({
    queryKey: QUERY_KEYS.notifications(),
    queryFn: () => mockGetNotifications(),
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 0,
  });
};

export const useMarkNotificationRead = () => {
  return useMutation({
    mutationFn: (id: string) => mockMarkNotificationRead(id),
    onSuccess: invalidateNotifications,
  });
};

export const useMarkAllNotificationsRead = () => {
  return useMutation({
    mutationFn: () => mockMarkAllNotificationsRead(),
    onSuccess: invalidateNotifications,
  });
};
