import { useLocalSearchParams, useRouter } from 'expo-router';
import { Archive, ChevronLeft, MoreHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionSheet } from '@/components/ui/action-sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { Loading } from '@/components/ui/loading';
import { ScreenContainer } from '@/components/ui/screen-container';
import { SectionHeader } from '@/components/ui/section-header';
import { Fonts, Spacing } from '@/constants/theme';
import { useArchiveExercise, useExercise, useExerciseUsage } from '@/features/exercises/api/hooks';
import { AiCoachSheet } from '@/features/ai-coach/components/ai-coach-sheet';
import { ExerciseFormSheet } from '@/features/exercises/components/exercise-form-sheet';
import { ExerciseVideoSection } from '@/features/exercises/components/exercise-video-section';
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
  const { data: usage } = useExerciseUsage(id);
  const archiveExercise = useArchiveExercise();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const usageCount = usage?.planCount ?? 0;
  const archiveMessage =
    usageCount > 0
      ? t('archive_confirm_used', { count: usageCount })
      : t('archive_confirm_desc', { name: exercise?.name ?? '' });

  const handleConfirmArchive = () => {
    if (!exercise) return;
    archiveExercise.mutate(exercise.id, {
      onSuccess: () => {
        dispatch(showNotification({ type: 'success', message: t('notify:delete_success') }));
        setIsArchiveConfirmOpen(false);
        router.back();
      },
    });
  };

  const handleAiAdvice = () => {
    setIsAiCoachOpen(true);
  };

  const handleEditNote = () => {
    router.push(`/exercises/note/${id}`);
  };

  const handleViewVideos = () => {
    router.push(`/exercises/video/${id}`);
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

  const noteEditAction = (
    <Pressable onPress={handleEditNote} hitSlop={8}>
      <Text style={[styles.editNote, { color: theme.accent }]}>{t('edit_note')}</Text>
    </Pressable>
  );

  return (
    <ScreenContainer scroll>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={8}>
          <ChevronLeft color={theme.accent} size={20} />
          <Text style={[styles.backText, { color: theme.accent }]}>{t('back')}</Text>
        </Pressable>
        <IconButton
          accessibilityLabel={t('common:more_actions')}
          onPress={() => setIsActionSheetOpen(true)}
        >
          <MoreHorizontal color={theme.text} size={22} />
        </IconButton>
      </View>

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

      <ExerciseVideoSection
        exerciseId={exercise.id}
        videoUrl={exercise.videoUrl}
        onViewVideos={handleViewVideos}
      />

      <SectionHeader title={t('exercise_note')} action={noteEditAction} />
      <Card>
        <Text style={[styles.note, { color: exercise.note ? theme.text : theme.muted }]}>
          {exercise.note ?? t('no_note')}
        </Text>
      </Card>

      <View style={styles.actions}>
        <Button label={t('ai_advice_button')} variant="secondary" onPress={handleAiAdvice} fullWidth />
        <Button label={t('edit')} onPress={() => setIsEditOpen(true)} fullWidth />
      </View>

      <ActionSheet
        visible={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        title={t('common:more_actions')}
        actions={[
          {
            key: 'archive',
            label: t('archive'),
            icon: <Archive color={theme.danger} size={20} />,
            destructive: true,
            onPress: () => setIsArchiveConfirmOpen(true),
          },
        ]}
      />

      <ExerciseFormSheet
        visible={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        exercise={exercise}
      />

      <ConfirmDialog
        visible={isArchiveConfirmOpen}
        title={t('archive_confirm_title')}
        message={archiveMessage}
        confirmLabel={t('archive')}
        cancelLabel={t('common:cancel')}
        destructive
        onConfirm={handleConfirmArchive}
        onClose={() => setIsArchiveConfirmOpen(false)}
      />

      <AiCoachSheet
        visible={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        exerciseId={exercise.id}
      />
    </ScreenContainer>
  );
};

export default ExerciseDetailScreen;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  editNote: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
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
  actions: {
    gap: Spacing.two,
  },
});
