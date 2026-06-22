import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { NotificationGroupKey } from '@/features/notifications/lib/group-notifications';
import { useTheme } from '@/hooks/use-theme';

const TITLE_KEY: Record<NotificationGroupKey, string> = {
  today: 'group_today',
  yesterday: 'group_yesterday',
  thisWeek: 'group_this_week',
  earlier: 'group_earlier',
};

type NotificationSectionHeaderProps = {
  groupKey: NotificationGroupKey;
  unreadCount: number;
};

export const NotificationSectionHeader = ({
  groupKey,
  unreadCount,
}: NotificationSectionHeaderProps) => {
  const { t } = useTranslation('notify');
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>{t(TITLE_KEY[groupKey])}</Text>
      {unreadCount > 0 ? (
        <View style={[styles.badge, { backgroundColor: theme.brandOrange }]}>
          <Text style={[styles.badgeText, { color: theme.primaryForeground }]}>{unreadCount}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
  },
});
