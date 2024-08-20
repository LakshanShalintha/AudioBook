/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dance: {
          '0%': { transform: 'scaleY(0.3)' },
          '40%': { transform: 'scaleY(1.2)' },
          '60%': { transform: 'scaleY(0.6)' },
          '100%': { transform: 'scaleY(0.3)' },
        },
      },
      animation: {
        dance1: 'dance 1.3s infinite ease-in-out',
        dance2: 'dance 1.1s infinite ease-in-out',
        dance3: 'dance 1s infinite ease-in-out',
        dance4: 'dance 0.9s infinite ease-in-out',
        dance5: 'dance 1.3s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}


