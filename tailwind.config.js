/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        surface: '#FFFFFF',
        bg: '#F2F0F9',
        border: '#E6E2F3',
        ink: {
          DEFAULT: '#16112B',
          2: '#4A4368',
          3: '#8C85A8',
          4: '#BDB8D0',
        },
        violet: {
          DEFAULT: '#5240C4',
          light: '#EDE9FB',
          mid: '#7B6FD8',
          dark: '#3B2EA0',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(82,64,196,0.06), 0 1px 2px -1px rgba(82,64,196,0.04)',
        elevated: '0 4px 16px 0 rgba(82,64,196,0.10)',
      },
    },
  },
  plugins: [],
}
