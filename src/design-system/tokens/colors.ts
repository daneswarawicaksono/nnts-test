export const colorTokens = {
  // Brand Nutri-Teal Spectrum
  teal: {
    50: '#F0FDF9',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E', // Primary CTA background (4.9:1 contrast vs white)
    800: '#115E59',
    900: '#134E4A',
    950: '#042F2E',
  },

  // Warm Nutrient Orange Accent
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Streak flame & warm badges
    600: '#EA580C',
    700: '#C2410C',
  },

  // Status & Clinical Severity
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#0EA5E9',
  },

  // Semantic Surfaces
  surface: {
    canvas: '#F8FAFC',
    card: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.75)',
    glassSubtle: 'rgba(255, 255, 255, 0.60)',
    divider: '#E2E8F0',
  },

  // WCAG AA Compliant Text on Light/Glass Surfaces
  text: {
    primary: '#0F172A', // Slate 900 (16.1:1 on white)
    secondary: '#475569', // Slate 600 (5.8:1 on white)
    muted: '#64748B', // Slate 500 (4.6:1 on white)
    inverse: '#FFFFFF', // On teal-700 / dark
  },
} as const;
