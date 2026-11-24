/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#08090C',
          surface: '#12141A',
          card: '#161922',
          border: '#232734',
          hover: '#1D212D'
        },
        champagne: {
          light: '#F5E6D0',
          DEFAULT: '#E5C392',
          dark: '#C89D61',
          rose: '#DCA283',
          cognac: '#A86C38'
        },
        salon: {
          emerald: '#10B981',
          topaz: '#F59E0B',
          ruby: '#F43F5E',
          sapphire: '#3B82F6'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px -5px rgba(229, 195, 146, 0.15)',
        'luxury-glow': '0 0 35px -5px rgba(229, 195, 146, 0.3)',
        'card-glow': '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(229, 195, 146, 0.1)'
      },
      minHeight: {
        touch: '44px'
      },
      minWidth: {
        touch: '44px'
      }
    },
  },
  plugins: [],
}
