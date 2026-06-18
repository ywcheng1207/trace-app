import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AuthTab = 'login' | 'register';

type AuthTabsProps = {
  value: AuthTab;
  onChange: (value: AuthTab) => void;
  loginLabel: string;
  registerLabel: string;
};

const TABS: AuthTab[] = ['login', 'register'];

export const AuthTabs = ({ value, onChange, loginLabel, registerLabel }: AuthTabsProps) => {
  const theme = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);

  const activeIndex = value === 'login' ? 0 : 1;
  const segmentWidth = trackWidth > 0 ? trackWidth / TABS.length : 0;

  const indicatorStyle = useAnimatedStyle(() => ({
    width: segmentWidth,
    transform: [{ translateX: withTiming(activeIndex * segmentWidth, { duration: 220 }) }],
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  const labels: Record<AuthTab, string> = { login: loginLabel, register: registerLabel };

  return (
    <View
      style={[styles.track, { backgroundColor: theme.backgroundElement }]}
      onLayout={handleLayout}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          style={[styles.indicator, { backgroundColor: theme.card }, indicatorStyle]}
        />
      ) : null}
      {TABS.map((tab) => {
        const isActive = tab === value;
        return (
          <Pressable key={tab} style={styles.segment} onPress={() => onChange(tab)}>
            <Text style={[styles.label, { color: isActive ? theme.text : theme.textSecondary }]}>
              {labels[tab]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: Spacing.half,
    borderRadius: Radius.lg,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: Spacing.half,
    bottom: Spacing.half,
    left: Spacing.half,
    borderRadius: Radius.md,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
  },
});
