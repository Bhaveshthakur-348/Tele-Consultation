/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{jsx,js}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue:      '#0062FF',
          'blue-hover': '#0050D0',
          teal:      '#18DCAB',
        },
        clinical: {
          bg:        '#F7F7F7',
          navy:      '#09162B',
          slate:     '#475569',
          muted:     '#94A3B8',
          border:    '#E2E2E8',
          'border-light': '#F2F2F4',
          success:   '#00B277',
          warning:   '#F59E0B',
          danger:    '#E24B4A',
          purple:    '#6236FF',
        },
        dark: {
          bg:        '#0B1629',
          surface:   '#132540',
          sidebar:   '#1A2B42',
          topbar:    '#0D1B2E',
          border:    'rgba(255,255,255,0.08)',
          text:      '#E2E8F0',
          muted:     '#6A85A8',
          secondary: '#B0C4D8',
        },
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        inter:   ['Inter', 'sans-serif'],
      },
      boxShadow: {
        clinical: '0 2px 20px rgba(9,22,43,0.07)',
        blue:     '0 8px 28px rgba(0,98,255,0.14)',
        'blue-sm':'0 4px 14px rgba(0,98,255,0.24)',
      },
    },
  },
  plugins: [],
}
