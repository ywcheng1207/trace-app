import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MoreHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionSheet } from '@/components/ui/action-sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { ScreenContainer } from '@/components/ui/screen-container';
import { SectionHeader } from '@/components/ui/section-header';
import { TextArea } from '@/components/ui/text-area';
import { Fonts, Spacing } from '@/constants/theme';
import { useExercises } from '@/features/exercises/api/hooks';
import { Exercise } from '@/features/exercises/api/schemas';
import {
  useBodyMetric,
  useDayNote,
  useDayPlan,
  useSaveDayNote,
  useSaveDayPlan,
} from '@/features/schedule/api/hooks';
import { MAX_PLAN_EXERCISES, PlanExercise } from '@/features/schedule/api/schemas';
import { BodyMetricsForm } from '@/features/schedule/components/body-metrics-form';
import { ExercisePickerSheet } from '@/features/schedule/components/exercise-picker-sheet';
import { PlanExerciseCard } from '@/features/schedule/components/plan-exercise-card';
import { createPlanExercise, createPlanExerciseFromTemplate } from '@/features/schedule/plan-utils';
import { ApplyTemplateSheet } from '@/features/training-templates/components/apply-template-sheet';
import { SaveTemplateSheet } from '@/features/training-templates/components/save-template-sheet';
import { TrainingTemplate } from '@/features/training-templates/api/schemas';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const DayDetailScreen = () => {
  const { day } = useLocalSearchParams<{ day: string }>();
  const { t } = useTranslation(['schedule', 'notify', 'common']);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: dayPlan } = useDayPlan(day);
  const { data: metric } = useBodyMetric(day);
  const { data: note } = useDayNote(day);
  const { data: library } = useExercises();
  const saveDayPlan = useSaveDayPlan();
  const saveDayNote = useSaveDayNote();

  const [exercises, setExercises] = useState<PlanExercise[]>(dayPlan?.exercises ?? []);
  const [syncedPlan, setSyncedPlan] = useState(dayPlan);
  const [noteText, setNoteText] = useState(note ?? '');
  const [syncedNote, setSyncedNote] = useState(note);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const [isApplyTemplateOpen, setIsApplyTemplateOpen] = useState(false);
  const [isPlanActionsOpen, setIsPlanActionsOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<TrainingTemplate | null>(null);

  const isLibraryEmpty = (library ?? []).length === 0;
  const isAtPlanLimit = exercises.length >= MAX_PLAN_EXERCISES;

  // Re-sync local working copies when loaded data changes (adjust state during render).
  if (dayPlan !== syncedPlan) {
    setSyncedPlan(dayPlan);
    setExercises(dayPlan?.exercises ?? []);
  }
  if (note !== syncedNote) {
    setSyncedNote(note);
    setNoteText(note ?? '');
  }

  const handlePlanChange = (updated: PlanExercise) => {
    setExercises((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleRemoveExercise = (id: string) => {
    setExercises((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddExercise = (exercise: Exercise) => {
    setExercises((prev) => [...prev, createPlanExercise(exercise)]);
  };

  const handleAddPress = () => {
    if (isLibraryEmpty) {
      setIsGuideOpen(true);
      return;
    }
    setIsPickerOpen(true);
  };

  const handleConfirmClear = () => {
    setExercises([]);
    setIsClearConfirmOpen(false);
  };

  const handleGoToExercises = () => {
    setIsGuideOpen(false);
    router.push('/exercises');
  };

  const applyTemplateNow = (template: TrainingTemplate) => {
    setExercises(template.exercises.map(createPlanExerciseFromTemplate));
    dispatch(showNotification({ type: 'success', message: t('template_applied') }));
  };

  const handleApplyTemplate = (template: TrainingTemplate) => {
    setIsApplyTemplateOpen(false);
    if (exercises.length > 0) {
      setPendingTemplate(template);
      return;
    }
    applyTemplateNow(template);
  };

  const handleConfirmOverwrite = () => {
    if (pendingTemplate) applyTemplateNow(pendingTemplate);
    setPendingTemplate(null);
  };

  const handleSavePlan = () => {
    saveDayPlan.mutate(
      { date: day, exercises },
      { onSuccess: () => dispatch(showNotification({ type: 'success', message: t('plan_saved') })) },
    );
  };

  const handleSaveNote = () => {
    saveDayNote.mutate(
      { date: day, note: noteText },
      {
        onSuccess: () =>
          dispatch(showNotification({ type: 'success', message: t('notify:save_success') })),
      },
    );
  };

  const planOverflowAction =
    exercises.length > 0 ? (
      <IconButton
        accessibilityLabel={t('common:more_actions')}
        onPress={() => setIsPlanActionsOpen(true)}
      >
        <MoreHorizontal color={theme.text} size={22} />
      </IconButton>
    ) : null;

  return (
    <ScreenContainer scroll>
      <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={8}>
        <ChevronLeft color={theme.accent} size={20} />
        <Text style={[styles.backText, { color: theme.accent }]}>{t('back')}</Text>
      </Pressable>

      <View>
        <Text style={[styles.title, { color: theme.text }]}>{day}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t('day_subtitle')}</Text>
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('training_plan')} action={planOverflowAction} />
        {exercises.length === 0 ? (
          <Card>
            <EmptyState
              title={t('no_exercises_arranged')}
              description={t('add_first_exercise_desc')}
            />
          </Card>
        ) : (
          <View style={styles.planList}>
            {exercises.map((exercise) => (
              <PlanExerciseCard
                key={exercise.id}
                exercise={exercise}
                onChange={handlePlanChange}
                onRemove={() => handleRemoveExercise(exercise.id)}
              />
            ))}
          </View>
        )}
        <View style={styles.planActionRow}>
          <View style={styles.planActionItem}>
            <Button
              label={t('add_exercise')}
              variant="secondary"
              onPress={handleAddPress}
              disabled={isAtPlanLimit}
              fullWidth
            />
          </View>
          <View style={styles.planActionItem}>
            <Button
              label={t('apply_template')}
              variant="secondary"
              onPress={() => setIsApplyTemplateOpen(true)}
              fullWidth
            />
          </View>
        </View>
        {isAtPlanLimit ? (
          <Text style={[styles.limitHint, { color: theme.muted }]}>
            {t('plan_limit_reached', { max: MAX_PLAN_EXERCISES })}
          </Text>
        ) : null}
        <Button
          label={t('save_plan')}
          onPress={handleSavePlan}
          loading={saveDayPlan.isPending}
          fullWidth
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('body_metric')} />
        <Card>
          <BodyMetricsForm date={day} metric={metric ?? null} />
        </Card>
      </View>

      <View style={styles.section}>
        <SectionHeader title={t('note')} />
        <Card>
          <View style={styles.noteSection}>
            <TextArea
              placeholder={t('note_placeholder')}
              value={noteText}
              onChangeText={setNoteText}
            />
            <Button
              label={t('save_note')}
              onPress={handleSaveNote}
              loading={saveDayNote.isPending}
              fullWidth
            />
          </View>
        </Card>
      </View>

      <ActionSheet
        visible={isPlanActionsOpen}
        onClose={() => setIsPlanActionsOpen(false)}
        title={t('training_plan')}
        actions={[
          {
            key: 'save_as_template',
            label: t('save_as_template'),
            onPress: () => setIsSaveTemplateOpen(true),
          },
          {
            key: 'clear_plan',
            label: t('clear_plan'),
            destructive: true,
            onPress: () => setIsClearConfirmOpen(true),
          },
        ]}
      />

      <ExercisePickerSheet
        visible={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleAddExercise}
      />

      <ConfirmDialog
        visible={isGuideOpen}
        title={t('guide_no_exercise_title')}
        message={t('guide_no_exercise_desc')}
        confirmLabel={t('go_to_exercises')}
        cancelLabel={t('cancel')}
        onConfirm={handleGoToExercises}
        onClose={() => setIsGuideOpen(false)}
      />

      <ConfirmDialog
        visible={isClearConfirmOpen}
        title={t('clear_plan_title')}
        message={t('clear_plan_desc')}
        confirmLabel={t('clear')}
        cancelLabel={t('cancel')}
        destructive
        onConfirm={handleConfirmClear}
        onClose={() => setIsClearConfirmOpen(false)}
      />

      <SaveTemplateSheet
        visible={isSaveTemplateOpen}
        onClose={() => setIsSaveTemplateOpen(false)}
        exercises={exercises}
      />

      <ApplyTemplateSheet
        visible={isApplyTemplateOpen}
        onClose={() => setIsApplyTemplateOpen(false)}
        onApply={handleApplyTemplate}
      />

      <ConfirmDialog
        visible={pendingTemplate !== null}
        title={t('overwrite_plan_title')}
        message={t('overwrite_plan_desc')}
        confirmLabel={t('apply')}
        cancelLabel={t('cancel')}
        onConfirm={handleConfirmOverwrite}
        onClose={() => setPendingTemplate(null)}
      />
    </ScreenContainer>
  );
};

export default DayDetailScreen;

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
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    marginTop: Spacing.half,
  },
  section: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  planList: {
    gap: Spacing.two,
  },
  planActionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  planActionItem: {
    flex: 1,
  },
  limitHint: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
  },
  noteSection: {
    gap: Spacing.three,
  },
});
