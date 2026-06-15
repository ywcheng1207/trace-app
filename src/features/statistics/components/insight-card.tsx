import { Lightbulb } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type InsightCardProps = {
  title: string;
  conclusion: string;
  evidence: string;
};

export const InsightCard = ({ title, conclusion, evidence }: InsightCardProps) => {
  const theme = useTheme();

  return (
    <Card>
      <View style={styles.header}>
        <Lightbulb color={theme.brandOrange} size={18} />
        <Text style={[styles.title, { color: theme.textSecondary }]}>{title}</Text>
      </View>
      <Text style={[styles.conclusion, { color: theme.text }]}>{conclusion}</Text>
      <Text style={[styles.evidence, { color: theme.textSecondary }]}>{evidence}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  title: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  conclusion: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  evidence: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
});
