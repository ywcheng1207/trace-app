import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Loading } from '@/components/ui/loading';
import { PageHeader } from '@/components/ui/page-header';
import { Switch } from '@/components/ui/switch';
import { Fonts, Spacing } from '@/constants/theme';
import { useLogout } from '@/features/auth/api/hooks';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { useSetHiddenMetrics, useUpdateLanguage, useProfile } from '@/features/profile/api/hooks';
import { APP_LOCALES, AppLocale } from '@/features/profile/api/schemas';
import { BODY_METRIC_GROUPS } from '@/features/schedule/api/schemas';
import { PasswordChangeSheet } from '@/features/setting/components/password-change-sheet';
import { ProfileEditSheet } from '@/features/setting/components/profile-edit-sheet';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const SettingScreen = () => {
  const { t, i18n } = useTranslation(['setting', 'nav', 'notify', 'schedule']);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { data: profile } = useProfile();
  const updateLanguage = useUpdateLanguage();
  const setHiddenMetrics = useSetHiddenMetrics();
  const logout = useLogout();

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const handleLanguage = (locale: AppLocale) => {
    void i18n.changeLanguage(locale);
    updateLanguage.mutate(locale);
  };

  const handleToggleMetric = (field: string, show: boolean) => {
    if (!profile) return;
    const next = show
      ? profile.hiddenMetrics.filter((item) => item !== field)
      : [...profile.hiddenMetrics, field];
    setHiddenMetrics.mutate(next);
  };

  const handleLogout = async () => {
    await logout();
    dispatch(showNotification({ type: 'success', message: t('notify:logout_success') }));
  };

  if (!profile) return <Loading />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title={t('nav:setting')} subtitle={t('subtitle')} right={<NotificationBell />} />

        <Card>
          <View style={styles.profileRow}>
            <Avatar name={profile.displayName} uri={profile.avatar ?? undefined} size={56} />
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: theme.text }]}>{profile.displayName}</Text>
              <Text style={[styles.email, { color: theme.textSecondary }]}>{profile.email}</Text>
            </View>
          </View>
          <Button
            label={t('edit')}
            variant="secondary"
            size="sm"
            onPress={() => setIsProfileEditOpen(true)}
          />
        </Card>

        <Text style={[styles.section, { color: theme.text }]}>{t('language')}</Text>
        <Card>
          <View style={styles.chips}>
            {APP_LOCALES.map((locale) => (
              <Chip
                key={locale}
                label={t(`lang_${locale.toLowerCase().replace('-', '_')}`)}
                selected={profile.language === locale}
                onPress={() => handleLanguage(locale)}
              />
            ))}
          </View>
        </Card>

        <Text style={[styles.section, { color: theme.text }]}>{t('metric_preferences')}</Text>
        <Card>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            {t('metric_preferences_desc')}
          </Text>
          {BODY_METRIC_GROUPS.map((group) => (
            <View key={group.key} style={styles.metricGroup}>
              <Text style={[styles.metricGroupTitle, { color: theme.textSecondary }]}>
                {t(`schedule:metric_group_${group.key}`)}
              </Text>
              {group.fields.map((field) => (
                <View key={field} style={[styles.metricRow, { borderTopColor: theme.border }]}>
                  <Text style={[styles.metricLabel, { color: theme.text }]}>
                    {t(`schedule:metric_${field}`)}
                  </Text>
                  <Switch
                    value={!profile.hiddenMetrics.includes(field)}
                    onValueChange={(show) => handleToggleMetric(field, show)}
                  />
                </View>
              ))}
            </View>
          ))}
        </Card>

        <Text style={[styles.section, { color: theme.text }]}>{t('account_security')}</Text>
        <Card>
          <Button
            label={t('change_password')}
            variant="secondary"
            onPress={() => setIsPasswordOpen(true)}
            fullWidth
          />
        </Card>

        <Button label={t('nav:logout')} variant="danger" onPress={handleLogout} fullWidth />
      </ScrollView>

      <ProfileEditSheet
        visible={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        profile={profile}
      />
      <PasswordChangeSheet visible={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.three,
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
  section: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  hint: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    marginBottom: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metricGroup: {
    marginTop: Spacing.two,
  },
  metricGroupTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.three,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
    marginTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metricLabel: {
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
});
