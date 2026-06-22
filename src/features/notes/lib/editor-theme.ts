import {
  BlockquoteBridge,
  BoldBridge,
  BulletListBridge,
  CoreBridge,
  HardBreakBridge,
  HeadingBridge,
  HistoryBridge,
  ItalicBridge,
  LinkBridge,
  ListItemBridge,
  OrderedListBridge,
  PlaceholderBridge,
} from '@10play/tentap-editor';

import { type ThemeColor } from '@/constants/theme';

type ThemePalette = Record<ThemeColor, string>;

/**
 * Reading typography injected into the TenTap WebView. Mirrors the web note look:
 * comfortable line-height, paragraph spacing, heading scale, list indent, link color.
 * Colours come from theme tokens so light/dark both meet contrast.
 */
export const buildContentCss = (theme: ThemePalette): string => `
  .ProseMirror {
    font-family: -apple-system, system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: ${theme.text};
    background-color: ${theme.background};
    padding: 16px;
    caret-color: ${theme.accent};
    -webkit-text-size-adjust: 100%;
  }
  .ProseMirror p { margin: 0 0 1em 0; }
  .ProseMirror h1 { font-size: 24px; line-height: 1.3; font-weight: 700; margin: 1.2em 0 0.4em; }
  .ProseMirror h2 { font-size: 20px; line-height: 1.3; font-weight: 700; margin: 1.1em 0 0.4em; }
  .ProseMirror h3 { font-size: 17px; line-height: 1.35; font-weight: 600; margin: 1em 0 0.3em; }
  .ProseMirror ul, .ProseMirror ol { padding-left: 1.25em; margin: 0 0 1em 0; }
  .ProseMirror li { margin: 0.2em 0; }
  .ProseMirror li > p { margin: 0; }
  .ProseMirror blockquote {
    border-left: 3px solid ${theme.border};
    padding-left: 1em;
    color: ${theme.textSecondary};
    margin: 0 0 1em 0;
  }
  .ProseMirror a { color: ${theme.accent}; text-decoration: underline; }
  .ProseMirror :last-child { margin-bottom: 0; }
  .ProseMirror p.is-editor-empty:first-child::before {
    color: ${theme.muted};
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
`;

type BuildBridgesArgs = {
  theme: ThemePalette;
  placeholder?: string;
};

/**
 * Web-compatible bridge subset only (no underline/strike/code/tasklist/color/highlight/image),
 * so produced TipTap JSON round-trips with web. Toolbar items for absent bridges auto-hide via
 * `shouldHideDisabledToolbarItems`. Heading restricted to 1–3 to match the web StarterKit config.
 */
export const buildNoteBridges = ({ theme, placeholder }: BuildBridgesArgs) => [
  CoreBridge.configureCSS(buildContentCss(theme)),
  HistoryBridge,
  BoldBridge,
  ItalicBridge,
  HeadingBridge.configureExtension({ levels: [1, 2, 3] }),
  BulletListBridge,
  OrderedListBridge,
  ListItemBridge,
  BlockquoteBridge,
  LinkBridge.configureExtension({ openOnClick: false }),
  HardBreakBridge,
  PlaceholderBridge.configureExtension({ placeholder: placeholder ?? '' }),
];
