import { format, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, CheckCircle2, Info, Trash2, XCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { NotificationKind, SystemNotification } from '@/features/notifications/api/schemas';
import { formatRelativeTime } from '@/features/notifications/lib/group-notifications';
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
  onToggleRead: () => void;
  onDelete: () => void;
};

export const NotificationRow = ({
  notification,
  onPress,
  onToggleRead,
  onDelete,
}: NotificationRowProps) => {
  const { t, i18n } = useTranslation('notify');
  const theme = useTheme();

  const tintByKind: Record<NotificationKind, string> = {
    success: theme.success,
    error: theme.danger,
    warning: theme.warning,
    info: theme.info,
  };
  const Icon = ICON_BY_KIND[notification.kind];
  const tint = tintByKind[notification.kind];
  const timeLabel = formatRelativeTime(notification.createdAt, i18n.language);
  const exactLabel = format(parseISO(notification.createdAt), 'MM/dd HH:mm');

  const handleDelete = (methods: SwipeableMethods) => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    methods.close();
    onDelete();
  };

  const handleToggle = (methods: SwipeableMethods) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    methods.close();
    onToggleRead();
  };

  const renderRightActions = (
    _progress: unknown,
    _translation: unknown,
    methods: SwipeableMethods,
  ) => (
    <Pressable
      onPress={() => handleDelete(methods)}
      style={[styles.action, { backgroundColor: theme.danger }]}
    >
      <Trash2 color={theme.primaryForeground} size={20} />
      <Text style={[styles.actionText, { color: theme.primaryForeground }]}>{t('delete')}</Text>
    </Pressable>
  );

  const renderLeftActions = (
    _progress: unknown,
    _translation: unknown,
    methods: SwipeableMethods,
  ) => (
    <Pressable
      onPress={() => handleToggle(methods)}
      style={[styles.action, { backgroundColor: theme.info }]}
    >
      <CheckCircle2 color={theme.primaryForeground} size={20} />
      <Text style={[styles.actionText, { color: theme.primaryForeground }]}>
        {notification.read ? t('mark_unread') : t('mark_read')}
      </Text>
    </Pressable>
  );

  return (
    <ReanimatedSwipeable
      friction={2}
      leftThreshold={40}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.row,
          { backgroundColor: notification.read ? theme.background : theme.backgroundElement },
        ]}
      >
        {!notification.read ? (
          <View style={[styles.unreadBar, { backgroundColor: theme.brandOrange }]} />
        ) : null}
        <View style={[styles.iconChip, { backgroundColor: `${tint}1f` }]}>
          <Icon color={tint} size={20} />
        </View>
        <View style={styles.body}>
          <Text
            style={[styles.title, { color: theme.text }, !notification.read && styles.titleUnread]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          {notification.body ? (
            <Text style={[styles.text, { color: theme.textSecondary }]} numberOfLines={2}>
              {notification.body}
            </Text>
          ) : null}
          <Text style={[styles.time, { color: theme.muted }]}>
            {timeLabel} · {exactLabel}
          </Text>
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.lg,
  },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: Spacing.two,
    bottom: Spacing.two,
    width: 3,
    borderRadius: Radius.full,
  },
  iconChip: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: Spacing.half,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '500',
  },
  titleUnread: {
    fontWeight: '700',
  },
  text: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  time: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    marginTop: Spacing.half,
  },
  action: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.half,
    marginVertical: Spacing.half,
    borderRadius: Radius.lg,
  },
  actionText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
});
