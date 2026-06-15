import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useChangePassword } from '@/features/auth/api/hooks';
import { PasswordChangeRequest, passwordChangeSchema } from '@/features/auth/api/schemas';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

type PasswordChangeSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const DEFAULT_VALUES: PasswordChangeRequest = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const PasswordChangeSheet = ({ visible, onClose }: PasswordChangeSheetProps) => {
  const { t } = useTranslation(['setting', 'notify']);
  const dispatch = useAppDispatch();
  const changePassword = useChangePassword();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeRequest>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = handleSubmit((values) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        dispatch(showNotification({ type: 'success', message: t('password_changed') }));
        reset(DEFAULT_VALUES);
        onClose();
      },
      onError: () =>
        dispatch(showNotification({ type: 'error', message: t('notify:error_occurred') })),
    });
  });

  return (
    <Sheet visible={visible} onClose={onClose} title={t('change_password')}>
      <View style={styles.form}>
        <Controller
          control={control}
          name="oldPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('old_password')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.oldPassword ? t('v_old_password_required') : undefined}
            />
          )}
        />
        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('new_password')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.newPassword ? t('v_password_min') : undefined}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('confirm_new_password')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              error={errors.confirmPassword ? t('v_passwords_not_match') : undefined}
            />
          )}
        />
        <Button
          label={t('change_password')}
          onPress={onSubmit}
          loading={changePassword.isPending}
          fullWidth
        />
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
});
