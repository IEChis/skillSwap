/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 教 / 品牌识别紫（彩虹系统中最饱和的保留色，仅用于品牌与 CTA）
        brand: {
          50: '#F5F3FF',
          100: '#EDECFF',
          200: '#DED7FE',
          300: '#C4B6FB',
          400: '#A78BFA',
          500: '#9273FC',
          600: '#7C5CFC', // primary
          700: '#6D44F2',
          800: '#5834D6',
          900: '#4526B0',
        },
        // 学 / 品牌橙（交换的另一极）
        accent: {
          50: '#FFF3EC',
          100: '#FFE8DB',
          200: '#FFD6C0',
          300: '#FFB98C',
          400: '#FF9E6B',
          500: '#FF8A4C', // primary learn
          600: '#F2712F',
          700: '#D85E1F',
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
        soft: '0 10px 30px -14px rgba(24, 24, 27, 0.12)',
        card: '0 1px 2px rgba(24, 24, 27, 0.04), 0 12px 32px -22px rgba(24, 24, 27, 0.10)',
        hover: '0 16px 40px -18px rgba(24, 24, 27, 0.14)',
        pop: '0 24px 60px -18px rgba(24, 24, 27, 0.16)',
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
