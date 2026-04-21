# CLAUDE.md — Component Workshop

This file gives Claude Code the context it needs to generate consistent
components in this project. Keep it open or reference it at the start
of every Claude Code session.

---

## Figma Design System

- **File**: [🧰 Now Boarding Design System Kit](https://www.figma.com/design/h7IRa1i2N5ucusuhqIhCTJ/%F0%9F%A7%B0-Now-Boarding-Design-System-Kit)
- **File Key**: `h7IRa1i2N5ucusuhqIhCTJ`
- **Library**: 🧰 Now Boarding Design System Kit

When starting a new component session, pull the node URL from Figma by selecting the component frame and copying the browser URL.

---

## Project Stack

- React 18
- TypeScript (strict)
- Tailwind CSS v3
- Vite

---

## Design Token System

This project uses a three-layer token architecture. Every value in every component must trace back through this chain — nothing is hardcoded.

```
Figma variables → src/styles/tokens.css (CSS custom properties) → tailwind.config.ts (Tailwind classes) → Component
```

### Layer 1 — `src/data/figmaTokens.ts`
The source of truth, mirroring the Figma variable collections exactly:
- **System Colours** — neutral greys, semantic colours (green, red, blue, etc.)
- **Theme** — semantic roles with light/dark mode values (e.g. `UI/Action`, `Text/Primary`)
- **Brand** — primary colour, radius values, font stacks
- **Base Sizes** — spacing scale
- **Responsive** — breakpoint-aware sizing

### Layer 2 — `src/styles/tokens.css`
Converts `figmaTokens.ts` values into CSS custom properties on `:root`.

**Critical rule — Tailwind v3 RGB channel format:**
Tailwind v3 wraps color values in `rgb(var(--x) / <opacity>)`. If the CSS variable contains a hex string (e.g. `#006fff`), this breaks silently — the color renders as transparent. All theme color variables **must** be stored as space-separated RGB channels:

```css
/* ✅ Correct */
--ui-action: 0 111 255;

/* ❌ Wrong — will render as transparent in Tailwind */
--ui-action: #006fff;
```

Dark mode is applied via `[data-theme="dark"]` attribute on a parent element (not media query), giving user-controlled theme switching:

```css
:root { --ui-action: 0 111 255; }
[data-theme="dark"] { --ui-action: 0 111 255; }
```

Non-color values (radius, font, spacing) use standard units and are unaffected by the RGB rule:
```css
--radius-control-large: 12px;
--fonts-body: Inter, sans-serif;
```

### Layer 3 — `tailwind.config.ts`
Maps CSS variables to semantic Tailwind class names using the `<alpha-value>` placeholder:

```ts
colors: {
  'ui-action': 'rgb(var(--ui-action) / <alpha-value>)',
  'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
  'bg-grey': 'rgb(var(--bg-grey) / <alpha-value>)',
  'neutral-white': 'rgb(var(--neutral-white) / <alpha-value>)',
},
borderRadius: {
  'control-lg': 'var(--radius-control-large)',
  'control-md': 'var(--radius-control-medium)',
},
fontFamily: {
  body: 'var(--fonts-body)',
  heading: 'var(--fonts-heading)',
},
```

This enables opacity modifiers like `bg-ui-action/50` to work correctly.

### Key token names (Figma → CSS var → Tailwind class)

| Figma Token | CSS Variable | Tailwind Class |
|---|---|---|
| `UI/Action` | `--ui-action` | `bg-ui-action`, `border-ui-action` |
| `Text/Primary` | `--text-primary` | `text-text-primary` |
| `Text/Reversed` | `--text-reversed` | `text-text-reversed` |
| `Neutral/White` | `--neutral-white` | `text-neutral-white`, `bg-neutral-white` |
| `Backgrounds/Grey` | `--bg-grey` | `bg-bg-grey` |
| `UI/Card` | `--ui-card` | `bg-ui-card` |
| `UI/Line` | `--ui-line` | `border-ui-line` |
| `Radius/Control Large` | `--radius-control-large` | `rounded-control-lg` |
| `Radius/Control Medium` | `--radius-control-medium` | `rounded-control-md` |
| `Fonts/Body Font` | `--fonts-body` | `font-body` |

### Adding a new token
1. Add the value to `figmaTokens.ts` under the correct collection
2. Add the CSS variable to `tokens.css` (as RGB channels if it's a color)
3. Add the Tailwind mapping to `tailwind.config.ts`
4. Restart the dev server — Tailwind must rebuild to pick up config changes

---

## Component Rules

Every component Claude generates must follow these rules:

1. **File location**: `src/components/[ComponentName]/index.tsx`
2. **Named props interface**: always export a `[ComponentName]Props` interface
3. **Default export**: the component itself is the default export
4. **No hardcoded values**: all colors, radii, and fonts must use token-linked Tailwind classes
5. **No inline styles**: use Tailwind classes only
6. **Semantic HTML**: use correct HTML elements (`button`, `nav`, `header`, etc.)
7. **Accessibility**: include `aria-*` attributes and focus states where relevant

---

## Prompt Template

Use this at the start of every new component session:

```
We are building a React component library.
Stack: React 18, TypeScript (strict), Tailwind CSS v3, Vite.

Token system:
- CSS custom properties are defined in src/styles/tokens.css
- Tailwind classes are mapped in tailwind.config.ts
- All colors use rgb(var(--token) / <alpha-value>) format
- Key classes: bg-ui-action, text-neutral-white, rounded-control-lg, font-body

Rules:
- File goes in src/components/[Name]/index.tsx
- Export a named [Name]Props interface
- Default export the component
- Tailwind only, no inline styles, no hardcoded values
- Semantic HTML and basic accessibility

Here is the Figma frame to match: [PASTE FIGMA URL]

Generate the component.
```

---

## Adding a Component to the Showcase

After generating a component, add it to `src/pages/ComponentShowcase.tsx`:

1. Import it at the top
2. Add a `<section>` block following the existing pattern
3. Use token-linked classes on the showcase page itself (`bg-bg-grey`, `text-text-primary`, etc.)

---

## Git Workflow

```bash
# New workshop session
git checkout -b workshop/YYYY-MM-DD

# After generating and reviewing a component
git add .
git commit -m "feat: add [ComponentName] component"
git push origin workshop/YYYY-MM-DD
```

---

## Dev Server

```bash
npm run dev   # starts on port 5174
```

After changing `tailwind.config.ts` or `tokens.css`, always do a full server restart — HMR does not pick up Tailwind config changes reliably.
