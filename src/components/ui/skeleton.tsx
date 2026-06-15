import { StyleSheet, View, type DimensionValue } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
};

export const Skeleton = ({ width = '100%', height = 16, radius = Radius.sm }: SkeletonProps) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.base, { width, height, borderRadius: radius, backgroundColor: theme.backgroundElement }]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    opacity: 0.7,
  },
});
