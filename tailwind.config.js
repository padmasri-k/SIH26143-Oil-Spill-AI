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
        marine: {
          950: '#030712',
          900: '#070f22',
          850: '#0a1633',
          800: '#0f224a',
          700: '#173570',
          600: '#1f4c9c',
          500: '#2b6cd4',
          400: '#4d8df7',
          300: '#85b3fc',
          200: '#bfd7fe',
          100: '#e0ecff',
          50: '#f0f6ff',
        },
        radar: {
          cyan: '#00f0ff',
          teal: '#00e5bc',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#a855f7',
        },
        surface: {
          base: '#050b18',
          card: '#0a1529',
          cardHover: '#0f1f3d',
          border: 'rgba(56, 189, 248, 0.15)',
          borderGlow: 'rgba(0, 240, 255, 0.35)',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'glow-teal': '0 0 20px -3px rgba(0, 229, 188, 0.35)',
        'glow-rose': '0 0 20px -3px rgba(244, 63, 94, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'hud': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1), 0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
