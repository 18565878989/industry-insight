/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
        }
      }
    },
  },
  plugins: [],
}
