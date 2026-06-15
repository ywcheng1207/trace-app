import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export const Checkbox = ({ checked, onChange, label }: CheckboxProps) => {
  const theme = useTheme();

  return (
    <Pressable onPress={() => onChange(!checked)} style={styles.row} hitSlop={6}>
      <Pressable
        onPress={() => onChange(!checked)}
        style={[
          styles.box,
          {
            borderColor: checked ? theme.primary : theme.border,
            backgroundColor: checked ? theme.primary : 'transparent',
          },
        ]}
      >
        {checked ? <Check color={theme.primaryForeground} size={14} /> : null}
      </Pressable>
      {label ? <Text style={[styles.label, { color: theme.text }]}>{label}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
});
