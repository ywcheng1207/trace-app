import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RotateCcw } from 'lucide-react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { MUSCLE_GROUP_VALUES, MuscleRegion } from '@/features/exercises/api/schemas';
import { MuscleDrillSheet } from '@/features/exercises/components/muscle-drill-sheet';
import {
  MusclePolygonAnatomy,
  RegionState,
} from '@/features/exercises/components/muscle-polygon-anatomy';
import { useTheme } from '@/hooks/use-theme';

type MuscleSelectorProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

export const MuscleSelector = ({ value, onChange }: MuscleSelectorProps) => {
  const { t } = useTranslation(['exercises', 'muscle']);
  const theme = useTheme();
  const [activeRegion, setActiveRegion] = useState<MuscleRegion | null>(null);

  const getRegionState = (region: MuscleRegion): RegionState => {
    const regionValues = MUSCLE_GROUP_VALUES[region];
    const selectedCount = regionValues.filter((item) => value.includes(item)).length;
    if (selectedCount === 0) return 'empty';
    if (selectedCount === regionValues.length) return 'full';
    return 'partial';
  };

  const toggleMuscle = (muscle: string) => {
    const next = value.includes(muscle)
      ? value.filter((item) => item !== muscle)
      : [...value, muscle];
    onChange(next);
  };

  const toggleRegionAll = (region: MuscleRegion) => {
    const regionValues = MUSCLE_GROUP_VALUES[region];
    const allSelected = regionValues.every((item) => value.includes(item));
    if (allSelected) {
      onChange(value.filter((item) => !regionValues.includes(item)));
    } else {
      const toAdd = regionValues.filter((item) => !value.includes(item));
      onChange([...value, ...toAdd]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.text }]}>{t('target_muscle_group')}</Text>
        <View style={styles.headerRight}>
          {value.length > 0 ? (
            <Pressable onPress={clearAll} style={styles.clear} hitSlop={6}>
              <RotateCcw color={theme.textSecondary} size={13} />
              <Text style={[styles.clearText, { color: theme.textSecondary }]}>{t('clear')}</Text>
            </Pressable>
          ) : null}
          <Text style={[styles.count, { backgroundColor: theme.backgroundElement, color: theme.textSecondary }]}>
            {t('selected')}: {value.length}
          </Text>
        </View>
      </View>

      <Text style={[styles.hint, { color: theme.textSecondary }]}>{t('select_region_hint')}</Text>

      <MusclePolygonAnatomy getRegionState={getRegionState} onSelectRegion={setActiveRegion} />

      <MuscleDrillSheet
        region={activeRegion}
        selected={value}
        onToggleMuscle={toggleMuscle}
        onToggleAll={toggleRegionAll}
        onClose={() => setActiveRegion(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  clear: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  clearText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  count: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  hint: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
});
