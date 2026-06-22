import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#09090E',   // page background
          surface:  '#111118',   // cards, panels
          elevated: '#1C1C28',   // modals, dropdowns, hover states
        },
        border:     '#22222E',   // all dividers and borders
        accent: {
          DEFAULT:  '#6C63FF',   // primary CTA, links, active states
          soft:     '#6C63FF1A', // accent tint backgrounds
          hover:    '#7B73FF',   // accent hover
        },
        status: {
          green:    '#22D3A5',   // offered, success
          amber:    '#F59E0B',   // interviewing, warning
          red:      '#F43F5E',   // rejected, error
          blue:     '#60A5FA',   // applied
          purple:   '#A78BFA',   // phone screen
          gray:     '#6B7280',   // withdrawn, muted
        },
        text: {
          primary:   '#EEEEF5',  // headings, labels
          secondary: '#8888AA',  // body copy, descriptions
          muted:     '#44445A',  // placeholders, disabled
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
