import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Loading } from '@/components/ui/loading';
import { ScreenContainer } from '@/components/ui/screen-container';
import { TextArea } from '@/components/ui/text-area';
import { Fonts, Spacing } from '@/constants/theme';
import { useExercise, useSetExerciseNote } from '@/features/exercises/api/hooks';
import { Exercise } from '@/features/exercises/api/schemas';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const ExerciseNoteScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation(['exercises', 'notify']);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: exercise, isLoading } = useExercise(id);
  const setNote = useSetExerciseNote();

  const [text, setText] = useState('');
  const [syncedExercise, setSyncedExercise] = useState<Exercise | null | undefined>(undefined);

  if (exercise !== syncedExercise) {
    setSyncedExercise(exercise);
    setText(exercise?.note ?? '');
  }

  const handleSave = () => {
    setNote.mutate(
      { id, note: text },
      {
        onSuccess: () => {
          dispatch(showNotification({ type: 'success', message: t('notify:save_success') }));
          router.back();
        },
      },
    );
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

  return (
    <ScreenContainer scroll>
      <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={8}>
        <ChevronLeft color={theme.accent} size={20} />
        <Text style={[styles.backText, { color: theme.accent }]}>{t('back')}</Text>
      </Pressable>

      <Text style={[styles.title, { color: theme.text }]}>{t('edit_note_title')}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{exercise.name}</Text>

      <Card>
        <TextArea placeholder={t('note_placeholder')} value={text} onChangeText={setText} />
      </Card>

      <Button label={t('save_note')} onPress={handleSave} loading={setNote.isPending} fullWidth />
    </ScreenContainer>
  );
};

export default ExerciseNoteScreen;

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
  },
});
