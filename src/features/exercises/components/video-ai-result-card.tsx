import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { ExerciseVideoAiResult } from '@/features/exercises/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type VideoAiResultCardProps = {
  result: ExerciseVideoAiResult;
};

export const VideoAiResultCard = ({ result }: VideoAiResultCardProps) => {
  const { t } = useTranslation('exercises');
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  const analyzedAt = format(new Date(result.analyzedAt), 'yyyy-MM-dd HH:mm');

  return (
    <Card>
      <Pressable style={styles.header} onPress={() => setExpanded((current) => !current)}>
        <View style={styles.headerLeft}>
          <Sparkles color={theme.accent} size={18} />
          <Text style={[styles.title, { color: theme.text }]}>{t('video_ai_result')}</Text>
        </View>
        {expanded ? (
          <ChevronUp color={theme.textSecondary} size={20} />
        ) : (
          <ChevronDown color={theme.textSecondary} size={20} />
        )}
      </Pressable>

      {expanded ? (
        <View style={styles.body}>
          <Text style={[styles.summary, { color: theme.text }]}>{result.summary}</Text>
          <View style={styles.metrics}>
            {result.metrics.map((metric) => (
              <View
                key={metric.label}
                style={[styles.metric, { backgroundColor: theme.backgroundElement }]}
              >
                <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
                  {metric.label}
                </Text>
                <Text style={[styles.metricValue, { color: theme.text }]}>{metric.value}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.timestamp, { color: theme.muted }]}>
            {t('video_analyzed_at')}: {analyzedAt}
          </Text>
        </View>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  body: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
  summary: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metric: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    gap: Spacing.half,
  },
  metricLabel: {
    fontFamily: Fonts.sans,
    fontSize: 11,
  },
  metricValue: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  timestamp: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
});
