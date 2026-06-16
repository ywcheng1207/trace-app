import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Select } from '@/components/ui/select';
import { Sheet } from '@/components/ui/sheet';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useUpdateProfile } from '@/features/profile/api/hooks';
import {
  GENDERS,
  Profile,
  ProfileEditValues,
  profileEditSchema,
} from '@/features/profile/api/schemas';
import { COMMON_TIMEZONES } from '@/features/profile/timezones';
import { useTheme } from '@/hooks/use-theme';
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

const buildDefaults = (profile: Profile): ProfileEditValues => ({
  displayName: profile.displayName,
  avatar: profile.avatar,
  gender: profile.gender,
  heightCm: profile.heightCm,
  birthDate: profile.birthDate,
  timezone: profile.timezone,
});

export const ProfileEditSheet = ({ visible, onClose, profile }: ProfileEditSheetProps) => {
  const { t } = useTranslation('setting');
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const updateProfile = useUpdateProfile();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: buildDefaults(profile),
  });

  useEffect(() => {
    if (visible) reset(buildDefaults(profile));
  }, [visible, profile, reset]);

  const genderOptions = GENDERS.map((value) => ({
    value,
    label: t(`gender_${value.toLowerCase()}`),
  }));

  const pickAvatar = async (onChange: (uri: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    // TODO: 上傳選取的圖片至後端（apiFetch），目前僅以本地 uri 作為預覽
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

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
          name="avatar"
          render={({ field: { onChange, value } }) => (
            <View style={styles.avatarRow}>
              <Avatar name={profile.displayName} uri={value ?? undefined} size={64} />
              <Pressable onPress={() => pickAvatar(onChange)} hitSlop={8}>
                <Text style={[styles.changeAvatar, { color: theme.accent }]}>
                  {t('change_avatar')}
                </Text>
              </Pressable>
            </View>
          )}
        />
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
        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label={t('birth_date')}
              placeholder={t('birth_date_placeholder')}
              value={value}
              onChange={onChange}
              maxDate={new Date()}
            />
          )}
        />
        <Controller
          control={control}
          name="timezone"
          render={({ field: { onChange, value } }) => (
            <Select
              label={t('timezone')}
              placeholder={t('timezone_placeholder')}
              options={COMMON_TIMEZONES}
              value={value}
              onChange={onChange}
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
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  changeAvatar: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
});
