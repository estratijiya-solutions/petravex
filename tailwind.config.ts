import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#0A0A0A',
          soft: '#141414',
          elevated: '#1A1A1A',
        },
        white: '#FFFFFF',
        gold: {
          DEFAULT: '#D4AF37',
          soft: 'rgba(212, 175, 55, 0.15)',
          glow: 'rgba(212, 175, 55, 0.4)',
        },
        gray: {
          DEFAULT: '#8C8C8C',
          soft: '#2A2A2A',
          light: '#B5B5B5',
        },
      },
      fontFamily: {
        arabic: ['var(--font-almarai)', 'Almarai', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        body: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        'h1-mobile': ['40px', { lineHeight: '1.2', fontWeight: '800' }],
        'h1-desktop': ['72px', { lineHeight: '1.1', fontWeight: '800' }],
        'h2-mobile': ['28px', { lineHeight: '1.25', fontWeight: '700' }],
        'h2-desktop': ['44px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3-mobile': ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3-desktop': ['26px', { lineHeight: '1.3', fontWeight: '700' }],
      },
      letterSpacing: {
        caption: '0.05em',
      },
      transitionTimingFunction: {
        signature: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'gold-line': 'gold-line 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'rotate-stone': 'rotate-stone 28s linear infinite',
      },
      keyframes: {
        'gold-line': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'rotate-stone': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
