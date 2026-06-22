import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const SectionHeader = ({ title, description, action }: SectionHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <View style={styles.titleColumn}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
        ) : null}
      </View>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  titleColumn: {
    flex: 1,
    gap: Spacing.half,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  action: {
    flexShrink: 0,
  },
});
