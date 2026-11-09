/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nutri: {
          teal: {
            50: '#F0FDF9',
            100: '#CCFBF1',
            200: '#99F6E4',
            300: '#5EEAD4',
            400: '#2DD4BF',
            500: '#14B8A6',
            600: '#0D9488',
            700: '#0F766E', // Primary CTA
            800: '#115E59',
            900: '#134E4A',
            950: '#042F2E',
          },
          orange: {
            50: '#FFF7ED',
            100: '#FFEDD5',
            200: '#FED7AA',
            300: '#FDBA74',
            400: '#FB923C',
            500: '#F97316',
            600: '#EA580C',
            700: '#C2410C',
          },
        },
        triage: {
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
        },
        lila: {
          red: '#DC2626',
          yellow: '#D97706',
          green: '#059669',
        },
        kumi: {
          mint: '#E8F8F0',
          mintLight: '#F0FAF5',
          brand: '#117B6A',
          lime: '#48BB28',
          accent: '#22C55E',
          accentShadow: '#15803D',
          sky: '#38BDF8',
          paleMint: '#DCFCE7',
          mintBorder: '#86EFAC',
        },
        gamified: {
          streak: '#EA580C',
          streakBg: '#FFF7ED',
          coin: '#F59E0B',
          coinBg: '#FEF3C7',
          heart: '#EF4444',
          heartBg: '#FEF2F2',
          pastelMint: '#DCFCE7',
          pastelSky: '#E0F2FE',
          pastelPeach: '#FFEDD5',
          pastelLavender: '#F3E8FF',
        },
        slate: {
          900: '#0F172A',
          600: '#475569',
          500: '#64748B',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['Figtree', 'system-ui', '-apple-system', 'sans-serif'],
        child: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
        'pill': '9999px',
        'card-playful': '22px',
        'btn-playful': '18px',
      },
      boxShadow: {
        'subtle': '0 2px 8px 0 rgba(15, 23, 42, 0.04)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        'sheet': '0 -8px 32px 0 rgba(15, 23, 42, 0.12)',
        'btn-primary': '0 8px 24px -4px rgba(15, 118, 110, 0.35)',
        'btn-warm': '0 8px 24px -4px rgba(249, 115, 22, 0.35)',
        'btn-3d': '0 4px 0 #15803D',
        'btn-3d-active': '0 1px 0 #15803D',
        'playful': '0 4px 16px -2px rgba(15, 118, 110, 0.06)',
      },
      transitionTimingFunction: {
        'spring-overshoot': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'spring-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'fast': '140ms',
        'normal': '240ms',
        'screen': '320ms',
      },
      keyframes: {
        'float-breath': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shadow-breath': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.25' },
          '50%': { transform: 'scale(0.82)', opacity: '0.12' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'float-breath': 'float-breath 3.2s ease-in-out infinite',
        'shadow-breath': 'shadow-breath 3.2s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
}
