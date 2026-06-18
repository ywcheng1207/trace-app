import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useLogin } from '@/features/auth/api/hooks';
import { LoginRequest, loginSchema } from '@/features/auth/api/schemas';
import { ApiError } from '@/lib/api/api-fetch';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

export const LoginForm = () => {
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
      onError: (error) => {
        // Backend returns 400 for bad credentials (user-not-found / wrong password),
        // 401 reserved for token auth. Anything else is a connection/system failure.
        const isCredentialError =
          error instanceof ApiError && (error.code === 400 || error.code === 401);
        const messageKey = isCredentialError ? 'notify:login_failed' : 'notify:connection_failed';
        dispatch(showNotification({ type: 'error', message: t(messageKey) }));
      },
    });
  });

  return (
    <View style={styles.form}>
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
        <Text style={[styles.linkText, { color: theme.accent }]}>{t('forgotPasswordLink')}</Text>
      </Link>

      <Button label={t('loginButton')} onPress={onSubmit} loading={login.isPending} fullWidth />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: Spacing.two,
  },
  linkRight: {
    alignSelf: 'flex-end',
  },
  linkText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
});
