import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { EmptyState } from '@/components/ui/empty-state';
import { Sheet } from '@/components/ui/sheet';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { useExercises } from '@/features/exercises/api/hooks';
import { Exercise } from '@/features/exercises/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type ExercisePickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
};

export const ExercisePickerSheet = ({ visible, onClose, onSelect }: ExercisePickerSheetProps) => {
  const { t } = useTranslation('schedule');
  const theme = useTheme();
  const { data } = useExercises();
  const [search, setSearch] = useState('');

  const normalizedSearch = search.trim().toLowerCase();
  const items = (data ?? []).filter(
    (exercise) =>
      normalizedSearch === '' || exercise.name.toLowerCase().includes(normalizedSearch),
  );

  const handlePick = (exercise: Exercise) => {
    onSelect(exercise);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={t('select_exercise')}>
      <TextField
        placeholder={t('search_placeholder')}
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
      <ScrollView style={styles.list}>
        {items.length === 0 ? (
          <EmptyState title={t('no_exercises_in_library')} />
        ) : (
          items.map((exercise) => (
            <Pressable
              key={exercise.id}
              onPress={() => handlePick(exercise)}
              style={[styles.row, { borderBottomColor: theme.border }]}
            >
              <Text style={[styles.name, { color: theme.text }]}>{exercise.name}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  list: {
    maxHeight: 360,
    marginTop: Spacing.three,
  },
  row: {
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  name: {
    fontFamily: Fonts.sans,
    fontSize: 16,
  },
});
