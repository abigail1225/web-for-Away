/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        birthday: {
          cream: '#fff4c7',
          honey: '#ffe8a3',
          ink: '#5b3b22',
          muted: '#926d52',
          rose: '#ff9f9f',
          roseDeep: '#f26d7d',
          blue: '#b8dcff',
          blueDeep: '#75b9f2',
          lavender: '#d9c2ff',
          lavenderDeep: '#8c65c8',
          pink: '#ffd4e2',
        },
      },
      boxShadow: {
        soft: '0 22px 54px rgba(128, 82, 35, 0.15)',
        button: '0 14px 28px rgba(128, 82, 35, 0.12)',
      },
      fontFamily: {
        display: ['Georgia', '"Times New Roman"', '"Songti SC"', 'serif'],
        sans: ['"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        floatDown: {
          '0%': { transform: 'translate3d(0, -12vh, 0) rotate(0deg)', opacity: '0' },
          '12%': { opacity: '0.82' },
          '100%': { transform: 'translate3d(var(--drift), 112vh, 0) rotate(540deg)', opacity: '0' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cardDeal: {
          '0%': { opacity: '0', transform: 'translate(-50%, -45%) rotate(0deg) scale(.82)' },
          '100%': {
            opacity: '1',
            transform: 'translate(calc(-50% + var(--x)), var(--y)) rotate(var(--rot)) scale(1)',
          },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(.94) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        floatDown: 'floatDown linear infinite',
        floatSoft: 'floatSoft 5s ease-in-out infinite',
        fadeUp: 'fadeUp .55s ease both',
        cardDeal: 'cardDeal .72s cubic-bezier(.16,.84,.24,1) both',
        popIn: 'popIn .28s ease both',
      },
    },
  },
  plugins: [],
};
