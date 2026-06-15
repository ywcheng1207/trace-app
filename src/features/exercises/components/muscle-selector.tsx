import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { Fonts, Spacing } from '@/constants/theme';
import { MUSCLE_GROUPS, MUSCLE_REGIONS } from '@/features/exercises/api/schemas';
import { MuscleAnatomy } from '@/features/exercises/components/muscle-anatomy';
import { useTheme } from '@/hooks/use-theme';

type MuscleSelectorProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

export const MuscleSelector = ({ value, onChange }: MuscleSelectorProps) => {
  const { t } = useTranslation('muscle');
  const theme = useTheme();

  const toggle = (muscle: string) => {
    const next = value.includes(muscle)
      ? value.filter((item) => item !== muscle)
      : [...value, muscle];
    onChange(next);
  };

  return (
    <View style={styles.container}>
      <MuscleAnatomy value={value} onChange={onChange} />

      <Text style={[styles.fallbackLabel, { color: theme.textSecondary }]}>{t('fine_select')}</Text>
      {MUSCLE_REGIONS.map((region) => (
        <View key={region} style={styles.region}>
          <Text style={[styles.regionLabel, { color: theme.textSecondary }]}>
            {t(`region_${region}`)}
          </Text>
          <View style={styles.chips}>
            {MUSCLE_GROUPS[region].map((muscle) => (
              <Chip
                key={muscle}
                label={t(muscle)}
                selected={value.includes(muscle)}
                onPress={() => toggle(muscle)}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  fallbackLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  region: {
    gap: Spacing.two,
  },
  regionLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
