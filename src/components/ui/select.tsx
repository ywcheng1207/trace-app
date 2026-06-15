import { Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Sheet } from '@/components/ui/sheet';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SelectOption<T extends string> = {
  label: string;
  value: T;
};

type SelectProps<T extends string> = {
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  value?: T | null;
  label?: string;
  placeholder?: string;
  error?: string;
};

export const Select = <T extends string>({
  options,
  onChange,
  value,
  label,
  placeholder,
  error,
}: SelectProps<T>) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);
  const borderColor = error ? theme.danger : theme.border;

  const handleSelect = (next: T) => {
    onChange(next);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text> : null}
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[styles.field, { backgroundColor: theme.backgroundElement, borderColor }]}
      >
        <Text
          style={[styles.value, { color: selectedOption ? theme.text : theme.muted }]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : (placeholder ?? '')}
        </Text>
        <ChevronDown color={theme.muted} size={18} />
      </Pressable>
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}

      <Sheet visible={isOpen} onClose={() => setIsOpen(false)} title={label}>
        <ScrollView style={styles.list}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => handleSelect(option.value)}
              style={[styles.row, { borderBottomColor: theme.border }]}
            >
              <Text style={[styles.rowLabel, { color: theme.text }]}>{option.label}</Text>
              {option.value === value ? <Check color={theme.primary} size={18} /> : null}
            </Pressable>
          ))}
        </ScrollView>
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '500',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  value: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
  },
  error: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  list: {
    maxHeight: 360,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontFamily: Fonts.sans,
    fontSize: 16,
  },
});
