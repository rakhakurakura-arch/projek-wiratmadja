/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F4F7F5',
          100: '#E4ECF0',
          200: '#C7D7CD',
          300: '#A4BFA9',
          400: '#759B7D',
          500: '#4D7856',
          600: '#3D6144',
          700: '#2E4934',
          800: '#1E3A2B', // Core Deep Forest Green
          900: '#12241B',
          950: '#0A150F',
        },
        sage: {
          50: '#F7F9F7',
          100: '#EAF0EB', // Soft Sage Tint
          200: '#D5E1D7',
          300: '#B8CCBC',
          400: '#94B09A',
          500: '#73957A',
          600: '#58765E',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FDFDFC',
          200: '#F9FBFA', // Warm Ivory Background
          300: '#F3F6F4',
          400: '#E7ECE9',
        },
        charcoal: {
          700: '#34403B',
          800: '#232D29',
          900: '#1A2421', // Slate Charcoal Text
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
