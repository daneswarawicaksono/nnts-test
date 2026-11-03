import { colorTokens } from './colors';
import { typographyTokens } from './typography';
import { spacingTokens } from './spacing';
import { radiiTokens } from './radii';
import { shadowTokens } from './shadows';
import { motionTokens } from './motion';

export {
  colorTokens,
  typographyTokens,
  spacingTokens,
  radiiTokens,
  shadowTokens,
  motionTokens,
};

export const designTokens = {
  colors: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radii: radiiTokens,
  shadows: shadowTokens,
  motion: motionTokens,
} as const;

export type DesignTokens = typeof designTokens;
