import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      screens: {
        xs: '320px',
        xsm: '375px',
        sm: '475px',
        '2sm': '600px',
        md: '768px',
        '2md': '980px',
        lg: '1025px',
        '2lg': '1290px',
        '3lg': '1360px',
        xl: '1442px',
        '2xl': '1560px',
        '3xl': '1650px',
        '4xl': '1750px'
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  },
  plugins: []
} satisfies Config;
