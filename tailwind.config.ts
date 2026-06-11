import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        basalt: "#26211C",
        slate2: "#3B342D",
        granite: "#6E6258",
        stone2: "#ECE7DE",
        chalk: "#FBF9F4",
        ember: "#C97B2D",
        emberDeep: "#A35F1B",
        moss: "#6E7A4F",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      clipPath: {},
    },
  },
  plugins: [],
};
export default config;
