import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Fonts, Spacing } from '@/constants/theme';
import { Exercise } from '@/features/exercises/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type ExerciseCardProps = {
  exercise: Exercise;
  onPress: () => void;
};

export const ExerciseCard = ({ exercise, onPress }: ExerciseCardProps) => {
  const { t } = useTranslation(['exercises', 'muscle']);
  const theme = useTheme();

  const muscleLabel = exercise.muscleGroups
    .slice(0, 4)
    .map((muscle) => t(`muscle:${muscle}`))
    .join(' · ');
  const categoryLabel = exercise.category
    ? t(`exercises:category_${exercise.category.toLowerCase()}`)
    : null;
  const mechanicLabel = exercise.mechanic
    ? t(`exercises:mechanic_${exercise.mechanic.toLowerCase()}`)
    : null;

  return (
    <Pressable onPress={onPress}>
      <Card>
        <Text style={[styles.name, { color: theme.text }]}>{exercise.name}</Text>
        {muscleLabel ? (
          <Text style={[styles.muscles, { color: theme.textSecondary }]} numberOfLines={1}>
            {muscleLabel}
          </Text>
        ) : null}
        <View style={styles.badges}>
          {categoryLabel ? <Badge label={categoryLabel} variant="primary" /> : null}
          {mechanicLabel ? <Badge label={mechanicLabel} /> : null}
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  name: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  muscles: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    marginTop: Spacing.half,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
