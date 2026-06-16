import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { Sheet } from '@/components/ui/sheet';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { MUSCLE_GROUP_VALUES, MuscleRegion } from '@/features/exercises/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type MuscleDrillSheetProps = {
  region: MuscleRegion | null;
  selected: string[];
  onToggleMuscle: (value: string) => void;
  onToggleAll: (region: MuscleRegion) => void;
  onClose: () => void;
};

export const MuscleDrillSheet = ({
  region,
  selected,
  onToggleMuscle,
  onToggleAll,
  onClose,
}: MuscleDrillSheetProps) => {
  const { t } = useTranslation(['muscle', 'exercises']);
  const theme = useTheme();

  const values = region ? MUSCLE_GROUP_VALUES[region] : [];
  const allSelected = values.length > 0 && values.every((value) => selected.includes(value));
  const title = region ? t(`muscle:region_${region}`) : '';

  return (
    <Sheet visible={region !== null} onClose={onClose} title={title}>
      <View style={styles.body}>
        {region ? (
          <Pressable
            onPress={() => onToggleAll(region)}
            style={[styles.selectAll, { backgroundColor: `${theme.primary}1a` }]}
          >
            <Text style={[styles.selectAllText, { color: theme.primary }]}>
              {allSelected ? t('exercises:clear') : t('exercises:select_all_region')}
            </Text>
          </Pressable>
        ) : null}

        <View style={styles.chips}>
          {values.map((value) => (
            <Chip
              key={value}
              label={t(`muscle:${value}`)}
              selected={selected.includes(value)}
              onPress={() => onToggleMuscle(value)}
            />
          ))}
        </View>
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: Spacing.three,
    paddingBottom: Spacing.three,
  },
  selectAll: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.full,
  },
  selectAllText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
