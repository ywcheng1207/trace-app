import { RichText, useEditorBridge } from '@10play/tentap-editor';
import { StyleSheet, Text } from 'react-native';

import { Fonts } from '@/constants/theme';
import { buildNoteBridges } from '@/features/notes/lib/editor-theme';
import { isNoteEmpty, toDoc } from '@/features/notes/lib/tiptap';
import { useTheme } from '@/hooks/use-theme';

type RichTextViewerProps = {
  value: string | null;
  placeholder: string;
};

export const RichTextViewer = ({ value, placeholder }: RichTextViewerProps) => {
  const theme = useTheme();
  const empty = isNoteEmpty(value);

  const editor = useEditorBridge({
    bridgeExtensions: buildNoteBridges({ theme }),
    initialContent: toDoc(value),
    editable: false,
    dynamicHeight: true,
  });

  if (empty) {
    return <Text style={[styles.placeholder, { color: theme.muted }]}>{placeholder}</Text>;
  }

  return <RichText editor={editor} scrollEnabled={false} style={styles.viewer} />;
};

const styles = StyleSheet.create({
  placeholder: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  viewer: {
    backgroundColor: 'transparent',
  },
});
