import { subDays } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { CalendarRange, ChevronLeft, Upload } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/ui/chip';
import { DatePicker } from '@/components/ui/date-picker';
import { EmptyState } from '@/components/ui/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { Loading } from '@/components/ui/loading';
import { Fonts, Spacing } from '@/constants/theme';
import { useExercise, useExerciseVideos, useSetExerciseVideo } from '@/features/exercises/api/hooks';
import { ExerciseVideo } from '@/features/exercises/api/schemas';
import { VideoAiResultCard } from '@/features/exercises/components/video-ai-result-card';
import { VideoListItem } from '@/features/exercises/components/video-list-item';
import { VideoPlayerCard } from '@/features/exercises/components/video-player-card';
import { VideoTimeline } from '@/features/exercises/components/video-timeline';
import { toDateKey } from '@/lib/date';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const PRESET_DAYS = [7, 30, 90];

const ExerciseVideoScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation(['exercises', 'statistics', 'notify']);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: exercise } = useExercise(id);
  const setVideo = useSetExerciseVideo();

  const [rangeKind, setRangeKind] = useState<'preset' | 'custom'>('preset');
  const [presetDays, setPresetDays] = useState(90);
  const [customStart, setCustomStart] = useState(toDateKey(subDays(new Date(), 90)));
  const [customEnd, setCustomEnd] = useState(toDateKey(new Date()));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const range =
    rangeKind === 'custom'
      ? { start: customStart, end: customEnd }
      : { start: toDateKey(subDays(new Date(), presetDays - 1)), end: toDateKey(new Date()) };
  const { data: videos, isLoading } = useExerciseVideos(id, range);

  const videoList = videos ?? [];
  const selected: ExerciseVideo | null =
    videoList.find((video) => video.id === selectedId) ?? videoList[0] ?? null;

  const handlePreset = (days: number) => {
    setPresetDays(days);
    setRangeKind('preset');
  };

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 1 });
    // TODO: 上傳影片至後端（/api/upload/authorize + apiFetch），目前僅以本地 uri 記錄
    if (!result.canceled && result.assets[0]) {
      setVideo.mutate(
        { id, videoUrl: result.assets[0].uri },
        { onSuccess: () => dispatch(showNotification({ type: 'success', message: t('video_updated') })) },
      );
    }
  };

  const listHeader = (
    <View style={styles.header}>
      <View style={styles.rangeRow}>
        <View style={styles.chips}>
          {PRESET_DAYS.map((days) => (
            <Chip
              key={days}
              label={t(`statistics:range_${days}`)}
              selected={rangeKind === 'preset' && presetDays === days}
              onPress={() => handlePreset(days)}
            />
          ))}
        </View>
        <IconButton
          active={rangeKind === 'custom'}
          onPress={() => setRangeKind('custom')}
          accessibilityLabel={t('statistics:range_custom')}
        >
          <CalendarRange
            color={rangeKind === 'custom' ? theme.primary : theme.textSecondary}
            size={20}
          />
        </IconButton>
      </View>

      {rangeKind === 'custom' ? (
        <View style={styles.customRange}>
          <View style={styles.customField}>
            <DatePicker
              label={t('statistics:range_start')}
              value={customStart}
              onChange={setCustomStart}
              maxDate={new Date()}
            />
          </View>
          <View style={styles.customField}>
            <DatePicker
              label={t('statistics:range_end')}
              value={customEnd}
              onChange={setCustomEnd}
              maxDate={new Date()}
            />
          </View>
        </View>
      ) : null}

      <VideoPlayerCard url={selected?.url ?? null} />
      {selected?.aiResult ? <VideoAiResultCard result={selected.aiResult} /> : null}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft color={theme.text} size={26} />
        </Pressable>
        <Text style={[styles.topTitle, { color: theme.text }]} numberOfLines={1}>
          {exercise?.name ?? t('video_title')}
        </Text>
        <IconButton onPress={handleUpload} accessibilityLabel={t('video_upload')}>
          <Upload color={theme.textSecondary} size={20} />
        </IconButton>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={videoList}
          keyExtractor={(video) => video.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <VideoListItem
              video={item}
              isActive={selected?.id === item.id}
              onPress={() => setSelectedId(item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState title={t('video_empty_title')} description={t('video_empty_desc')} />
          }
          ListFooterComponent={<VideoTimeline videos={videoList} />}
        />
      )}
    </SafeAreaView>
  );
};

export default ExerciseVideoScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  topTitle: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.three,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    flex: 1,
  },
  customRange: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  customField: {
    flex: 1,
  },
});
