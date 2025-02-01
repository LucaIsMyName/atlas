/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/renderer/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderColor: theme => ({
        DEFAULT: theme('colors.foreground.secondary', 'currentColor'),
        ...theme('colors'),
      }),
      colors: {
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
          accent: 'var(--background-accent)',
          DEFAULT: 'var(--background)',
        },
        foreground: {
          primary: 'var(--foreground-primary)',
          secondary: 'var(--foreground-secondary)',
          tertiary: 'var(--foreground-tertiary)',
          accent: 'var(--foreground-accent)',
          DEFAULT: 'var(--foreground)',
        },
      }
    },
  },
  plugins: [],
}