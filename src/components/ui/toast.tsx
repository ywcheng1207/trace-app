import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { dismissNotification, Notification, NotificationType } from '@/store/slices/ui-slice';

const AUTO_DISMISS_MS = 3500;
const MAX_VISIBLE = 3;

const ICON_BY_TYPE = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

type ToastItemProps = {
  notification: Notification;
  onDismiss: () => void;
};

const ToastItem = ({ notification, onDismiss }: ToastItemProps) => {
  const theme = useTheme();
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(40);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  // State / Ref
  const remainingRef = useRef(AUTO_DISMISS_MS);
  const startRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 變數
  const colorByType: Record<NotificationType, string> = {
    success: theme.success,
    error: theme.danger,
    warning: theme.warning,
    info: theme.info,
  };
  const Icon = ICON_BY_TYPE[notification.type];
  const tint = colorByType[notification.type];

  // Function
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    startRef.current = Date.now();
    timerRef.current = setTimeout(onDismiss, remainingRef.current);
  };

  const pauseTimer = () => {
    clearTimer();
    remainingRef.current -= Date.now() - startRef.current;
  };

  // Effects
  useEffect(() => {
    // Reanimated shared values 的 .value 賦值是預期用法，停用 React Compiler 的 immutability 誤報
    /* eslint-disable react-hooks/immutability */
    opacity.value = withTiming(1, { duration: 280 });
    translateX.value = withTiming(0, { duration: 280 });
    /* eslint-enable react-hooks/immutability */
    startTimer();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // JSX
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={pauseTimer}
        onPressOut={startTimer}
        style={[styles.toast, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <View style={[styles.accent, { backgroundColor: theme.brandOrange }]} />
        <Icon color={tint} size={22} />
        <View style={styles.body}>
          {notification.title ? (
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {notification.title}
            </Text>
          ) : null}
          <Text style={[styles.message, { color: theme.textSecondary }]} numberOfLines={3}>
            {notification.message}
          </Text>
        </View>
        <Pressable onPress={onDismiss} hitSlop={8}>
          <X color={theme.muted} size={18} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

export const Toast = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);

  if (notifications.length === 0) return null;

  const visible = notifications.slice(0, MAX_VISIBLE);

  return (
    <SafeAreaView style={styles.overlay} edges={['top']} pointerEvents="box-none">
      {visible.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onDismiss={() => dispatch(dismissNotification(notification.id))}
        />
      ))}
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
    gap: Spacing.two,
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
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  body: {
    flex: 1,
    gap: Spacing.half,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  message: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 19,
  },
});
