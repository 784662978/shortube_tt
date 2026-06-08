import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#131316',
          card: '#2A2A2D',
          surface: '#353438',
          text: '#E4E1E6',
          muted: '#E6BCBD',
          pink: '#FFB3B5',
          accent: '#FF5167',
          purple: '#7900CD',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        beVietnam: ['Be Vietnam Pro', 'sans-serif'],
      },
      borderRadius: {
        'full': '9999px',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(90deg, #7900CD, #FF5167)',
        'gradient-brand-vertical': 'linear-gradient(180deg, #7900CD, #FF5167)',
      },
      width: {
        'mobile': '390px',
      },
      maxWidth: {
        'mobile': '480px',
        'tablet': '640px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 179, 181, 0.15)',
        'glow-lg': '0 0 40px rgba(255, 179, 181, 0.25)',
        card: '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} satisfies Config

