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
        background: "var(--background)",
        accent: "var(--accent)",
        neon: "var(--neon)",
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      animation: {
        "cosmic-pulse": "cosmic-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "cosmic-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
