/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F0F0F",
          light: "#1A1A1A",
        },
        secondary: {
          DEFAULT: "#D4AF37", // Gold
          light: "#F0E68C",
          dark: "#AA8000"
        },
        accent: "#F9F9F9",
        textPrimary: "#333333",
        textSecondary: "#666666",
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(212, 175, 55, 0.15)',
        'luxury-hover': '0 20px 40px -10px rgba(212, 175, 55, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
      }
    },
  },
  plugins: [],
}
