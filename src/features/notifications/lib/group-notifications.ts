import { format, formatDistanceToNow, isThisWeek, isToday, isYesterday, parseISO } from 'date-fns';
import { enUS, zhCN, zhTW, type Locale } from 'date-fns/locale';

import { SystemNotification } from '@/features/notifications/api/schemas';

export type NotificationGroupKey = 'today' | 'yesterday' | 'thisWeek' | 'earlier';

export type NotificationSection = {
  key: NotificationGroupKey;
  unreadCount: number;
  data: SystemNotification[];
};

const ORDER: NotificationGroupKey[] = ['today', 'yesterday', 'thisWeek', 'earlier'];

const bucketOf = (date: Date): NotificationGroupKey => {
  if (isToday(date)) return 'today';
  if (isYesterday(date)) return 'yesterday';
  if (isThisWeek(date)) return 'thisWeek';
  return 'earlier';
};

/** Group notifications into Today / Yesterday / This week / Earlier sections (empty buckets omitted). */
export const groupByDate = (items: SystemNotification[]): NotificationSection[] => {
  const buckets = new Map<NotificationGroupKey, SystemNotification[]>();
  for (const item of items) {
    const key = bucketOf(parseISO(item.createdAt));
    const list = buckets.get(key) ?? [];
    list.push(item);
    buckets.set(key, list);
  }

  return ORDER.reduce<NotificationSection[]>((sections, key) => {
    const data = buckets.get(key);
    if (!data || data.length === 0) return sections;
    const unreadCount = data.filter((n) => !n.read).length;
    sections.push({ key, unreadCount, data });
    return sections;
  }, []);
};

const localeOf = (language: string): Locale => {
  if (language.startsWith('zh-Hant')) return zhTW;
  if (language.startsWith('zh-Hans')) return zhCN;
  return enUS;
};

/** Relative time for recent items (today/yesterday/this week), absolute MM/dd for older ones. */
export const formatRelativeTime = (createdAt: string, language: string): string => {
  const date = parseISO(createdAt);
  if (bucketOf(date) === 'earlier') return format(date, 'MM/dd');
  return formatDistanceToNow(date, { addSuffix: true, locale: localeOf(language) });
};
