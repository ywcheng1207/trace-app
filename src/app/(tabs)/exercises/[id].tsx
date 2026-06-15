import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Loading } from '@/components/ui/loading';
import { ScreenContainer } from '@/components/ui/screen-container';
import { Fonts, Spacing } from '@/constants/theme';
import { useArchiveExercise, useExercise } from '@/features/exercises/api/hooks';
import { ExerciseFormSheet } from '@/features/exercises/components/exercise-form-sheet';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const ExerciseDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation(['exercises', 'common', 'notify']);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: exercise, isLoading } = useExercise(id);
  const archiveExercise = useArchiveExercise();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleArchive = () => {
    if (!exercise) return;
    Alert.alert(t('archive_confirm_title'), t('archive_confirm_desc', { name: exercise.name }), [
      { text: t('common:cancel'), style: 'cancel' },
      {
        text: t('archive'),
        style: 'destructive',
        onPress: () =>
          archiveExercise.mutate(exercise.id, {
            onSuccess: () => {
              dispatch(showNotification({ type: 'success', message: t('notify:delete_success') }));
              router.back();
            },
          }),
      },
    ]);
  };

  const handleAiAdvice = () => {
    dispatch(showNotification({ type: 'info', message: t('common:comingSoon') }));
  };

  if (isLoading) return <Loading />;

  if (!exercise) {
    return (
      <ScreenContainer>
        <EmptyState
          title={t('exercise_not_found')}
          action={<Button label={t('back')} variant="secondary" onPress={() => router.back()} />}
        />
      </ScreenContainer>
    );
  }

  const categoryLabel = exercise.category
    ? t(`category_${exercise.category.toLowerCase()}`)
    : '—';
  const forceLabel = exercise.force ? t(`force_${exercise.force.toLowerCase()}`) : '—';
  const mechanicLabel = exercise.mechanic
    ? t(`mechanic_${exercise.mechanic.toLowerCase()}`)
    : '—';
  const kineticChainLabel = exercise.kineticChain
    ? t(`kinetic_chain_${exercise.kineticChain.toLowerCase()}`)
    : '—';

  const attributes = [
    { key: 'category', label: t('exercise_category'), value: categoryLabel },
    { key: 'force', label: t('exercise_force'), value: forceLabel },
    { key: 'mechanic', label: t('exercise_mechanic'), value: mechanicLabel },
    { key: 'kineticChain', label: t('exercise_kinetic_chain'), value: kineticChainLabel },
  ];

  return (
    <ScreenContainer scroll>
      <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={8}>
        <ChevronLeft color={theme.primary} size={20} />
        <Text style={[styles.backText, { color: theme.primary }]}>{t('back')}</Text>
      </Pressable>

      <Text style={[styles.title, { color: theme.text }]}>{exercise.name}</Text>

      <Card>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('basic_info')}</Text>
        {attributes.map((attribute) => (
          <View key={attribute.key} style={styles.attrRow}>
            <Text style={[styles.attrLabel, { color: theme.textSecondary }]}>
              {attribute.label}
            </Text>
            <Text style={[styles.attrValue, { color: theme.text }]}>{attribute.value}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t('target_muscle_group')}
        </Text>
        {exercise.muscleGroups.length > 0 ? (
          <View style={styles.muscles}>
            {exercise.muscleGroups.map((muscle) => (
              <Chip key={muscle} label={t(`muscle:${muscle}`)} selected />
            ))}
          </View>
        ) : (
          <Badge label="—" />
        )}
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          {t('exercise_note')}
        </Text>
        <Text style={[styles.note, { color: exercise.note ? theme.text : theme.muted }]}>
          {exercise.note ?? t('no_note')}
        </Text>
      </Card>

      <View style={styles.buttons}>
        <Button label={t('edit')} onPress={() => setIsEditOpen(true)} fullWidth />
        <Button label={t('ai_advice_button')} variant="secondary" onPress={handleAiAdvice} fullWidth />
        <Button label={t('archive')} variant="danger" onPress={handleArchive} fullWidth />
      </View>

      <ExerciseFormSheet
        visible={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        exercise={exercise}
      />
    </ScreenContainer>
  );
};

export default ExerciseDetailScreen;

const styles = StyleSheet.create({
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  backText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 26,
    fontWeight: '700',
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.one,
  },
  attrLabel: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  attrValue: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  muscles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  note: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  buttons: {
    gap: Spacing.two,
  },
});
