/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hm: {
          bg: '#0d1117',
          card: '#161b22',
          elevated: '#1b212b',
          border: '#2a3440',
          gold: '#d4af37',
          goldHover: '#b8923f',
          text: '#e6edf3',
          muted: '#9aa3ad',
          danger: '#d06b62',
          success: '#3aa76d',
          warning: '#c9a85a',
          info: '#4b8bbf',
          chartBlue: '#4b8bbf',
          chartTeal: '#33b39a',
          chartRose: '#d06b62',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(1200px 500px at 10% -10%, rgba(212, 175, 55, 0.12), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(75, 139, 191, 0.08), transparent 55%)',
      }
    },
  },
  plugins: [],
}
