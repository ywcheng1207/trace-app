import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = ViewProps & {
  padded?: boolean;
};

export const Card = ({ padded = true, style, ...rest }: CardProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        padded && styles.padded,
        style,
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  padded: {
    padding: Spacing.three,
  },
});
