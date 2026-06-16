import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Loading } from '@/components/ui/loading';
import { PageHeader } from '@/components/ui/page-header';
import { Fonts, Spacing } from '@/constants/theme';
import {
  useArchivedExercises,
  usePurgeExercise,
  useRestoreExercise,
} from '@/features/exercises/api/hooks';
import { Exercise } from '@/features/exercises/api/schemas';
import { ArchivedExerciseItem } from '@/features/exercises/components/archived-exercise-item';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

const ArchivedExercisesScreen = () => {
  const { t } = useTranslation(['exercises', 'common', 'notify']);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useArchivedExercises();
  const restoreExercise = useRestoreExercise();
  const purgeExercise = usePurgeExercise();

  const [purgingExercise, setPurgingExercise] = useState<Exercise | null>(null);

  const handleRestore = (exercise: Exercise) => {
    restoreExercise.mutate(exercise.id, {
      onSuccess: () =>
        dispatch(showNotification({ type: 'success', message: t('notify:update_success') })),
    });
  };

  const handleConfirmPurge = () => {
    if (!purgingExercise) return;
    purgeExercise.mutate(purgingExercise.id, {
      onSuccess: () =>
        dispatch(showNotification({ type: 'success', message: t('notify:delete_success') })),
    });
    setPurgingExercise(null);
  };

  const renderItem = ({ item }: { item: Exercise }) => (
    <ArchivedExerciseItem
      exercise={item}
      onRestore={() => handleRestore(item)}
      onPurge={() => setPurgingExercise(item)}
    />
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={8}>
          <ChevronLeft color={theme.accent} size={20} />
          <Text style={[styles.backText, { color: theme.accent }]}>{t('back')}</Text>
        </Pressable>
        <PageHeader title={t('archived_exercises')} subtitle={t('archived_subtitle')} />
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title={t('no_archived_items')} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ConfirmDialog
        visible={purgingExercise !== null}
        title={t('purge_confirm_title')}
        message={t('purge_confirm_desc', { name: purgingExercise?.name ?? '' })}
        confirmLabel={t('purge')}
        cancelLabel={t('common:cancel')}
        destructive
        onConfirm={handleConfirmPurge}
        onClose={() => setPurgingExercise(null)}
      />
    </SafeAreaView>
  );
};

export default ArchivedExercisesScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.half,
  },
  backText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
  list: {
    padding: Spacing.three,
    gap: Spacing.two,
    flexGrow: 1,
  },
});
