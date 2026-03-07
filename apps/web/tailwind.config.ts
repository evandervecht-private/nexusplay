import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f3ff",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
    },
  },
  plugins: [],
};

export default config;
