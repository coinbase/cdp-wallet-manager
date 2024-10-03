import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fb',
          300: '#66aaf9',
          400: '#338ef7',
          500: '#0072f5',
          600: '#005bc4',
          700: '#004493',
          800: '#002e62',
          900: '#001731',
        },
        secondary: {
          50: '#f2eafa',
          100: '#e4d4f4',
          200: '#c9a9e9',
          300: '#ae7ede',
          400: '#9353d3',
          500: '#7828c8',
          600: '#6020a0',
          700: '#481878',
          800: '#301050',
          900: '#180828',
        },
        success: {
          50: '#e8faf0',
          100: '#d1f4e0',
          200: '#a3e9c1',
          300: '#75dea2',
          400: '#47d383',
          500: '#17c964',
          600: '#12a150',
          700: '#0e793c',
          800: '#095028',
          900: '#052814',
        },
        warning: {
          50: '#fefce8',
          100: '#fdface',
          200: '#fbf5a1',
          300: '#f9f174',
          400: '#f7ec47',
          500: '#f5a524',
          600: '#c4841d',
          700: '#936316',
          800: '#62420e',
          900: '#312107',
        },
        danger: {
          50: '#fee7ef',
          100: '#fdd0df',
          200: '#faa0bf',
          300: '#f871a0',
          400: '#f54180',
          500: '#f31260',
          600: '#c20e4d',
          700: '#920b3a',
          800: '#610726',
          900: '#310413',
        },
        black: '#000000',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      boxShadow: {
        'inner-md': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  darkMode: "media", // This tells Tailwind to use the browser's preference
  plugins: [
    require('@tailwindcss/forms'),
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#0072F5",
            },
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#ECEDEE",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#0072F5",
            },
          },
        },
      },
    }),
  ],
};

export default config;
