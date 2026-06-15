import { Trash2, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { TextField } from '@/components/ui/text-field';
import { Fonts, Spacing } from '@/constants/theme';
import { PlanExercise, PlanSet } from '@/features/schedule/api/schemas';
import { createPlanSet } from '@/features/schedule/plan-utils';
import { useTheme } from '@/hooks/use-theme';

type PlanExerciseCardProps = {
  exercise: PlanExercise;
  onChange: (next: PlanExercise) => void;
  onRemove: () => void;
};

const parseNumber = (text: string): number | null => {
  if (text.trim() === '') return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
};

const toInput = (value: number | null): string => (value === null ? '' : String(value));

export const PlanExerciseCard = ({ exercise, onChange, onRemove }: PlanExerciseCardProps) => {
  const { t } = useTranslation('schedule');
  const theme = useTheme();

  const updateSet = (setId: string, patch: Partial<PlanSet>) => {
    onChange({
      ...exercise,
      sets: exercise.sets.map((set) => (set.id === setId ? { ...set, ...patch } : set)),
    });
  };

  const addSet = () => {
    onChange({ ...exercise, sets: [...exercise.sets, createPlanSet()] });
  };

  const removeSet = (setId: string) => {
    onChange({ ...exercise, sets: exercise.sets.filter((set) => set.id !== setId) });
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={[styles.name, { color: theme.text }]}>{exercise.cachedName}</Text>
        <Pressable onPress={onRemove} hitSlop={8}>
          <Trash2 color={theme.danger} size={18} />
        </Pressable>
      </View>

      {exercise.sets.map((set, index) => (
        <View key={set.id} style={[styles.setRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.setIndex, { color: theme.textSecondary }]}>{index + 1}</Text>
          <View style={styles.field}>
            <TextField
              placeholder={t('weight')}
              keyboardType="numeric"
              value={toInput(set.weight)}
              onChangeText={(text) => updateSet(set.id, { weight: parseNumber(text) })}
            />
          </View>
          <View style={styles.field}>
            <TextField
              placeholder={t('reps')}
              keyboardType="numeric"
              value={toInput(set.reps)}
              onChangeText={(text) => updateSet(set.id, { reps: parseNumber(text) })}
            />
          </View>
          <Checkbox
            checked={set.isCompleted}
            onChange={(checked) => updateSet(set.id, { isCompleted: checked })}
          />
          <Pressable onPress={() => removeSet(set.id)} hitSlop={8}>
            <X color={theme.muted} size={18} />
          </Pressable>
        </View>
      ))}

      <Pressable onPress={addSet} style={styles.addSet}>
        <Text style={[styles.addSetText, { color: theme.primary }]}>+ {t('add_set')}</Text>
      </Pressable>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.three,
    marginTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  setIndex: {
    width: 16,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  field: {
    flex: 1,
  },
  addSet: {
    marginTop: Spacing.three,
  },
  addSetText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
});
