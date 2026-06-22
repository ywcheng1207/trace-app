/**
 * Pure helpers for the TipTap JSON note format shared with the web `trace` backend.
 * The backend stores notes as `JSON.stringify(editor.getJSON())`; these helpers
 * tolerate legacy plain-text values and compute plain-text length the same way web does.
 */

type TipTapNode = {
  type?: string;
  text?: string;
  content?: TipTapNode[];
};

export type TipTapDoc = {
  type: 'doc';
  content: TipTapNode[];
};

const EMPTY_DOC: TipTapDoc = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isTipTapDoc = (value: unknown): value is TipTapDoc =>
  isRecord(value) && value['type'] === 'doc' && Array.isArray(value['content']);

const wrapPlainText = (text: string): TipTapDoc => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

/**
 * Normalize any stored note value into a TipTap doc object suitable for the editor:
 * empty/null → empty doc; valid TipTap JSON → parsed doc; legacy plain text → single paragraph.
 */
export const toDoc = (value: string | null | undefined): TipTapDoc => {
  if (!value) return EMPTY_DOC;
  const trimmed = value.trim();
  if (!trimmed) return EMPTY_DOC;

  if (trimmed.startsWith('{')) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (isTipTapDoc(parsed)) return parsed;
    } catch {
      // fall through to plain-text handling
    }
  }
  return wrapPlainText(value);
};

export const serialize = (json: unknown): string => JSON.stringify(json);

const collectText = (node: TipTapNode): string => {
  const own = typeof node.text === 'string' ? node.text : '';
  if (!node.content || node.content.length === 0) return own;
  return own + node.content.map(collectText).join('');
};

/** Plain-text content of a note value (aligned with web `extractPlainText`). */
export const extractPlainText = (value: string | null | undefined): string => {
  if (!value) return '';
  const trimmed = value.trim();
  if (trimmed.startsWith('{')) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (isTipTapDoc(parsed)) return parsed.content.map(collectText).join('');
    } catch {
      return value;
    }
  }
  return value;
};

export const getNoteLength = (value: string | null | undefined): number =>
  extractPlainText(value).length;

export const isNoteEmpty = (value: string | null | undefined): boolean =>
  getNoteLength(value) === 0;
