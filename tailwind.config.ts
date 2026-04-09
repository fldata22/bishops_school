import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Aurora Glass palette ──────────────────────────────────────────
        'background':          '#07070f',

        // Surface tokens — always used with opacity modifier e.g. bg-surface/4
        'surface':             '#ffffff',
        'surface-high':        '#ffffff',
        'surface-container':   '#ffffff',
        'outline':             '#ffffff',
        'outline-variant':     '#ffffff',
        'on-surface-variant':  '#f0eeff',

        // Primary text
        'on-surface':          '#f0eeff',

        // Violet
        'primary':             '#7c3aed',
        'primary-dim':         '#a78bfa',

        // Cyan
        'secondary':           '#06b6d4',
        'secondary-dim':       '#22d3ee',

        // Rose
        'tertiary':            '#f43f5e',
        'tertiary-dim':        '#fb7185',
      },
      borderRadius: {
        DEFAULT: '0.375rem',
        sm:      '0.25rem',
        md:      '0.5rem',
        lg:      '0.75rem',
        xl:      '1rem',
        '2xl':   '1.25rem',
        '3xl':   '1.75rem',
        full:    '9999px',
      },
      fontFamily: {
        headline: ['var(--font-display)', 'sans-serif'],
        body:     ['var(--font-body)', 'sans-serif'],
        label:    ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
