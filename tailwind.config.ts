import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdf9f3",
          100: "#faf0e4",
          200: "#f5e0c8",
        },
        caramel: {
          400: "#d4956a",
          500: "#c47a4a",
          600: "#a85f32",
        },
        blush: {
          100: "#fce8e8",
          200: "#f9d0d0",
          400: "#e89090",
        },
      },
      fontFamily: {
        sans: ["Hiragino Kaku Gothic ProN", "Hiragino Sans", "Meiryo", "sans-serif"],
      },
      animation: {
        "bounce-in": "bounceIn 0.4s ease-out",
        "fade-out": "fadeOut 0.3s ease-in forwards",
        "paw-spin": "pawSpin 0.5s ease-out",
        wiggle: "wiggle 0.3s ease-in-out",
      },
      keyframes: {
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.8) translateY(-10px)" },
          "60%": { transform: "scale(1.05) translateY(0)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(30px)" },
        },
        pawSpin: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.3)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
