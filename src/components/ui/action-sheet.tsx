import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Sheet } from '@/components/ui/sheet';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ActionSheetItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  destructive?: boolean;
  onPress: () => void;
};

type ActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: ActionSheetItem[];
};

export const ActionSheet = ({ visible, onClose, title, actions }: ActionSheetProps) => {
  const theme = useTheme();

  const handlePress = (action: ActionSheetItem) => {
    onClose();
    action.onPress();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.list}>
        {actions.map((action) => {
          const tint = action.destructive ? theme.danger : theme.text;
          return (
            <Pressable
              key={action.key}
              onPress={() => handlePress(action)}
              style={({ pressed }) => [
                styles.row,
                { borderColor: theme.border },
                pressed && { backgroundColor: theme.backgroundElement },
              ]}
            >
              {action.icon ? <View style={styles.icon}>{action.icon}</View> : null}
              <Text style={[styles.label, { color: tint }]}>{action.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  icon: {
    width: 24,
    alignItems: 'center',
  },
  label: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
});
