import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import {
  SystemNotification,
  notificationKindSchema,
  notificationActionPathSchema,
} from '@/features/notifications/api/schemas';
import { apiFetch } from '@/lib/api/api-fetch';
import { queryClient } from '@/lib/query/query-client';
import { QUERY_KEYS } from '@/lib/query/query-keys';

const POLL_INTERVAL_MS = 1000 * 10;

//
// Internal poll response schema
//

const pollItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  exerciseName: z.string().optional(),
  exerciseId: z.string().optional(),
  notificationType: z.string().optional(),
});

const pollResponseSchema = z
  .object({ ok: z.boolean(), notifications: z.array(pollItemSchema) })
  .transform((data) =>
    data.notifications.map((n): SystemNotification => ({
      id: n.id,
      kind: notificationKindSchema.catch('info').parse(n.type),
      title: n.exerciseName ?? 'Notification',
      body: '',
      read: false,
      createdAt: new Date().toISOString(),
      actionPath: n.exerciseId
        ? notificationActionPathSchema.catch(undefined as never).parse('/exercises')
        : undefined,
    })),
  );

//
// Helpers
//

const mergeNotifications = (
  incoming: SystemNotification[],
  existing: SystemNotification[] = [],
): SystemNotification[] => {
  const existingIds = new Set(existing.map((n) => n.id));
  const fresh = incoming.filter((n) => !existingIds.has(n.id));
  return fresh.length > 0 ? [...fresh, ...existing] : existing;
};

//
// Hooks
//

export const useNotifications = () => {
  return useQuery({
    queryKey: QUERY_KEYS.notifications(),
    queryFn: async (): Promise<SystemNotification[]> => {
      const incoming = await apiFetch('/api/notifications/poll', {
        schema: pollResponseSchema,
      });
      const existing =
        queryClient.getQueryData<SystemNotification[]>(QUERY_KEYS.notifications()) ?? [];
      return mergeNotifications(incoming, existing);
    },
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 0,
  });
};

export const useMarkNotificationRead = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      queryClient.setQueryData<SystemNotification[]>(QUERY_KEYS.notifications(), (prev) =>
        (prev ?? []).map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  return useMutation({
    mutationFn: async () => {
      queryClient.setQueryData<SystemNotification[]>(QUERY_KEYS.notifications(), (prev) =>
        (prev ?? []).map((n) => ({ ...n, read: true })),
      );
    },
  });
};

export const useDeleteNotification = () => {
  return useMutation({
    // TODO: apiFetch DELETE 當後端提供刪除端點；目前無端點，先以本地 cache 移除
    mutationFn: async (id: string) => {
      queryClient.setQueryData<SystemNotification[]>(QUERY_KEYS.notifications(), (prev) =>
        (prev ?? []).filter((n) => n.id !== id),
      );
    },
  });
};

export const useToggleNotificationRead = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      queryClient.setQueryData<SystemNotification[]>(QUERY_KEYS.notifications(), (prev) =>
        (prev ?? []).map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
      );
    },
  });
};
