import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useResetPassword } from '@/features/auth/api/hooks';
import { ResetPasswordRequest, resetPasswordSchema } from '@/features/auth/api/schemas';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const ResetPasswordScreen = () => {
  const { t } = useTranslation(['auth', 'notify']);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resetPassword = useResetPassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((values) => {
    resetPassword.mutate(values, {
      onSuccess: () => {
        dispatch(showNotification({ type: 'success', message: t('notify:save_success') }));
        router.replace('/login');
      },
    });
  });

  return (
    <ScreenContainer scroll edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('resetPasswordTitle')}</Text>
      </View>

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('newPasswordLabel')}
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
            label={t('confirmNewPasswordLabel')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.confirmPassword ? t('v_passwordsNotMatch') : undefined}
          />
        )}
      />

      <Button
        label={t('submitReset')}
        onPress={onSubmit}
        loading={resetPassword.isPending}
        fullWidth
      />
    </ScreenContainer>
  );
};

export default ResetPasswordScreen;

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
});
