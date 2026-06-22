/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      colors: {
        navy: {
          50:  '#E6EEF9', 100: '#BDD0F0', 200: '#85AEDE',
          300: '#4D8DCC', 400: '#2571BA', 500: '#00338D',
          600: '#002E80', 700: '#002270', 800: '#001760', 900: '#000C4D',
        },
        green: {
          50:  '#E4F5EC', 100: '#C4E9D4', 200: '#88D3AA',
          300: '#4DBC80', 400: '#22A55C', 500: '#0A5C3C',
          600: '#085235', 700: '#06402A', 800: '#04301F', 900: '#022014',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.25s ease both',
        shimmer: 'shimmer 1.6s infinite linear',
      },
      keyframes: {
        fadeInUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-600px 0' }, '100%': { backgroundPosition: '600px 0' } },
      },
    },
  },
  plugins: [],
}
