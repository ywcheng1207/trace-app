import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenContainer } from '@/components/ui/screen-container';
import { TextArea } from '@/components/ui/text-area';
import { Fonts, Spacing } from '@/constants/theme';
import { Exercise } from '@/features/exercises/api/schemas';
import {
  useBodyMetric,
  useDayNote,
  useDayPlan,
  useSaveDayNote,
  useSaveDayPlan,
} from '@/features/schedule/api/hooks';
import { PlanExercise } from '@/features/schedule/api/schemas';
import { BodyMetricsForm } from '@/features/schedule/components/body-metrics-form';
import { ExercisePickerSheet } from '@/features/schedule/components/exercise-picker-sheet';
import { PlanExerciseCard } from '@/features/schedule/components/plan-exercise-card';
import { createPlanExercise } from '@/features/schedule/plan-utils';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const DayDetailScreen = () => {
  const { day } = useLocalSearchParams<{ day: string }>();
  const { t } = useTranslation(['schedule', 'notify']);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: dayPlan } = useDayPlan(day);
  const { data: metric } = useBodyMetric(day);
  const { data: note } = useDayNote(day);
  const saveDayPlan = useSaveDayPlan();
  const saveDayNote = useSaveDayNote();

  const [exercises, setExercises] = useState<PlanExercise[]>(dayPlan?.exercises ?? []);
  const [syncedPlan, setSyncedPlan] = useState(dayPlan);
  const [noteText, setNoteText] = useState(note ?? '');
  const [syncedNote, setSyncedNote] = useState(note);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

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

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('training_plan')}</Text>
      {exercises.length === 0 ? (
        <Card>
          <EmptyState
            title={t('no_exercises_arranged')}
            description={t('add_first_exercise_desc')}
          />
        </Card>
      ) : (
        exercises.map((exercise) => (
          <PlanExerciseCard
            key={exercise.id}
            exercise={exercise}
            onChange={handlePlanChange}
            onRemove={() => handleRemoveExercise(exercise.id)}
          />
        ))
      )}
      <View style={styles.planActions}>
        <Button
          label={t('add_exercise')}
          variant="secondary"
          onPress={() => setIsPickerOpen(true)}
          fullWidth
        />
        <Button
          label={t('save_plan')}
          onPress={handleSavePlan}
          loading={saveDayPlan.isPending}
          fullWidth
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('body_metric')}</Text>
      <Card>
        <BodyMetricsForm date={day} metric={metric ?? null} />
      </Card>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('note')}</Text>
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

      <ExercisePickerSheet
        visible={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleAddExercise}
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
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.two,
  },
  planActions: {
    gap: Spacing.two,
  },
  noteSection: {
    gap: Spacing.three,
  },
});
