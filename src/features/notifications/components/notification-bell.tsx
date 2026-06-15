import { format, parseISO } from 'date-fns';
import { AlertTriangle, Bell, CheckCircle2, Info, XCircle } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { EmptyState } from '@/components/ui/empty-state';
import { Sheet } from '@/components/ui/sheet';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/features/notifications/api/hooks';
import { NotificationKind, SystemNotification } from '@/features/notifications/api/schemas';
import { useTheme } from '@/hooks/use-theme';

const ICON_BY_KIND = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

type NotificationRowProps = {
  notification: SystemNotification;
  onPress: () => void;
};

const NotificationRow = ({ notification, onPress }: NotificationRowProps) => {
  const theme = useTheme();

  const tintByKind: Record<NotificationKind, string> = {
    success: theme.success,
    error: theme.danger,
    warning: theme.warning,
    info: theme.info,
  };
  const Icon = ICON_BY_KIND[notification.kind];
  const tint = tintByKind[notification.kind];
  const timeLabel = format(parseISO(notification.createdAt), 'MM/dd HH:mm');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        { borderColor: theme.border },
        !notification.read && { backgroundColor: theme.backgroundElement },
      ]}
    >
      <Icon color={tint} size={20} />
      <View style={styles.rowBody}>
        <Text style={[styles.rowTitle, { color: theme.text }]} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={[styles.rowText, { color: theme.textSecondary }]} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={[styles.rowTime, { color: theme.muted }]}>{timeLabel}</Text>
      </View>
      {!notification.read ? (
        <View style={[styles.unreadDot, { backgroundColor: theme.brandOrange }]} />
      ) : null}
    </Pressable>
  );
};

export const NotificationBell = () => {
  // Hooks
  const { t } = useTranslation('notify');
  const theme = useTheme();
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  // State
  const [isOpen, setIsOpen] = useState(false);

  // 變數
  const unreadCount = notifications.filter((item) => !item.read).length;

  // Function
  const handleItemPress = (notification: SystemNotification) => {
    if (!notification.read) markRead.mutate(notification.id);
    setIsOpen(false);
    if (notification.actionPath) router.push(notification.actionPath);
  };

  // JSX
  return (
    <>
      <Pressable onPress={() => setIsOpen(true)} hitSlop={8} style={styles.bell}>
        <Bell color={theme.text} size={22} />
        {unreadCount > 0 ? (
          <View style={[styles.dot, { backgroundColor: theme.danger, borderColor: theme.background }]} />
        ) : null}
      </Pressable>

      <Sheet visible={isOpen} onClose={() => setIsOpen(false)} title={t('center_title')}>
        {unreadCount > 0 ? (
          <Pressable onPress={() => markAll.mutate()} style={styles.markAll} hitSlop={6}>
            <Text style={[styles.markAllText, { color: theme.brandOrange }]}>
              {t('mark_all_read')}
            </Text>
          </Pressable>
        ) : null}

        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <EmptyState
              icon={<Bell color={theme.muted} size={32} />}
              title={t('center_empty_title')}
              description={t('center_empty_desc')}
            />
          </View>
        ) : (
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onPress={() => handleItemPress(notification)}
              />
            ))}
          </ScrollView>
        )}
      </Sheet>
    </>
  );
};

const styles = StyleSheet.create({
  bell: {
    padding: Spacing.one,
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: Radius.full,
    borderWidth: 2,
  },
  markAll: {
    alignSelf: 'flex-end',
    paddingBottom: Spacing.two,
  },
  markAllText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    maxHeight: 460,
  },
  empty: {
    height: 280,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  rowBody: {
    flex: 1,
    gap: Spacing.half,
  },
  rowTitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  rowText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  rowTime: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    marginTop: Spacing.half,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    marginTop: Spacing.one,
  },
});
