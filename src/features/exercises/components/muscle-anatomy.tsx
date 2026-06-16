import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';

import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AnatomyView = 'front' | 'back';

type ZoneShape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number; rx: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number };

type Zone = {
  key: string;
  muscles: string[];
  shapes: ZoneShape[];
};

const FRONT_ZONES: Zone[] = [
  {
    key: 'shoulders_front',
    muscles: ['front_delt', 'side_delt'],
    shapes: [
      { kind: 'ellipse', cx: 64, cy: 64, rx: 17, ry: 12 },
      { kind: 'ellipse', cx: 136, cy: 64, rx: 17, ry: 12 },
    ],
  },
  { key: 'chest', muscles: ['chest_upper', 'chest_mid', 'chest_lower'], shapes: [{ kind: 'rect', x: 72, y: 56, w: 56, h: 34, rx: 8 }] },
  {
    key: 'biceps',
    muscles: ['biceps'],
    shapes: [
      { kind: 'rect', x: 44, y: 72, w: 16, h: 40, rx: 7 },
      { kind: 'rect', x: 140, y: 72, w: 16, h: 40, rx: 7 },
    ],
  },
  {
    key: 'forearms',
    muscles: ['forearms'],
    shapes: [
      { kind: 'rect', x: 40, y: 116, w: 14, h: 42, rx: 7 },
      { kind: 'rect', x: 146, y: 116, w: 14, h: 42, rx: 7 },
    ],
  },
  { key: 'abs', muscles: ['abs', 'obliques'], shapes: [{ kind: 'rect', x: 80, y: 94, w: 40, h: 44, rx: 7 }] },
  {
    key: 'quads',
    muscles: ['quads', 'adductors'],
    shapes: [
      { kind: 'rect', x: 76, y: 148, w: 20, h: 66, rx: 8 },
      { kind: 'rect', x: 104, y: 148, w: 20, h: 66, rx: 8 },
    ],
  },
  {
    key: 'calves_front',
    muscles: ['calves'],
    shapes: [
      { kind: 'rect', x: 78, y: 220, w: 16, h: 56, rx: 7 },
      { kind: 'rect', x: 106, y: 220, w: 16, h: 56, rx: 7 },
    ],
  },
];

const BACK_ZONES: Zone[] = [
  {
    key: 'shoulders_rear',
    muscles: ['rear_delt'],
    shapes: [
      { kind: 'ellipse', cx: 64, cy: 64, rx: 17, ry: 12 },
      { kind: 'ellipse', cx: 136, cy: 64, rx: 17, ry: 12 },
    ],
  },
  { key: 'traps', muscles: ['traps'], shapes: [{ kind: 'rect', x: 82, y: 52, w: 36, h: 18, rx: 6 }] },
  { key: 'upper_back', muscles: ['lats', 'rhomboids'], shapes: [{ kind: 'rect', x: 74, y: 72, w: 52, h: 34, rx: 8 }] },
  { key: 'lower_back', muscles: ['lower_back'], shapes: [{ kind: 'rect', x: 82, y: 108, w: 36, h: 26, rx: 7 }] },
  {
    key: 'triceps',
    muscles: ['triceps'],
    shapes: [
      { kind: 'rect', x: 44, y: 72, w: 16, h: 40, rx: 7 },
      { kind: 'rect', x: 140, y: 72, w: 16, h: 40, rx: 7 },
    ],
  },
  { key: 'glutes', muscles: ['glutes'], shapes: [{ kind: 'rect', x: 78, y: 136, w: 44, h: 24, rx: 9 }] },
  {
    key: 'hamstrings',
    muscles: ['hamstrings'],
    shapes: [
      { kind: 'rect', x: 76, y: 162, w: 20, h: 56, rx: 8 },
      { kind: 'rect', x: 104, y: 162, w: 20, h: 56, rx: 8 },
    ],
  },
  {
    key: 'calves_back',
    muscles: ['calves'],
    shapes: [
      { kind: 'rect', x: 78, y: 224, w: 16, h: 52, rx: 7 },
      { kind: 'rect', x: 106, y: 224, w: 16, h: 52, rx: 7 },
    ],
  },
];

type MuscleAnatomyProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

export const MuscleAnatomy = ({ value, onChange }: MuscleAnatomyProps) => {
  const { t } = useTranslation('muscle');
  const theme = useTheme();
  const [view, setView] = useState<AnatomyView>('front');

  const zones = view === 'front' ? FRONT_ZONES : BACK_ZONES;

  const isZoneActive = (muscles: string[]) => muscles.some((muscle) => value.includes(muscle));

  const toggleZone = (muscles: string[]) => {
    const next = isZoneActive(muscles)
      ? value.filter((muscle) => !muscles.includes(muscle))
      : Array.from(new Set([...value, ...muscles]));
    onChange(next);
  };

  const viewOptions = [
    { value: 'front' as const, label: t('view_front') },
    { value: 'back' as const, label: t('view_back') },
  ];

  return (
    <View style={styles.container}>
      <SegmentedControl options={viewOptions} value={view} onChange={setView} />
      <View style={styles.canvas}>
        <Svg width={200} height={300} viewBox="0 0 200 300">
          <Circle cx={100} cy={26} r={18} fill={theme.backgroundElement} stroke={theme.border} strokeWidth={1} />
          {zones.map((zone) => {
            const active = isZoneActive(zone.muscles);
            const fill = active ? theme.brandOrange : theme.backgroundElement;
            return zone.shapes.map((shape, index) =>
              shape.kind === 'rect' ? (
                <Rect
                  key={`${zone.key}_${index}`}
                  x={shape.x}
                  y={shape.y}
                  width={shape.w}
                  height={shape.h}
                  rx={shape.rx}
                  fill={fill}
                  stroke={theme.border}
                  strokeWidth={1}
                  onPress={() => toggleZone(zone.muscles)}
                />
              ) : (
                <Ellipse
                  key={`${zone.key}_${index}`}
                  cx={shape.cx}
                  cy={shape.cy}
                  rx={shape.rx}
                  ry={shape.ry}
                  fill={fill}
                  stroke={theme.border}
                  strokeWidth={1}
                  onPress={() => toggleZone(zone.muscles)}
                />
              ),
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  canvas: {
    alignItems: 'center',
  },
});
