import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        'background-alt': 'var(--background-alt)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        secondary: 'var(--secondary)',
        'secondary-hover': 'var(--secondary-hover)',
        'gray-dark': 'var(--gray-dark)',
        'gray-medium': 'var(--gray-medium)',
        'gray-light': 'var(--gray-light)',
        danger: '#ef4444',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
      },
    },
  },
  plugins: [],
} satisfies Config;
