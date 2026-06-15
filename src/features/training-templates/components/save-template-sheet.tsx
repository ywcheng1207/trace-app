import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { PlanExercise } from '@/features/schedule/api/schemas';
import { toTemplateExercises } from '@/features/schedule/plan-utils';
import { useCreateTemplate } from '@/features/training-templates/api/hooks';
import { TEMPLATE_NAME_TAKEN } from '@/features/training-templates/api/mock';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

type SaveTemplateSheetProps = {
  visible: boolean;
  onClose: () => void;
  exercises: PlanExercise[];
};

export const SaveTemplateSheet = ({ visible, onClose, exercises }: SaveTemplateSheetProps) => {
  const { t } = useTranslation(['schedule', 'notify']);
  const dispatch = useAppDispatch();
  const createTemplate = useCreateTemplate();

  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (trimmed === '') {
      setError(t('template_name_required'));
      return;
    }
    createTemplate.mutate(
      { name: trimmed, exercises: toTemplateExercises(exercises) },
      {
        onSuccess: () => {
          dispatch(showNotification({ type: 'success', message: t('template_saved') }));
          handleClose();
        },
        onError: (mutationError) => {
          if (mutationError instanceof Error && mutationError.message === TEMPLATE_NAME_TAKEN) {
            setError(t('template_name_taken'));
            return;
          }
          dispatch(showNotification({ type: 'error', message: t('notify:error_occurred') }));
        },
      },
    );
  };

  return (
    <Sheet visible={visible} onClose={handleClose} title={t('save_as_template')}>
      <View style={styles.form}>
        <TextField
          label={t('template_name')}
          placeholder={t('template_name_placeholder')}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError(null);
          }}
          error={error ?? undefined}
        />
        <Button
          label={t('save_template')}
          onPress={handleSave}
          loading={createTemplate.isPending}
          fullWidth
        />
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
});
