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
      boxShadow: {
        DEFAULT: '0 0 0 1px rgb(var(--foreground-secondary) / 0.1)',
        inner: 'inset 0 0 10px 5px rgb(var(--foreground) / 0.015)',
        sm: '0 1px 2px 0 rgb(var(--foreground-secondary) / 0.05)',
      },
      colors: {
        background: {
          primary: 'rgb(var(--background-primary) / <alpha-value>)',
          secondary: 'rgb(var(--background-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--background-tertiary) / <alpha-value>)',
          accent: 'rgb(var(--background-accent) / <alpha-value>)',
          DEFAULT: 'rgb(var(--background) / <alpha-value>)',
        },
        foreground: {
          primary: 'rgb(var(--foreground-primary) / <alpha-value>)',
          secondary: 'rgb(var(--foreground-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--foreground-tertiary) / <alpha-value>)',
          accent: 'rgb(var(--foreground-accent) / <alpha-value>)',
          DEFAULT: 'rgb(var(--foreground) / <alpha-value>)',
        },
      }
    },
  },
  plugins: [],
}