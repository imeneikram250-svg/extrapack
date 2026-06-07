import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fff0f7",
          100: "#ffe0ef",
          200: "#ffc1df",
          300: "#ff93c5",
          400: "#ff55a1",
          500: "#ff2080",
          600: "#e8005e",
          700: "#c4004e",
          800: "#a20042",
          900: "#87003a",
        },
        gold: {
          400: "#e6c56a",
          500: "#d4a843",
          600: "#b8922e",
        },
        dark: {
          900: "#0a0a0f",
          800: "#12121a",
          700: "#1a1a26",
          600: "#22222e",
        }
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        accent: ["'Cormorant Garamond'", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "shimmer": "shimmer 2s infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        }
      },
      boxShadow: {
        "brand": "0 4px 24px rgba(255, 32, 128, 0.25)",
        "brand-lg": "0 8px 48px rgba(255, 32, 128, 0.35)",
        "luxury": "0 2px 40px rgba(212, 168, 67, 0.2)",
        "card": "0 2px 20px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.15)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #ff2080 0%, #ff55a1 50%, #e8005e 100%)",
        "gradient-gold": "linear-gradient(135deg, #e6c56a 0%, #d4a843 100%)",
        "gradient-dark": "linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)",
      }
    },
  },
  plugins: [],
};

export default config;
