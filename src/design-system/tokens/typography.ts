export const typographyTokens = {
  fontFamily: {
    main: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  },
  fontSize: {
    // Strict 3 primary sizes per screen rule
    display: {
      size: '28px',
      lineHeight: '34px',
      fontWeight: '800',
      letterSpacing: '-0.025em',
    },
    heading: {
      size: '20px',
      lineHeight: '26px',
      fontWeight: '700',
      letterSpacing: '-0.015em',
    },
    body: {
      size: '15px',
      lineHeight: '22px',
      fontWeight: '500',
      letterSpacing: '0em',
    },
    caption: {
      size: '12px',
      lineHeight: '16px',
      fontWeight: '600',
      letterSpacing: '0.01em',
    },
  },
} as const;
