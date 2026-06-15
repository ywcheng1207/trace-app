import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export const PageHeader = ({ title, subtitle, right }: PageHeaderProps) => {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  titles: {
    flex: 1,
    gap: Spacing.half,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
});
