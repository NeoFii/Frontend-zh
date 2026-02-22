import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['MiSans', 'PingFang SC', 'PingFang HK', 'Microsoft Yahei', '微软雅黑', 'Arial', 'sans-serif'],
        display: ['MiSans', 'PingFang SC', 'PingFang HK', 'Microsoft Yahei', '微软雅黑', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-3': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
    },
  },
  plugins: [],
};
export default config;
