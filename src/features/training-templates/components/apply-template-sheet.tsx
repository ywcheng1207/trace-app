import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Sheet } from '@/components/ui/sheet';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useExercises } from '@/features/exercises/api/hooks';
import { useDeleteTemplate, useTrainingTemplates } from '@/features/training-templates/api/hooks';
import { TrainingTemplate } from '@/features/training-templates/api/schemas';
import { useTheme } from '@/hooks/use-theme';

type ApplyTemplateSheetProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (template: TrainingTemplate) => void;
};

type TemplateRowProps = {
  template: TrainingTemplate;
  validIds: Set<string>;
  onApply: () => void;
  onDelete: () => void;
};

const TemplateRow = ({ template, validIds, onApply, onDelete }: TemplateRowProps) => {
  const { t } = useTranslation('schedule');
  const theme = useTheme();

  return (
    <View style={[styles.row, { borderColor: theme.border }]}>
      <Pressable style={styles.rowMain} onPress={onApply}>
        <Text style={[styles.name, { color: theme.text }]}>{template.name}</Text>
        <View style={styles.exerciseList}>
          {template.exercises.map((item, index) => {
            const isInvalid = !validIds.has(item.exerciseId);
            return (
              <Text
                key={`${item.exerciseId}_${index}`}
                style={[styles.exerciseName, { color: isInvalid ? theme.muted : theme.textSecondary }]}
              >
                {item.cachedName} × {item.setCount}
                {isInvalid ? ` · ${t('template_exercise_invalid')}` : ''}
              </Text>
            );
          })}
        </View>
      </Pressable>
      <Pressable onPress={onDelete} hitSlop={8} style={styles.delete}>
        <Trash2 color={theme.danger} size={18} />
      </Pressable>
    </View>
  );
};

export const ApplyTemplateSheet = ({ visible, onClose, onApply }: ApplyTemplateSheetProps) => {
  const { t } = useTranslation('schedule');
  const { data: templates = [] } = useTrainingTemplates();
  const { data: library = [] } = useExercises();
  const deleteTemplate = useDeleteTemplate();

  const [deletingTemplate, setDeletingTemplate] = useState<TrainingTemplate | null>(null);

  const validIds = new Set(library.map((exercise) => exercise.id));

  const handleConfirmDelete = () => {
    if (deletingTemplate) deleteTemplate.mutate(deletingTemplate.id);
    setDeletingTemplate(null);
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={t('apply_template')}>
      {templates.length === 0 ? (
        <View style={styles.empty}>
          <EmptyState title={t('templates_empty_title')} description={t('templates_empty_desc')} />
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {templates.map((template) => (
            <TemplateRow
              key={template.id}
              template={template}
              validIds={validIds}
              onApply={() => onApply(template)}
              onDelete={() => setDeletingTemplate(template)}
            />
          ))}
        </ScrollView>
      )}

      <ConfirmDialog
        visible={deletingTemplate !== null}
        title={t('delete_template_title')}
        message={t('delete_template_desc', { name: deletingTemplate?.name ?? '' })}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        destructive
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingTemplate(null)}
      />
    </Sheet>
  );
};

const styles = StyleSheet.create({
  list: {
    maxHeight: 420,
    marginBottom: Spacing.three,
  },
  empty: {
    height: 260,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  rowMain: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseList: {
    gap: Spacing.half,
  },
  exerciseName: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  delete: {
    padding: Spacing.one,
  },
});
