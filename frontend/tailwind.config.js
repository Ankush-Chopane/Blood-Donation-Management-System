/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--rgb-primary) / <alpha-value>)',
        secondary: 'rgb(var(--rgb-secondary) / <alpha-value>)',
        darkBg: 'rgb(var(--rgb-dark-bg) / <alpha-value>)',
        darkSurface: 'rgb(var(--rgb-dark-surface) / <alpha-value>)',
        darkGray: 'rgb(var(--rgb-dark-gray) / <alpha-value>)',
        lightGray: 'rgb(var(--rgb-light-gray) / <alpha-value>)',
        white: 'rgb(var(--rgb-white) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 18px 60px rgba(2, 8, 23, 0.36)',
        premium: '0 28px 70px rgba(2, 8, 23, 0.42)',
      }
    },
  },
  plugins: [],
};
