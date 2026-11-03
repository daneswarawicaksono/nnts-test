export const motionTokens = {
  // Strict rule: all animations < 400ms
  duration: {
    instant: '0ms',
    fast: '140ms',
    normal: '240ms',
    screen: '320ms',
  },
  easing: {
    // Spring with subtle overshoot for tactile bounce
    springOvershoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Decelerating curve for screen entries
    springSmooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // Standard ease
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },
} as const;
