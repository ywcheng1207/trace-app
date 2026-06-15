import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { dismissNotification } from '@/store/slices/ui-slice';

const AUTO_DISMISS_MS = 3500;

export const Toast = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.ui.notification);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => dispatch(dismissNotification()), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notification, dispatch]);

  if (!notification) return null;

  const colorByType = {
    success: theme.success,
    error: theme.danger,
    info: theme.info,
  };
  const accent = colorByType[notification.type];

  return (
    <SafeAreaView style={styles.overlay} edges={['top']} pointerEvents="box-none">
      <Pressable
        onPress={() => dispatch(dismissNotification())}
        style={[styles.toast, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <View style={[styles.accent, { backgroundColor: accent }]} />
        <Text style={[styles.message, { color: theme.text }]} numberOfLines={3}>
          {notification.message}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    width: '100%',
    maxWidth: 480,
    marginTop: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.sheet,
    borderWidth: 1,
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: Radius.full,
  },
  message: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});
