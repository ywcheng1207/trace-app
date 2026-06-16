import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Polygon } from 'react-native-svg';

import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import { MuscleRegion } from '@/features/exercises/api/schemas';
import {
  ANTERIOR_POLYGONS,
  DECORATIVE_KEYS,
  POSTERIOR_POLYGONS,
  SVG_VIEW_BOX,
  type BodyView,
} from '@/lib/constants/body-map';
import { useTheme } from '@/hooks/use-theme';

export type RegionState = 'empty' | 'partial' | 'full';

// Maps each silhouette polygon to one of the app's coarse muscle regions
// (the keys of MUSCLE_GROUPS). Tapping any polygon opens that region's drill sheet.
const ANTERIOR_KEY_TO_REGION: Record<string, MuscleRegion> = {
  chest: 'chest',
  obliques: 'core',
  abs: 'core',
  biceps: 'arms',
  triceps: 'arms',
  forearm: 'arms',
  'front-deltoids': 'shoulders',
  abductors: 'legs',
  quadriceps: 'legs',
  calves: 'legs',
};

const POSTERIOR_KEY_TO_REGION: Record<string, MuscleRegion> = {
  trapezius: 'back',
  'back-deltoids': 'shoulders',
  'upper-back': 'back',
  triceps: 'arms',
  'lower-back': 'back',
  forearm: 'arms',
  gluteal: 'legs',
  adductor: 'legs',
  hamstring: 'legs',
  calves: 'legs',
  'left-soleus': 'legs',
  'right-soleus': 'legs',
};

const resolveRegion = (view: BodyView, key: string): MuscleRegion | null => {
  const map = view === 'anterior' ? ANTERIOR_KEY_TO_REGION : POSTERIOR_KEY_TO_REGION;
  return map[key] ?? null;
};

const VIEW_BOX = `${SVG_VIEW_BOX.minX} ${SVG_VIEW_BOX.minY} ${SVG_VIEW_BOX.width} ${SVG_VIEW_BOX.height}`;

type MusclePolygonAnatomyProps = {
  getRegionState: (region: MuscleRegion) => RegionState;
  onSelectRegion: (region: MuscleRegion) => void;
};

export const MusclePolygonAnatomy = ({
  getRegionState,
  onSelectRegion,
}: MusclePolygonAnatomyProps) => {
  const { t } = useTranslation('muscle');
  const theme = useTheme();
  const [view, setView] = useState<BodyView>('anterior');

  const polygons = view === 'anterior' ? ANTERIOR_POLYGONS : POSTERIOR_POLYGONS;

  const fillForState = (state: RegionState): string => {
    if (state === 'full') return theme.primary;
    if (state === 'partial') return `${theme.primary}99`;
    return `${theme.muted}3d`;
  };

  const viewOptions = [
    { value: 'anterior' as const, label: t('view_front') },
    { value: 'posterior' as const, label: t('view_back') },
  ];

  return (
    <View style={styles.container}>
      <SegmentedControl options={viewOptions} value={view} onChange={setView} />
      <Svg viewBox={VIEW_BOX} width="100%" height={320} preserveAspectRatio="xMidYMid meet">
        {polygons.map((shape) => {
          if (DECORATIVE_KEYS.includes(shape.key)) {
            return (
              <G key={shape.key}>
                {shape.points.map((point) => (
                  <Polygon
                    key={point}
                    points={point}
                    fill={`${theme.muted}26`}
                    stroke={theme.background}
                    strokeWidth={0.5}
                  />
                ))}
              </G>
            );
          }

          const region = resolveRegion(view, shape.key);
          if (!region) return null;

          const fill = fillForState(getRegionState(region));
          return (
            <G key={shape.key} onPress={() => onSelectRegion(region)}>
              {shape.points.map((point) => (
                <Polygon
                  key={point}
                  points={point}
                  fill={fill}
                  stroke={theme.background}
                  strokeWidth={0.5}
                />
              ))}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
});
