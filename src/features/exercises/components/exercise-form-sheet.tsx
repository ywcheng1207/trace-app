import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Sheet } from '@/components/ui/sheet';
import { TextArea } from '@/components/ui/text-area';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useCreateExercise, useUpdateExercise } from '@/features/exercises/api/hooks';
import {
  EXERCISE_CATEGORIES,
  EXERCISE_FORCES,
  Exercise,
  ExerciseFormValues,
  exerciseFormSchema,
  KINETIC_CHAINS,
  MECHANICS,
} from '@/features/exercises/api/schemas';
import { MuscleSelector } from '@/features/exercises/components/muscle-selector';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

type ExerciseFormSheetProps = {
  visible: boolean;
  onClose: () => void;
  exercise: Exercise | null;
};

const EMPTY_VALUES: ExerciseFormValues = {
  name: '',
  note: '',
  muscleGroups: [],
  category: null,
  force: null,
  kineticChain: null,
  mechanic: null,
};

const toFormValues = (exercise: Exercise | null): ExerciseFormValues =>
  exercise
    ? {
        name: exercise.name,
        note: exercise.note ?? '',
        muscleGroups: exercise.muscleGroups,
        category: exercise.category,
        force: exercise.force,
        kineticChain: exercise.kineticChain,
        mechanic: exercise.mechanic,
      }
    : EMPTY_VALUES;

export const ExerciseFormSheet = ({ visible, onClose, exercise }: ExerciseFormSheetProps) => {
  const { t } = useTranslation(['exercises', 'notify']);
  const dispatch = useAppDispatch();
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (visible) reset(toFormValues(exercise));
  }, [visible, exercise, reset]);

  const categoryOptions = EXERCISE_CATEGORIES.map((value) => ({
    value,
    label: t(`category_${value.toLowerCase()}`),
  }));
  const forceOptions = EXERCISE_FORCES.map((value) => ({
    value,
    label: t(`force_${value.toLowerCase()}`),
  }));
  const kineticChainOptions = KINETIC_CHAINS.map((value) => ({
    value,
    label: t(`kinetic_chain_${value.toLowerCase()}`),
  }));
  const mechanicOptions = MECHANICS.map((value) => ({
    value,
    label: t(`mechanic_${value.toLowerCase()}`),
  }));

  const isSubmitting = createExercise.isPending || updateExercise.isPending;
  const nameError = errors.name ? t('input_name_error') : undefined;

  const onSubmit = handleSubmit((values) => {
    const handleSuccess = (notifyKey: string) => {
      dispatch(showNotification({ type: 'success', message: t(notifyKey) }));
      onClose();
    };
    const handleError = () =>
      dispatch(showNotification({ type: 'error', message: t('notify:error_occurred') }));

    if (exercise) {
      updateExercise.mutate(
        { id: exercise.id, values },
        { onSuccess: () => handleSuccess('notify:update_success'), onError: handleError },
      );
    } else {
      createExercise.mutate(values, {
        onSuccess: () => handleSuccess('notify:create_success'),
        onError: handleError,
      });
    }
  });

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={exercise ? t('edit_exercise') : t('create_exercise')}
    >
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('exercise_name')}
                placeholder={t('exercise_name_placeholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={nameError}
              />
            )}
          />
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextArea
                label={t('exercise_note')}
                placeholder={t('exercise_note_placeholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="muscleGroups"
            render={({ field: { onChange, value } }) => (
              <MuscleSelector value={value} onChange={onChange} />
            )}
          />
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <Select
                label={t('exercise_category')}
                placeholder={t('select_placeholder')}
                options={categoryOptions}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="force"
            render={({ field: { onChange, value } }) => (
              <Select
                label={t('exercise_force')}
                placeholder={t('select_placeholder')}
                options={forceOptions}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="mechanic"
            render={({ field: { onChange, value } }) => (
              <Select
                label={t('exercise_mechanic')}
                placeholder={t('select_placeholder')}
                options={mechanicOptions}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="kineticChain"
            render={({ field: { onChange, value } }) => (
              <Select
                label={t('exercise_kinetic_chain')}
                placeholder={t('select_placeholder')}
                options={kineticChainOptions}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Button
            label={exercise ? t('save_changes') : t('create_btn')}
            onPress={onSubmit}
            loading={isSubmitting}
            fullWidth
          />
        </View>
      </ScrollView>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
});
