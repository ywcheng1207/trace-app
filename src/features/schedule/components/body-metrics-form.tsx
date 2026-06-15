import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useProfile } from '@/features/profile/api/hooks';
import { useSaveBodyMetric } from '@/features/schedule/api/hooks';
import { BODY_METRIC_FIELDS, BodyMetric, BodyMetricField } from '@/features/schedule/api/schemas';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

type BodyMetricsFormProps = {
  date: string;
  metric: BodyMetric | null;
};

const toInput = (value: number | null | undefined): string =>
  value === null || value === undefined ? '' : String(value);

const parseNumber = (text: string): number | null => {
  if (text.trim() === '') return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
};

const buildInitial = (metric: BodyMetric | null): Record<BodyMetricField, string> => ({
  weight: toInput(metric?.weight),
  bodyFat: toInput(metric?.bodyFat),
  muscleMass: toInput(metric?.muscleMass),
  chest: toInput(metric?.chest),
  waist: toInput(metric?.waist),
  hips: toInput(metric?.hips),
});

export const BodyMetricsForm = ({ date, metric }: BodyMetricsFormProps) => {
  const { t } = useTranslation(['schedule', 'notify']);
  const dispatch = useAppDispatch();
  const saveMetric = useSaveBodyMetric();
  const { data: profile } = useProfile();
  const hiddenMetrics = profile?.hiddenMetrics ?? [];
  const visibleFields = BODY_METRIC_FIELDS.filter((field) => !hiddenMetrics.includes(field));
  const [values, setValues] = useState<Record<BodyMetricField, string>>(() => buildInitial(metric));
  const [syncedMetric, setSyncedMetric] = useState(metric);

  // Re-sync local form when the loaded metric changes (adjust state during render).
  if (metric !== syncedMetric) {
    setSyncedMetric(metric);
    setValues(buildInitial(metric));
  }

  const handleChange = (field: BodyMetricField, text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
  };

  const handleSave = () => {
    const payload: BodyMetric = {
      date,
      weight: parseNumber(values.weight),
      bodyFat: parseNumber(values.bodyFat),
      muscleMass: parseNumber(values.muscleMass),
      chest: parseNumber(values.chest),
      waist: parseNumber(values.waist),
      hips: parseNumber(values.hips),
    };
    saveMetric.mutate(payload, {
      onSuccess: () =>
        dispatch(showNotification({ type: 'success', message: t('metrics_saved') })),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {visibleFields.map((field) => (
          <View key={field} style={styles.field}>
            <TextField
              label={t(`metric_${field}`)}
              keyboardType="numeric"
              value={values[field]}
              onChangeText={(text) => handleChange(field, text)}
            />
          </View>
        ))}
      </View>
      <Button
        label={t('save_metrics')}
        onPress={handleSave}
        loading={saveMetric.isPending}
        fullWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  field: {
    width: '47%',
    flexGrow: 1,
  },
});
