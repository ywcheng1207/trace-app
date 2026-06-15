import { Pressable, StyleSheet, View } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const Switch = ({ value, onValueChange }: SwitchProps) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[
        styles.track,
        { backgroundColor: value ? theme.primary : theme.backgroundSelected },
      ]}
    >
      <View
        style={[
          styles.thumb,
          { backgroundColor: theme.background, alignSelf: value ? 'flex-end' : 'flex-start' },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: Radius.full,
    padding: 2,
    justifyContent: 'center',
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
  },
});
