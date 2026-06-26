/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rv: {
          navy: '#0A0E1A',
          deep: '#0D1B3E',
          blue: '#1A3A6B',
          cyan: '#00B4D8',
          'cyan-light': '#90E0EF',
          white: '#F0F4FF',
          gray: '#8892A4',
          border: '#1E2D50',
          gold: '#F59E0B',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-cyan': 'pulseCyan 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,180,216,0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(0,180,216,0.7)' },
        },
      },
    },
  },
  plugins: [],
};
