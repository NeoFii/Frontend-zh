import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 全局品牌色
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // 首页 TierFlow 品牌色
        tf: {
          ink: '#08133d',
          muted: '#41517d',
          soft: '#6b7aa7',
          blue: '#1456ff',
          'blue-2': '#3487ff',
          cyan: '#28c8ff',
          line: '#dbe6ff',
        },
        // 新增：登录页赛博科技专属配色
        tech: {
          bg: '#F4F7FB',
          surface: '#FFFFFF',
          text: '#0B1121',
          muted: '#64748B',
          border: '#CBD5E1',
          accent: '#00D2FF', // 极光蓝
          secondary: '#3B82F6'
        }
      },
      fontFamily: {
        // 原有全局字体
        sans: ['MiSans', 'PingFang SC', 'PingFang HK', 'Microsoft Yahei', '微软雅黑', 'Arial', 'sans-serif'],
        display: ['MiSans', 'PingFang SC', 'PingFang HK', 'Microsoft Yahei', '微软雅黑', 'Arial', 'sans-serif'],
        // 新增：登录页专属字体隔离（防止影响全局）
        'tech-mono': ['"JetBrains Mono"', '"Noto Sans SC"', 'monospace'],
        'tech-display': ['"Orbitron"', '"Noto Sans SC"', 'sans-serif'],
        'tech-sans': ['"Space Grotesk"', '"Noto Sans SC"', 'sans-serif'],
      },
      maxWidth: {
        'tf': '1548px',
      },
      fontSize: {
        // 原有字体大小
        'display-1': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-3': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      // 新增：登录页专属动画关键帧
      keyframes: {
        scanlineSweep: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        helloFadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)', letterSpacing: '0.2rem' },
          '100%': { opacity: '1', transform: 'scale(1)', letterSpacing: '1.8rem' },
        },
        helloFlyOut: {
          '0%': { opacity: '1', transform: 'scale(1) translateZ(0)', filter: 'blur(0)' },
          '100%': { opacity: '0', transform: 'scale(5) translateZ(100px)', filter: 'blur(12px)' },
        },
        hideIntro: {
          '0%': { opacity: '1', visibility: 'visible' },
          '100%': { opacity: '0', visibility: 'hidden', zIndex: '-1' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      // 新增：登录页专属动画调用
      animation: {
        'scanline-sweep': 'scanlineSweep 8s linear infinite',
        'hello-fade-in': 'helloFadeIn 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards',
        'hello-fly-out': 'helloFlyOut 0.8s cubic-bezier(0.7, 0, 0.3, 1) 1.8s forwards',
        'wave': 'wave 1.1s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
