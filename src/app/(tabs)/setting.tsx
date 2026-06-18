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
import { Fonts, Spacing } from '@/constants/theme';
import { useLogout } from '@/features/auth/api/hooks';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { useUpdateLanguage, useProfile } from '@/features/profile/api/hooks';
import { APP_LOCALES, AppLocale } from '@/features/profile/api/schemas';
import { PasswordChangeSheet } from '@/features/setting/components/password-change-sheet';
import { ProfileEditSheet } from '@/features/setting/components/profile-edit-sheet';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setThemeMode, showNotification } from '@/store/slices/ui-slice';

type ThemeMode = 'light' | 'dark' | 'system';

const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system'];

const SettingScreen = () => {
  const { t, i18n } = useTranslation(['setting', 'nav', 'notify']);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const { data: profile } = useProfile();
  const updateLanguage = useUpdateLanguage();
  const logout = useLogout();

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const handleLanguage = (locale: AppLocale) => {
    void i18n.changeLanguage(locale);
    updateLanguage.mutate(locale);
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
            <Avatar name={profile.displayName} size={56} />
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

        <Text style={[styles.section, { color: theme.text }]}>{t('appearance')}</Text>
        <Card>
          <View style={styles.chips}>
            {THEME_MODES.map((mode) => (
              <Chip
                key={mode}
                label={t(`theme_${mode}`)}
                selected={themeMode === mode}
                onPress={() => dispatch(setThemeMode(mode))}
              />
            ))}
          </View>
        </Card>

        <Text style={[styles.section, { color: theme.text }]}>{t('language')}</Text>
        <Card>
          <View style={styles.chips}>
            {APP_LOCALES.map((locale) => (
              <Chip
                key={locale}
                label={t(`lang_${locale.toLowerCase().replace('-', '_')}`)}
                selected={i18n.language === locale}
                onPress={() => handleLanguage(locale)}
              />
            ))}
          </View>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
