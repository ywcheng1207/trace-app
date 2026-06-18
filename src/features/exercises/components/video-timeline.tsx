import { CircleCheck, CircleDashed } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { ExerciseVideo } from '@/features/exercises/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type VideoTimelineProps = {
  videos: ExerciseVideo[];
};

export const VideoTimeline = ({ videos }: VideoTimelineProps) => {
  const { t } = useTranslation('exercises');
  const theme = useTheme();

  if (videos.length === 0) return null;

  const ordered = [...videos].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{t('video_timeline')}</Text>
      {ordered.map((video) => (
        <View key={video.id} style={[styles.row, { borderTopColor: theme.border }]}>
          {video.hasAiAnalysis ? (
            <CircleCheck color={theme.success} size={18} />
          ) : (
            <CircleDashed color={theme.muted} size={18} />
          )}
          <Text style={[styles.date, { color: theme.text }]}>{video.date}</Text>
          <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1}>
            {video.title ?? t('video_untitled')}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.three,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  date: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
});
