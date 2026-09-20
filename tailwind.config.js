/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 教 / 你提供的技能 —— 沉静的紫罗兰（主品牌识别色）
        brand: {
          50: '#F4F2FE',
          100: '#E9E5FD',
          200: '#D8D0FB',
          300: '#B9AAF7',
          400: '#9985F2',
          500: '#7C63EC',
          600: '#6A4FE0', // primary
          700: '#5739C4',
          800: '#452C9E',
          900: '#342175',
        },
        // 学 / 你想学的技能 —— 温暖的珊瑚橙（辅助色，与紫协调）
        accent: {
          50: '#FFF1EC',
          100: '#FFE2D7',
          200: '#FEC9B7',
          300: '#F7A98F',
          400: '#F79277',
          500: '#F2734E', // primary learn
          600: '#E15A36',
          700: '#BC4424',
        },
        // 完成 / 正向反馈 —— 克制的青绿
        success: {
          50: '#EDFBF4',
          100: '#D2F5E4',
          500: '#18B884',
          600: '#0E9C70',
          700: '#0A7B58',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 10px 30px -14px rgba(106, 79, 224, 0.20)',
        card: '0 1px 2px rgba(60, 50, 30, 0.04), 0 12px 32px -22px rgba(60, 50, 30, 0.18)',
        hover: '0 16px 40px -18px rgba(60, 50, 30, 0.22)',
        pop: '0 24px 60px -18px rgba(60, 50, 30, 0.32)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
}
