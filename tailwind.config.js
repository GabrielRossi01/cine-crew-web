/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B4393',
          50: '#E8ECF5',
          100: '#D1D9EB',
          200: '#A3B3D7',
          300: '#758DC3',
          400: '#4767AF',
          500: '#2B4393',
          600: '#233676',
          700: '#1A2959',
          800: '#121C3C',
          900: '#090E1F',
        },
        accent: {
          DEFAULT: '#FFC250',
          50: '#FFF5E0',
          100: '#FFECC2',
          200: '#FFD985',
          300: '#FFC250',
          400: '#FFB52E',
          500: '#FFA500',
          600: '#CC8400',
          700: '#996300',
          800: '#664200',
          900: '#332100',
        },
        dark: {
          bg: '#1a1a2e',
          deeper: '#0f0f1a',
          card: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(43, 67, 147, 0.2)',
        'glass-lg': '0 16px 48px 0 rgba(43, 67, 147, 0.3)',
        'accent-glow': '0 0 20px rgba(255, 194, 80, 0.3)',
      },
    },
  },
  plugins: [],
};
