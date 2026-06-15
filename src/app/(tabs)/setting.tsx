import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { ScreenContainer } from '@/components/ui/screen-container';
import { Skeleton } from '@/components/ui/skeleton';
import { Fonts, Spacing } from '@/constants/theme';
import { useLogout } from '@/features/auth/api/hooks';
import { useProfile } from '@/features/profile/api/hooks';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const SettingScreen = () => {
  const { t } = useTranslation(['nav', 'notify']);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const logout = useLogout();
  const { data: profile } = useProfile();

  const handleLogout = async () => {
    await logout();
    dispatch(showNotification({ type: 'success', message: t('notify:logout_success') }));
  };

  return (
    <ScreenContainer scroll>
      <PageHeader title={t('setting')} />
      <Card>
        <View style={styles.profileRow}>
          {profile ? (
            <Avatar name={profile.displayName} uri={profile.avatar ?? undefined} size={56} />
          ) : (
            <Skeleton width={56} height={56} radius={28} />
          )}
          <View style={styles.profileInfo}>
            {profile ? (
              <Text style={[styles.name, { color: theme.text }]}>{profile.displayName}</Text>
            ) : (
              <Skeleton width={140} height={18} />
            )}
            {profile ? (
              <Text style={[styles.email, { color: theme.textSecondary }]}>{profile.email}</Text>
            ) : (
              <Skeleton width={180} height={14} />
            )}
          </View>
        </View>
      </Card>

      <Button label={t('logout')} variant="danger" onPress={handleLogout} fullWidth />
    </ScreenContainer>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});
