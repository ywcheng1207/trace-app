import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TextAreaProps = TextInputProps & {
  label?: string;
  error?: string;
};

export const TextArea = ({ label, error, onFocus, onBlur, style, ...rest }: TextAreaProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error ? theme.danger : isFocused ? theme.primary : theme.border;

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text> : null}
      <TextInput
        multiline
        textAlignVertical="top"
        placeholderTextColor={theme.muted}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.backgroundElement, borderColor },
          style,
        ]}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? <Text style={[styles.error, { color: theme.danger }]}>{error}</Text> : null}
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
  input: {
    minHeight: 96,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: Fonts.sans,
  },
  error: {
    fontSize: 13,
    fontFamily: Fonts.sans,
  },
});
