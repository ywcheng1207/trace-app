import {
  DEFAULT_TOOLBAR_ITEMS,
  RichText,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Fonts, Spacing } from '@/constants/theme';
import { buildNoteBridges } from '@/features/notes/lib/editor-theme';
import { getNoteLength, serialize, toDoc } from '@/features/notes/lib/tiptap';
import { useTheme } from '@/hooks/use-theme';

type RichTextEditorProps = {
  value: string;
  onChange: (json: string) => void;
  maxLength: number;
  placeholder?: string;
};

export const RichTextEditor = ({ value, onChange, maxLength, placeholder }: RichTextEditorProps) => {
  const theme = useTheme();

  const editor = useEditorBridge({
    bridgeExtensions: buildNoteBridges({ theme, placeholder }),
    initialContent: toDoc(value),
    avoidIosKeyboard: true,
    autofocus: false,
  });

  const json = useEditorContent(editor, { type: 'json', debounceInterval: 250 });

  const onChangeRef = useRef(onChange);

  const serialized = json === undefined ? value : serialize(json);
  const length = getNoteLength(serialized);
  const isOverLimit = length > maxLength;

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (json === undefined) return;
    onChangeRef.current(serialize(json));
  }, [json]);

  return (
    <View style={styles.root}>
      <View style={[styles.counterRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.counter, { color: isOverLimit ? theme.danger : theme.muted }]}>
          {length} / {maxLength}
        </Text>
      </View>
      <View style={styles.body}>
        <RichText editor={editor} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.toolbar}
      >
        <Toolbar editor={editor} items={DEFAULT_TOOLBAR_ITEMS} shouldHideDisabledToolbarItems />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  counterRow: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
  },
  counter: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  toolbar: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});
