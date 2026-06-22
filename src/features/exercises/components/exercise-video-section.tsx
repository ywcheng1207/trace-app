import * as ImagePicker from 'expo-image-picker';
import { ChevronRight, PlayCircle, Video } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useSetExerciseVideo } from '@/features/exercises/api/hooks';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

type ExerciseVideoSectionProps = {
  exerciseId: string;
  videoUrl: string | null;
  onViewVideos?: () => void;
};

export const ExerciseVideoSection = ({
  exerciseId,
  videoUrl,
  onViewVideos,
}: ExerciseVideoSectionProps) => {
  const { t } = useTranslation(['exercises', 'notify']);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const setVideo = useSetExerciseVideo();

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 1,
    });
    // TODO: 上傳影片至後端（/api/upload/authorize + apiFetch），目前僅以本地 uri 記錄
    if (!result.canceled && result.assets[0]) {
      setVideo.mutate(
        { id: exerciseId, videoUrl: result.assets[0].uri },
        { onSuccess: () => dispatch(showNotification({ type: 'success', message: t('video_updated') })) },
      );
    }
  };

  return (
    <Card>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>{t('demo_video')}</Text>
        {onViewVideos ? (
          <Pressable onPress={onViewVideos} hitSlop={8} style={styles.viewLink}>
            <Text style={[styles.viewLinkText, { color: theme.accent }]}>{t('view_videos')}</Text>
            <ChevronRight color={theme.accent} size={16} />
          </Pressable>
        ) : null}
      </View>
      <View style={[styles.player, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        {videoUrl ? (
          <>
            <PlayCircle color={theme.brandOrange} size={44} />
            <Text style={[styles.playerText, { color: theme.textSecondary }]} numberOfLines={1}>
              {t('video_ready')}
            </Text>
          </>
        ) : (
          <>
            <Video color={theme.muted} size={36} />
            <Text style={[styles.playerText, { color: theme.muted }]}>{t('no_video')}</Text>
          </>
        )}
      </View>
      <Button
        label={videoUrl ? t('change_video') : t('add_video')}
        variant="secondary"
        size="sm"
        onPress={pickVideo}
        loading={setVideo.isPending}
        fullWidth
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  viewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  viewLinkText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '600',
  },
  player: {
    aspectRatio: 16 / 9,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  playerText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
});
