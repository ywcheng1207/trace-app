import { Image } from 'expo-image';
import { Play } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { ExerciseVideo } from '@/features/exercises/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type VideoListItemProps = {
  video: ExerciseVideo;
  isActive: boolean;
  onPress: () => void;
};

export const VideoListItem = ({ video, isActive, onPress }: VideoListItemProps) => {
  const { t } = useTranslation('exercises');
  const theme = useTheme();

  const title = video.title ?? t('video_untitled');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        { borderColor: isActive ? theme.primary : theme.border, backgroundColor: theme.card },
      ]}
    >
      <View style={[styles.thumb, { backgroundColor: theme.backgroundElement }]}>
        {video.posterUrl ? (
          <Image source={{ uri: video.posterUrl }} style={styles.thumbImage} contentFit="cover" />
        ) : (
          <Play color={theme.muted} size={20} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.date, { color: theme.text }]}>{video.date}</Text>
        <Text style={[styles.title, { color: theme.textSecondary }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Badge
        label={video.hasAiAnalysis ? t('video_analyzed') : t('video_not_analyzed')}
        variant={video.hasAiAnalysis ? 'success' : 'default'}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: Spacing.half,
  },
  date: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
});
