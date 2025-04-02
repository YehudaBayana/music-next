import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '1500px',
      },
    },
    extend: {
      transitionProperty: {
        'scale-opacity': 'transform, opacity',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        darkSecondary: 'var(--color-dark-secondary)',
        bgPrimary: 'var(--color-bg-primary)',
        textBase: 'var(--color-text-base)',
      },
    },
  },
  plugins: [],
} satisfies Config;
