/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        semiconductor: {
          design: '#8b5cf6',
          eda: '#a855f7',
          manufacturing: '#3b82f6',
          equipment: '#06b6d4',
          materials: '#10b981',
          packaging: '#f59e0b',
          endproducts: '#ef4444',
        },
        apple: {
          blue: '#0071e3',
          indigo: '#5856d6',
          purple: '#af52de',
          pink: '#ff2d55',
          red: '#ff3b30',
          orange: '#ff9500',
          yellow: '#ffcc00',
          green: '#34c759',
          teal: '#5ac8fa',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'SFMono-Regular', 'ui-monospace', 'Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        'apple-spin': 'appleSpin 1s linear infinite',
        'spring-in': 'springIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-scale': 'pulseScale 1.5s ease-in-out infinite',
        'bounce-slow': 'bounceSlow 2s ease-in-out infinite',
        'breathing-glow': 'breathingGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        appleSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        springIn: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '60%': { opacity: '1', transform: 'scale(1.02) translateY(-4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseScale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        breathingGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'blur(20px)' },
          '50%': { opacity: '1', filter: 'blur(30px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'apple': '0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'apple-md': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'apple-xl': '0 16px 48px rgba(0, 0, 0, 0.16)',
        'apple-2xl': '0 24px 64px rgba(0, 0, 0, 0.2)',
        'glow-blue': '0 0 30px rgba(0, 113, 227, 0.4)',
        'glow-violet': '0 0 30px rgba(139, 92, 246, 0.4)',
        'glow-fusion': '0 0 40px rgba(99, 102, 241, 0.35)',
      },
      backdropBlur: {
        'apple': '20px',
        'apple-heavy': '40px',
      },
      borderRadius: {
        'xxs': '4px',
        'xs': '6px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-subtle': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
  },
  plugins: [],
}
