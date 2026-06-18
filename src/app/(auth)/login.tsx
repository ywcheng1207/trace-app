import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { BrandLabel } from '@/components/ui/brand-label';
import { ScreenContainer } from '@/components/ui/screen-container';
import { Spacing } from '@/constants/theme';
import { AuthTab, AuthTabs } from '@/features/auth/components/auth-tabs';
import { LoginForm } from '@/features/auth/components/login-form';
import { RegisterForm } from '@/features/auth/components/register-form';
import { useTheme } from '@/hooks/use-theme';

const LoginScreen = () => {
  const { t } = useTranslation('auth');
  const theme = useTheme();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<AuthTab>(params.tab === 'register' ? 'register' : 'login');

  return (
    <ScreenContainer scroll edges={['top', 'bottom']}>
      <View style={styles.brand}>
        <View style={[styles.mascotGlow, { backgroundColor: theme.brandYellow }]} />
        <Image
          source={require('@/assets/images/mascot/squat.gif')}
          style={styles.mascot}
          contentFit="contain"
          accessibilityLabel="Trace"
        />
        <BrandLabel size={26} />
      </View>

      <AuthTabs
        value={tab}
        onChange={setTab}
        loginLabel={t('loginButton')}
        registerLabel={t('registerButton')}
      />

      {tab === 'login' ? <LoginForm /> : <RegisterForm />}
    </ScreenContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
  },
  mascotGlow: {
    position: 'absolute',
    top: Spacing.four,
    width: 96,
    height: 96,
    borderRadius: 48,
    opacity: 0.18,
  },
  mascot: {
    width: 96,
    height: 96,
  },
});
