/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // All colors use RGB channel vars so Tailwind opacity modifiers work:
        // e.g. bg-ui-action/50 → rgb(0 111 255 / 0.5)
        'ui-action':      'rgb(var(--ui-action) / <alpha-value>)',
        'ui-card':        'rgb(var(--ui-card) / <alpha-value>)',
        'ui-line':        'rgb(var(--ui-line) / <alpha-value>)',
        'text-primary':   'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-reversed':  'rgb(var(--text-reversed) / <alpha-value>)',
        'text-hint':      'rgb(var(--text-hint-label) / <alpha-value>)',
        'text-link':      'rgb(var(--text-link) / <alpha-value>)',
        'bg-default':     'rgb(var(--bg-default) / <alpha-value>)',
        'bg-grey':        'rgb(var(--bg-grey) / <alpha-value>)',
        'bg-reversed':    'rgb(var(--bg-reversed) / <alpha-value>)',
        'control-field':         'rgb(var(--control-field) / <alpha-value>)',
        'control-stroke':        'rgb(var(--control-field-stroke) / <alpha-value>)',
        'control-stroke-active': 'rgb(var(--control-stroke-active) / <alpha-value>)',
        'control-hover':         'rgb(var(--control-hover) / <alpha-value>)',
        'neutral-white':  'rgb(var(--neutral-white) / <alpha-value>)',
        'brand-primary':  'rgb(var(--brand-primary) / <alpha-value>)',
        'semantic-red':   'rgb(var(--semantic-red-default) / <alpha-value>)',
        'semantic-green': 'rgb(var(--semantic-green-default) / <alpha-value>)',
        'semantic-blue':  'rgb(var(--semantic-blue-default) / <alpha-value>)',
      },
      borderRadius: {
        'control-lg': 'var(--radius-control-large)',
        'control-md': 'var(--radius-control-medium)',
        'control-sm': 'var(--radius-control-small)',
        'icon-btn':   'var(--radius-icon-buttons)',
        'field':      'var(--radius-field)',
      },
      fontFamily: {
        body:    'var(--fonts-body)',
        heading: 'var(--fonts-heading)',
      },
    },
  },
  plugins: [],
}
