import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useRegister } from '@/features/auth/api/hooks';
import { RegisterRequest, registerSchema } from '@/features/auth/api/schemas';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const RegisterScreen = () => {
  const { t } = useTranslation(['auth', 'notify']);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const register = useRegister();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((values) => {
    register.mutate(values, {
      onSuccess: () =>
        dispatch(showNotification({ type: 'success', message: t('notify:register_success') })),
      onError: () =>
        dispatch(showNotification({ type: 'error', message: t('notify:error_occurred') })),
    });
  });

  return (
    <ScreenContainer scroll edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('registerTitle')}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t('registerSubtitle')}
        </Text>
      </View>

      <Controller
        control={control}
        name="displayName"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('displayNameLabel')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.displayName ? t('v_displayNameRequired') : undefined}
          />
        )}
      />
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
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.password ? t('v_passwordMin') : undefined}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('confirmPasswordLabel')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.confirmPassword ? t('v_passwordsNotMatch') : undefined}
          />
        )}
      />

      <Button
        label={t('registerButton')}
        onPress={onSubmit}
        loading={register.isPending}
        fullWidth
      />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>{t('haveAccount')}</Text>
        <Link href="/login">
          <Text style={[styles.linkText, { color: theme.accent }]}>{t('loginButton')}</Text>
        </Link>
      </View>
    </ScreenContainer>
  );
};

export default RegisterScreen;

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
