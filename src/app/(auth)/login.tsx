import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useLogin } from '@/features/auth/api/hooks';
import { LoginRequest, loginSchema } from '@/features/auth/api/schemas';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const LoginScreen = () => {
  const { t } = useTranslation(['auth', 'notify']);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const login = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onError: () => dispatch(showNotification({ type: 'error', message: t('notify:login_failed') })),
    });
  });

  return (
    <ScreenContainer scroll edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('loginTitle')}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('loginSubtitle')}</Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('emailLabel')}
            placeholder={t('emailPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email ? t('v_emailInvalid') : undefined}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('passwordLabel')}
            placeholder={t('passwordPlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.password ? t('v_passwordMin') : undefined}
          />
        )}
      />

      <Link href="/forgot-password" style={styles.linkRight}>
        <Text style={[styles.linkText, { color: theme.primary }]}>{t('forgotPasswordLink')}</Text>
      </Link>

      <Button label={t('loginButton')} onPress={onSubmit} loading={login.isPending} fullWidth />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>{t('noAccount')}</Text>
        <Link href="/register">
          <Text style={[styles.linkText, { color: theme.primary }]}>{t('registerButton')}</Text>
        </Link>
      </View>
    </ScreenContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  linkRight: {
    alignSelf: 'flex-end',
  },
  linkText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  footerText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});
