import { z } from 'zod';

export const notificationKindSchema = z.enum(['success', 'error', 'warning', 'info']);
export type NotificationKind = z.infer<typeof notificationKindSchema>;

export const notificationActionPathSchema = z.enum([
  '/schedule',
  '/exercises',
  '/statistics',
  '/setting',
]);
export type NotificationActionPath = z.infer<typeof notificationActionPathSchema>;

export const systemNotificationSchema = z.object({
  id: z.string(),
  kind: notificationKindSchema,
  title: z.string(),
  body: z.string(),
  read: z.boolean(),
  createdAt: z.string(),
  actionPath: notificationActionPathSchema.optional(),
});
export type SystemNotification = z.infer<typeof systemNotificationSchema>;
