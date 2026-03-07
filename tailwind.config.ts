import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        abu: {
          dark: '#0a0a0a',
          charcoal: '#171717',
          gray: '#262626',
          'header-bg': '#2E2E2E',
          'gray-light': '#525252',
          pink: '#e8a4b8',
          'pink-dark': '#d48a9e',
          'gradient-from': '#FF007F',
          'gradient-to': '#FF8C00',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'search-gradient': 'linear-gradient(90deg, #FF007F 0%, #FF8C00 100%)',
      },
    },
  },
  plugins: [],
}
export default config
