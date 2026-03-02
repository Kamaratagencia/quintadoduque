/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          deep: '#CD982E',
          medium: '#D2A956',
          light: '#DBBD7E',
          cream: '#EEE3C9',
          pale: '#F7F0E0',
        },
        stone: {
          darkest: '#100502',
          dark: '#1E0A04',
          mid: '#5D2910',
          warm: '#884A28',
        },
        caramel: '#A67753',
        beige: '#D2AF91',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 12px rgba(205,152,46,0.15)',
        'gold-md': '0 4px 32px rgba(205,152,46,0.25)',
        'gold-lg': '0 8px 64px rgba(205,152,46,0.35)',
        'card': '0 2px 24px rgba(16,5,2,0.08)',
        'card-hover': '0 8px 40px rgba(16,5,2,0.16)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #CD982E 0%, #DBBD7E 50%, #CD982E 100%)',
        'dark-gradient': 'linear-gradient(180deg, #100502 0%, #1E0A04 100%)',
        'hero-overlay': 'linear-gradient(to top, rgba(16,5,2,0.93) 0%, rgba(16,5,2,0.40) 55%, rgba(16,5,2,0.15) 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(219,189,126,0.4) 50%, transparent 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        borderPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(205,152,46,0.3)' },
          '50%': { boxShadow: '0 0 0 6px rgba(205,152,46,0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 5s ease-in-out infinite',
        scaleIn: 'scaleIn 0.6s ease-out forwards',
        borderPulse: 'borderPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
