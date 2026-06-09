/**
 * Shared black-and-white Tailwind preset.
 * Off-black / off-white only. No color, no gradients. Sharp, minimal, premium.
 * @type {Partial<import('tailwindcss').Config>}
 */
const preset = {
  theme: {
    extend: {
      colors: {
        // Off-black ink and off-white paper instead of pure #000 / #fff.
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#1a1a1a',
          muted: '#3d3d3d',
        },
        paper: {
          DEFAULT: '#fafafa',
          soft: '#f2f2f2',
          sunken: '#ebebeb',
        },
        line: {
          DEFAULT: '#e2e2e2',
          strong: '#cfcfcf',
        },
        neutral: {
          50: '#fafafa',
          100: '#f2f2f2',
          200: '#e2e2e2',
          300: '#cfcfcf',
          400: '#9a9a9a',
          500: '#6b6b6b',
          600: '#4a4a4a',
          700: '#2e2e2e',
          800: '#1a1a1a',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(10, 10, 10, 0.06)',
        card: '0 1px 3px rgba(10, 10, 10, 0.08)',
      },
      letterSpacing: {
        tightish: '-0.011em',
      },
    },
  },
};

module.exports = preset;
