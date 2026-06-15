import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Sheet } from '@/components/ui/sheet';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useUpdateProfile } from '@/features/profile/api/hooks';
import {
  GENDERS,
  Profile,
  ProfileEditValues,
  profileEditSchema,
} from '@/features/profile/api/schemas';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

type ProfileEditSheetProps = {
  visible: boolean;
  onClose: () => void;
  profile: Profile;
};

const parseNumber = (text: string): number | null => {
  if (text.trim() === '') return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
};

export const ProfileEditSheet = ({ visible, onClose, profile }: ProfileEditSheetProps) => {
  const { t } = useTranslation('setting');
  const dispatch = useAppDispatch();
  const updateProfile = useUpdateProfile();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      displayName: profile.displayName,
      gender: profile.gender,
      heightCm: profile.heightCm,
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        displayName: profile.displayName,
        gender: profile.gender,
        heightCm: profile.heightCm,
      });
    }
  }, [visible, profile, reset]);

  const genderOptions = GENDERS.map((value) => ({
    value,
    label: t(`gender_${value.toLowerCase()}`),
  }));

  const onSubmit = handleSubmit((values) => {
    updateProfile.mutate(values, {
      onSuccess: () => {
        dispatch(showNotification({ type: 'success', message: t('profile_updated') }));
        onClose();
      },
    });
  });

  return (
    <Sheet visible={visible} onClose={onClose} title={t('personal_info')}>
      <View style={styles.form}>
        <Controller
          control={control}
          name="displayName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('display_name')}
              placeholder={t('display_name_placeholder')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.displayName ? t('v_display_name_required') : undefined}
            />
          )}
        />
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <Select
              label={t('gender')}
              placeholder={t('gender_placeholder')}
              options={genderOptions}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="heightCm"
          render={({ field: { onChange, value } }) => (
            <TextField
              label={t('height')}
              placeholder={t('height_placeholder')}
              keyboardType="numeric"
              value={value === null ? '' : String(value)}
              onChangeText={(text) => onChange(parseNumber(text))}
            />
          )}
        />
        <Button
          label={t('save')}
          onPress={onSubmit}
          loading={updateProfile.isPending}
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
