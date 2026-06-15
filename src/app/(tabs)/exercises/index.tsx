import { useRouter } from 'expo-router';
import { Archive, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Loading } from '@/components/ui/loading';
import { PageHeader } from '@/components/ui/page-header';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useExercises } from '@/features/exercises/api/hooks';
import {
  Exercise,
  MUSCLE_GROUP_VALUES,
  MUSCLE_REGIONS,
  MuscleRegion,
} from '@/features/exercises/api/schemas';
import { ExerciseCard } from '@/features/exercises/components/exercise-card';
import { ExerciseFormSheet } from '@/features/exercises/components/exercise-form-sheet';
import { useTheme } from '@/hooks/use-theme';

const ExercisesScreen = () => {
  const { t } = useTranslation(['exercises', 'muscle']);
  const theme = useTheme();
  const router = useRouter();
  const { data, isLoading } = useExercises();

  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<MuscleRegion | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const normalizedSearch = search.trim().toLowerCase();
  const exercises = data ?? [];
  const filtered = exercises.filter((exercise) => {
    const matchesSearch =
      normalizedSearch === '' || exercise.name.toLowerCase().includes(normalizedSearch);
    const matchesRegion =
      regionFilter === null ||
      exercise.muscleGroups.some((muscle) => MUSCLE_GROUP_VALUES[regionFilter].includes(muscle));
    return matchesSearch && matchesRegion;
  });

  const isEmpty = exercises.length === 0;
  const emptyTitle = isEmpty ? t('no_exercises_title') : t('no_search_results');
  const emptyDesc = isEmpty ? t('no_exercises_desc') : undefined;

  const renderItem = ({ item }: { item: Exercise }) => (
    <ExerciseCard exercise={item} onPress={() => router.push(`/exercises/${item.id}`)} />
  );

  const headerActions = (
    <View style={styles.actions}>
      <Pressable onPress={() => router.push('/exercises/archived')} hitSlop={8}>
        <Archive color={theme.textSecondary} size={22} />
      </Pressable>
      <Pressable onPress={() => setIsFormOpen(true)} hitSlop={8}>
        <Plus color={theme.primary} size={26} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <PageHeader title={t('my_exercises')} right={headerActions} />
        <TextField
          placeholder={t('search_placeholder')}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip
            label={t('filter_all')}
            selected={regionFilter === null}
            onPress={() => setRegionFilter(null)}
          />
          {MUSCLE_REGIONS.map((region) => (
            <Chip
              key={region}
              label={t(`muscle:region_${region}`)}
              selected={regionFilter === region}
              onPress={() => setRegionFilter(region)}
            />
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title={emptyTitle} description={emptyDesc} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ExerciseFormSheet visible={isFormOpen} onClose={() => setIsFormOpen(false)} exercise={null} />
    </SafeAreaView>
  );
};

export default ExercisesScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  chips: {
    gap: Spacing.two,
    paddingVertical: Spacing.half,
  },
  list: {
    padding: Spacing.three,
    gap: Spacing.two,
    flexGrow: 1,
  },
});
