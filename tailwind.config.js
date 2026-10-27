/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8458C6',
          accent: '#A812BA',
        },
        surface: {
          page: '#FFFFFF',
          card: '#FFFFFF',
        },
        text: {
          primary: '#000000',
          muted: '#454545',
        },
        type: {
          feature: '#10B981',
          bug: '#DC2626',
        },
        due: {
          safe: '#4D80B3',
          warning: '#B3804D',
          overdue: '#B34D4D',
          neutral: '#4DB380',
        },
        danger: '#B91C1C',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      // DESIGN.md §3 sizes are px (the starter had pt, which renders ~33% larger).
      fontSize: {
        title: ['24px', { lineHeight: '32px', fontWeight: '600' }],
        heading: ['16px', { lineHeight: '24px' }],
        body: ['14px', { lineHeight: '20px' }],
        monospace: ['12px', { lineHeight: '16px' }],
      },
      keyframes: {
        fadein: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        fadein: 'fadein 200ms ease-out',
      },
    },
  },
  plugins: [typography],
};
