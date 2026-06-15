import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useRequestPasswordReset } from '@/features/auth/api/hooks';
import { ForgotPasswordRequest, forgotPasswordSchema } from '@/features/auth/api/schemas';
import { useTheme } from '@/hooks/use-theme';

const ForgotPasswordScreen = () => {
  const { t } = useTranslation('auth');
  const theme = useTheme();
  const requestReset = useRequestPasswordReset();
  const [isSent, setIsSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit((values) => {
    requestReset.mutate(values, { onSuccess: () => setIsSent(true) });
  });

  if (isSent) {
    return (
      <ScreenContainer edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Text style={[styles.title, { color: theme.text }]}>{t('resetLinkSentTitle')}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t('resetLinkSentMessage')}
          </Text>
          <Link href="/login">
            <Text style={[styles.linkText, { color: theme.primary }]}>{t('backToLogin')}</Text>
          </Link>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{t('forgotPasswordTitle')}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {t('forgotPasswordDescription')}
        </Text>
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

      <Button
        label={t('sendResetLink')}
        onPress={onSubmit}
        loading={requestReset.isPending}
        fullWidth
      />

      <Link href="/login" style={styles.center}>
        <Text style={[styles.linkText, { color: theme.primary }]}>{t('backToLogin')}</Text>
      </Link>
    </ScreenContainer>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  center: {
    alignSelf: 'center',
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  linkText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
});
