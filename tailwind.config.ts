import type { Config } from "tailwindcss";

export default {
  darkMode: 'class', 
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#0f6cb6',
          dark: '#0f6cb6',
        },
        secondary: {
          light: '#8dc63f',
          dark: '#8dc63f',
        },
        background: {
          light: '#F3F4F6',
          dark: '#0A0A0A',
        },
        surface: {
          light: '#f3f4f6',
          dark: '#0A0A0A',
        },
        text: {
          light: '#111827',
          dark: '#F9FAFB',
        },
        textFooter: { //swap dark and light text
          light: '#F9FAFB',
          dark: '#111827',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
