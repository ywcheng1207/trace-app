import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ScreenContainer } from '@/components/ui/screen-container';
import { NoteLimits } from '@/constants/limits';
import { Fonts, Spacing } from '@/constants/theme';
import { RichTextEditor } from '@/features/notes/components/rich-text-editor';
import { getNoteLength } from '@/features/notes/lib/tiptap';
import { useDayNote, useSaveDayNote } from '@/features/schedule/api/hooks';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const DayNoteScreen = () => {
  const { day } = useLocalSearchParams<{ day: string }>();
  const { t } = useTranslation(['schedule', 'notify']);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: note, isLoading } = useDayNote(day);
  const saveDayNote = useSaveDayNote();

  const [content, setContent] = useState('');
  const [syncedDay, setSyncedDay] = useState<string | null>(null);

  if (!isLoading && day !== syncedDay) {
    setSyncedDay(day);
    setContent(note ?? '');
  }

  const handleSave = () => {
    if (getNoteLength(content) > NoteLimits.TRAINING_NOTE) {
      dispatch(showNotification({ type: 'error', message: t('notify:note_too_long') }));
      return;
    }
    saveDayNote.mutate(
      { date: day, note: content },
      {
        onSuccess: () => {
          dispatch(showNotification({ type: 'success', message: t('notify:save_success') }));
          router.back();
        },
      },
    );
  };

  if (isLoading) return <Loading />;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={8}>
          <ChevronLeft color={theme.accent} size={20} />
          <Text style={[styles.backText, { color: theme.accent }]}>{t('back')}</Text>
        </Pressable>
        <Button
          label={t('save_note')}
          size="sm"
          onPress={handleSave}
          loading={saveDayNote.isPending}
        />
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{t('note')}</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{day}</Text>

      <View style={styles.editor}>
        <RichTextEditor
          value={content}
          onChange={setContent}
          maxLength={NoteLimits.TRAINING_NOTE}
          placeholder={t('note_placeholder')}
        />
      </View>
    </ScreenContainer>
  );
};

export default DayNoteScreen;

const styles = StyleSheet.create({
  header: {
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
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  editor: {
    flex: 1,
  },
});
