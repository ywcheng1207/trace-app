import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useRegister } from '@/features/auth/api/hooks';
import { RegisterRequest, registerSchema } from '@/features/auth/api/schemas';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

export const RegisterForm = () => {
  const { t } = useTranslation(['auth', 'notify']);
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
    <View style={styles.form}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: Spacing.two,
  },
});
