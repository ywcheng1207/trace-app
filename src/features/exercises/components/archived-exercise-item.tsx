import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Fonts, Spacing } from '@/constants/theme';
import { Exercise } from '@/features/exercises/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type ArchivedExerciseItemProps = {
  exercise: Exercise;
  onRestore: () => void;
  onPurge: () => void;
};

export const ArchivedExerciseItem = ({
  exercise,
  onRestore,
  onPurge,
}: ArchivedExerciseItemProps) => {
  const { t } = useTranslation('exercises');
  const theme = useTheme();

  return (
    <Card>
      <Text style={[styles.name, { color: theme.text }]}>{exercise.name}</Text>
      <View style={styles.actions}>
        <View style={styles.action}>
          <Button label={t('restore')} variant="secondary" size="sm" onPress={onRestore} fullWidth />
        </View>
        <View style={styles.action}>
          <Button label={t('purge')} variant="danger" size="sm" onPress={onPurge} fullWidth />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  name: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  action: {
    flex: 1,
  },
});
