import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BrandLabelProps = {
  size?: number;
};

const LOGO_RATIO = 0.42;

export const BrandLabel = ({ size = 28 }: BrandLabelProps) => {
  const theme = useTheme();
  const logoWidth = size * 3.6;

  return (
    <View style={styles.container}>
      <Text style={[styles.wordmark, { color: theme.brandYellow, fontSize: size }]}>TRACE</Text>
      <Image
        source={require('@/assets/images/mascot/logo-small-human.png')}
        style={{ width: logoWidth, height: logoWidth * LOGO_RATIO }}
        contentFit="contain"
        accessibilityLabel="Record Your Journey"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 2,
  },
  wordmark: {
    fontFamily: Fonts.rounded,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});
