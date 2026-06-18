import { useVideoPlayer, VideoView } from 'expo-video';
import { Play } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type VideoPlayerCardProps = {
  url: string | null;
};

export const VideoPlayerCard = ({ url }: VideoPlayerCardProps) => {
  const { t } = useTranslation('exercises');
  const theme = useTheme();
  const player = useVideoPlayer(url, (instance) => {
    instance.loop = false;
  });

  if (!url) {
    return (
      <View style={[styles.placeholder, { backgroundColor: theme.backgroundElement }]}>
        <Play color={theme.muted} size={32} />
        <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
          {t('video_player_placeholder')}
        </Text>
      </View>
    );
  }

  return (
    <VideoView player={player} style={styles.video} contentFit="contain" nativeControls />
  );
};

const styles = StyleSheet.create({
  video: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Radius.lg,
  },
  placeholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  placeholderText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
});
