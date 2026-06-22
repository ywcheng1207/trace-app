import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';

import { EmptyState } from '@/components/ui/empty-state';
import { Sheet } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useToggleNotificationRead,
} from '@/features/notifications/api/hooks';
import { SystemNotification } from '@/features/notifications/api/schemas';
import { NotificationRow } from '@/features/notifications/components/notification-row';
import { NotificationSectionHeader } from '@/features/notifications/components/notification-section';
import { groupByDate, NotificationSection } from '@/features/notifications/lib/group-notifications';
import { useTheme } from '@/hooks/use-theme';

const SKELETON_ROWS = [0, 1, 2, 3];

export const NotificationBell = () => {
  // Hooks
  const { t } = useTranslation('notify');
  const theme = useTheme();
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const toggleRead = useToggleNotificationRead();
  const deleteNotification = useDeleteNotification();

  // State
  const [isOpen, setIsOpen] = useState(false);

  // 變數
  const unreadCount = notifications.filter((item) => !item.read).length;
  const sections = groupByDate(notifications);

  // Function
  const handleItemPress = (notification: SystemNotification) => {
    if (!notification.read) markRead.mutate(notification.id);
    setIsOpen(false);
    if (notification.actionPath) router.push(notification.actionPath);
  };

  const renderItem = ({ item }: { item: SystemNotification }) => (
    <NotificationRow
      notification={item}
      onPress={() => handleItemPress(item)}
      onToggleRead={() => toggleRead.mutate(item.id)}
      onDelete={() => deleteNotification.mutate(item.id)}
    />
  );

  const renderSectionHeader = ({ section }: { section: NotificationSection }) => (
    <NotificationSectionHeader groupKey={section.key} unreadCount={section.unreadCount} />
  );

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

        {isLoading ? (
          <View style={styles.skeletonList}>
            {SKELETON_ROWS.map((row) => (
              <View key={row} style={styles.skeletonRow}>
                <Skeleton width={36} height={36} radius={Radius.full} />
                <View style={styles.skeletonBody}>
                  <Skeleton width="60%" height={14} />
                  <Skeleton width="90%" height={12} />
                </View>
              </View>
            ))}
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.empty}>
            <EmptyState
              icon={<Bell color={theme.muted} size={32} />}
              title={t('center_empty_title')}
              description={t('center_empty_desc')}
            />
          </View>
        ) : (
          <GestureHandlerRootView style={styles.list}>
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
            />
          </GestureHandlerRootView>
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
  skeletonList: {
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  skeletonBody: {
    flex: 1,
    gap: Spacing.two,
  },
});
