/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {

        brand: {
          primary: '#FF4121',
          accent: '#D21AE8'
        },
        surface: {
          page: '#FFFFFF',
          card: '#FFFFFF'
        },
        text: {
          primary: '#000000',
          muted: '#454545'
        },
        // Tweak in M6 (tag-style) and M8 (due-tint)
        type: {
          feature: '#10B981', // emerald
          bug: '#DC2626',     // crimson
        },
        due: {
          safe: '#4D80B3',
          warning: '#B3804D',
          overdue: '#B34D4D',
          neutral: '#4DB380'
        },
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
      fontSize: {
        "monospace": "12pt",
        "body": "14pt",
        "heading": "16pt",
      }
    },
  },
  plugins: [],
};
