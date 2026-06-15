import * as ImagePicker from 'expo-image-picker';
import { Check, Lightbulb, Loader } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import {
  useAiUsage,
  useAnalysisTask,
  useExerciseAdvice,
  useStartAnalysis,
} from '@/features/ai-coach/api/hooks';
import { AI_QUOTA_EXCEEDED, ANALYSIS_IN_PROGRESS } from '@/features/ai-coach/api/mock';
import { AiAdvice, VIDEO_MAX_DURATION_SEC } from '@/features/ai-coach/api/schemas';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch } from '@/store/hooks';
import { showNotification } from '@/store/slices/ui-slice';

type AiCoachSheetProps = {
  visible: boolean;
  onClose: () => void;
  exerciseId: string;
};

export const AiCoachSheet = ({ visible, onClose, exerciseId }: AiCoachSheetProps) => {
  const { t } = useTranslation(['ai-coach', 'notify']);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { data: usage } = useAiUsage();
  const adviceMutation = useExerciseAdvice();
  const startAnalysis = useStartAnalysis();

  const [advice, setAdvice] = useState<AiAdvice | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [precheckError, setPrecheckError] = useState<string | null>(null);
  const notifiedRef = useRef(false);

  const { data: task } = useAnalysisTask(taskId);

  const dailyLimit = usage?.dailyLimit ?? 0;
  const dailyUsed = usage?.dailyUsed ?? 0;
  const remaining = Math.max(0, dailyLimit - dailyUsed);
  const isQuotaExceeded = usage !== undefined && remaining <= 0;
  const isAnalyzing = task?.status === 'PENDING' || task?.status === 'PROCESSING';

  useEffect(() => {
    if (task?.status === 'DONE' && !notifiedRef.current) {
      notifiedRef.current = true;
      dispatch(
        showNotification({
          type: 'success',
          title: t('analysis_done_title'),
          message: t('analysis_done_message'),
          actionPath: '/exercises',
        }),
      );
    }
  }, [task?.status, dispatch, t]);

  const handleGetAdvice = () => {
    if (isQuotaExceeded) return;
    adviceMutation.mutate(exerciseId, {
      onSuccess: (result) => setAdvice(result),
      onError: () => dispatch(showNotification({ type: 'error', message: t('quota_reached') })),
    });
  };

  const handleAnalyzeVideo = async () => {
    if (isQuotaExceeded) return;
    setPrecheckError(null);
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 1 });
    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const durationSec = asset.duration ? asset.duration / 1000 : 0;
    if (durationSec > VIDEO_MAX_DURATION_SEC) {
      setPrecheckError(t('video_too_long', { max: VIDEO_MAX_DURATION_SEC }));
      return;
    }

    // TODO: 上傳影片（/api/upload/authorize + apiFetch）後送 Gemini 分析，目前 stub
    notifiedRef.current = false;
    startAnalysis.mutate(exerciseId, {
      onSuccess: (createdTask) => setTaskId(createdTask.id),
      onError: (error) => {
        if (error instanceof Error && error.message === ANALYSIS_IN_PROGRESS) {
          dispatch(showNotification({ type: 'info', message: t('analysis_in_progress') }));
          return;
        }
        if (error instanceof Error && error.message === AI_QUOTA_EXCEEDED) {
          dispatch(showNotification({ type: 'error', message: t('quota_reached') }));
          return;
        }
        dispatch(showNotification({ type: 'error', message: t('notify:error_occurred') }));
      },
    });
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={t('ai_coach')}>
      <View style={styles.body}>
        <View style={[styles.quota, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.quotaText, { color: theme.textSecondary }]}>
            {t('daily_quota', { remaining, limit: dailyLimit })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('advice_title')}</Text>
          <Button
            label={t('get_advice')}
            onPress={handleGetAdvice}
            loading={adviceMutation.isPending}
            disabled={isQuotaExceeded}
            fullWidth
          />
          {advice ? (
            <View style={[styles.resultCard, { backgroundColor: theme.backgroundElement }]}>
              {advice.points.map((point) => (
                <View key={point} style={styles.pointRow}>
                  <Lightbulb color={theme.brandOrange} size={16} />
                  <Text style={[styles.pointText, { color: theme.text }]}>{point}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('analysis_title')}</Text>
          <Text style={[styles.hint, { color: theme.textSecondary }]}>
            {t('analysis_hint', { max: VIDEO_MAX_DURATION_SEC })}
          </Text>
          <Button
            label={t('analyze_video')}
            variant="secondary"
            onPress={handleAnalyzeVideo}
            loading={startAnalysis.isPending}
            disabled={isQuotaExceeded || isAnalyzing}
            fullWidth
          />
          {precheckError ? (
            <Text style={[styles.error, { color: theme.danger }]}>{precheckError}</Text>
          ) : null}

          {task && isAnalyzing ? (
            <View style={[styles.statusRow, { backgroundColor: theme.backgroundElement }]}>
              <Loader color={theme.brandOrange} size={18} />
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                {t(`status_${task.status.toLowerCase()}`)}
              </Text>
            </View>
          ) : null}

          {task?.status === 'DONE' && task.result ? (
            <View style={[styles.resultCard, { backgroundColor: theme.backgroundElement }]}>
              <Text style={[styles.resultHeading, { color: theme.text }]}>{t('result_breakdown')}</Text>
              {task.result.breakdown.map((item) => (
                <Text key={item} style={[styles.pointText, { color: theme.textSecondary }]}>
                  • {item}
                </Text>
              ))}
              <Text style={[styles.resultHeading, { color: theme.text }]}>{t('result_suggestions')}</Text>
              {task.result.suggestions.map((item) => (
                <View key={item} style={styles.pointRow}>
                  <Check color={theme.success} size={16} />
                  <Text style={[styles.pointText, { color: theme.text }]}>{item}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {isQuotaExceeded ? (
          <Text style={[styles.quotaHint, { color: theme.muted }]}>{t('quota_reached')}</Text>
        ) : null}
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: Spacing.four,
    paddingBottom: Spacing.four,
  },
  quota: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
  },
  quotaText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  resultCard: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    gap: Spacing.two,
  },
  resultHeading: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    marginTop: Spacing.one,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  pointText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
  },
  statusText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  error: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  quotaHint: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    textAlign: 'center',
  },
});
