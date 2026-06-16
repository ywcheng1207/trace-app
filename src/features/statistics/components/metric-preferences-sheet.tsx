import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Sheet } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Fonts, Spacing } from '@/constants/theme';
import { useProfile, useSetHiddenMetrics } from '@/features/profile/api/hooks';
import { BODY_METRIC_GROUPS } from '@/features/schedule/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type MetricPreferencesSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export const MetricPreferencesSheet = ({ visible, onClose }: MetricPreferencesSheetProps) => {
  const { t } = useTranslation(['statistics', 'setting', 'schedule']);
  const theme = useTheme();
  const { data: profile } = useProfile();
  const setHiddenMetrics = useSetHiddenMetrics();

  const hiddenMetrics = profile?.hiddenMetrics ?? [];

  const handleToggle = (field: string, show: boolean) => {
    if (!profile) return;
    const next = show
      ? profile.hiddenMetrics.filter((item) => item !== field)
      : [...profile.hiddenMetrics, field];
    setHiddenMetrics.mutate(next);
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={t('metric_preferences_title')}>
      <View style={styles.body}>
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          {t('setting:metric_preferences_desc')}
        </Text>
        {BODY_METRIC_GROUPS.map((group) => (
          <View key={group.key} style={styles.group}>
            <Text style={[styles.groupTitle, { color: theme.textSecondary }]}>
              {t(`schedule:metric_group_${group.key}`)}
            </Text>
            {group.fields.map((field) => (
              <View key={field} style={[styles.row, { borderTopColor: theme.border }]}>
                <Text style={[styles.label, { color: theme.text }]}>
                  {t(`schedule:metric_${field}`)}
                </Text>
                <Switch
                  value={!hiddenMetrics.includes(field)}
                  onValueChange={(show) => handleToggle(field, show)}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingBottom: Spacing.three,
  },
  hint: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    marginBottom: Spacing.two,
  },
  group: {
    marginTop: Spacing.two,
  },
  groupTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.three,
    marginTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
});
