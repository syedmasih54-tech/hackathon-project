/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bridge: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        saffron: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        brandRed: '#C41528',
        deepRed: '#8E1B2B',
        brandInk: '#1A0F12'
      },
      fontFamily: {
        wordmark: ['"Saira Stencil One"', '"Unbounded"', 'sans-serif'],
        body: ['"Inter Tight"', 'sans-serif'],
        serifItalic: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: [
          '"Inter Tight"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Noto Sans Devanagari"',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}
