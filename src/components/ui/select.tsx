import { Check, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
    <View style={[styles.container, isOpen && styles.elevated]}>
      {label ? <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text> : null}
      <Pressable
        onPress={() => setIsOpen((prev) => !prev)}
        style={[styles.field, { backgroundColor: theme.backgroundElement, borderColor }]}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        <Text
          style={[styles.value, { color: selectedOption ? theme.text : theme.muted }]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : (placeholder ?? '')}
        </Text>
        <ChevronDown
          color={theme.muted}
          size={18}
          style={isOpen ? styles.chevronOpen : undefined}
        />
      </Pressable>
      {isOpen ? (
        <ScrollView
          style={[
            styles.dropdown,
            { backgroundColor: theme.background, borderColor: theme.border },
          ]}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
        >
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => handleSelect(option.value)}
              style={({ pressed }) => [
                styles.row,
                { borderBottomColor: theme.border },
                pressed && { backgroundColor: theme.backgroundElement },
              ]}
            >
              <Text style={[styles.rowLabel, { color: theme.text }]}>{option.label}</Text>
              {option.value === value ? <Check color={theme.primary} size={18} /> : null}
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
    zIndex: 0,
  },
  elevated: {
    zIndex: 100,
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
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: Radius.md,
    maxHeight: 216,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    fontFamily: Fonts.sans,
    fontSize: 16,
  },
  error: {
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
});
