import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ColorScheme } from './colors';
import { fontSize, fontWeight, lineHeight } from './typography';
import { spacing, borderRadius } from './spacing';

export { darkColors, lightColors };
export type { ColorScheme };

export const useTheme = () => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors: ColorScheme = isDark ? darkColors : lightColors;

  return {
    colors,
    isDark,
    fontSize,
    fontWeight,
    lineHeight,
    spacing,
    borderRadius,
  };
};
