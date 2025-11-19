/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },
      keyframes: {
        tailorOrbitSlow: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(12deg) scale(1.05)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        tailorOrbitMedium: {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(-8deg) scale(0.98)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        tailorOrbitFast: {
          "0%": { transform: "rotate(0deg) scale(1.02)" },
          "50%": { transform: "rotate(18deg) scale(0.96)" },
          "100%": { transform: "rotate(360deg) scale(1.02)" },
        },
        tailorCoreGlow: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.45" },
          "50%": { transform: "scale(1.2)", opacity: "0.8" },
        },
        tailorAIBreathe: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        tailorOrbitSlow: "tailorOrbitSlow 18s linear infinite",
        tailorOrbitMedium: "tailorOrbitMedium 14s linear infinite",
        tailorOrbitFast: "tailorOrbitFast 10s linear infinite",
        tailorCoreGlow: "tailorCoreGlow 4s ease-in-out infinite",
        tailorAIBreathe: "tailorAIBreathe 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

