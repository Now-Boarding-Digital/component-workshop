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
| `Headings/H1` (size + lh) | `--text-size-heading-h1`, `--text-lh-heading-h1` | `text-heading-h1` |
| `Headings/H2` (size + lh) | `--text-size-heading-h2`, `--text-lh-heading-h2` | `text-heading-h2` |
| `Headings/H3` (size + lh) | `--text-size-heading-h3`, `--text-lh-heading-h3` | `text-heading-h3` |
| `Headings/H4` (size + lh) | `--text-size-heading-h4`, `--text-lh-heading-h4` | `text-heading-h4` |
| `Headings/H5` (size + lh) | `--text-size-heading-h5`, `--text-lh-heading-h5` | `text-heading-h5` |
| `Content/Base` (size + lh) | `--text-size-content-base`, `--text-lh-content-base` | `text-content-base` |
| `Content/Small` (size + lh) | `--text-size-content-small`, `--text-lh-content-small` | `text-content-small` |
| `Content/XSmall` (size + lh) | `--text-size-content-xsmall`, `--text-lh-content-xsmall` | `text-content-xsmall` |
| `Content/Number Field` (size + lh) | `--text-size-content-number`, `--text-lh-content-number` | `text-content-number` |

**Font size classes bundle line-height** — each `text-heading-*` / `text-content-*` class sets both `font-size` and `line-height` via the CSS variable pair. Never set font size or line-height as inline styles; always use these classes.

**Font sizes are responsive** — heading sizes come from the Figma **Responsive** variable collection, not the local text styles. H1–H4 scale down on mobile. The CSS variables are defined at Desktop HD values in `:root` and overridden at `@media (max-width: 767px)` in `tokens.css`. The Tailwind classes (`text-heading-h1` etc.) stay the same at every breakpoint — the variables do the work automatically.

| Style | Desktop | Mobile |
|---|---|---|
| `Headings/H1` | 40px | 36px |
| `Headings/H2` | 32px | 28px |
| `Headings/H3` | 24px | 20px |
| `Headings/H4` | 18px | 16px |
| `Headings/H5` | 12px | 12px |
| `Text/Base`, `Small`, `XSmall` | unchanged | unchanged |

**Source of truth for font sizes**: always fetch from the Figma Responsive collection (not local text styles) using `mcp__figma__use_figma`. Local text styles only carry font weight, line-height, and letter-spacing — not the responsive size values.

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
5. **No inline styles**: use Tailwind classes only — never set `fontFamily`, `color`, `borderRadius`, or similar via the `style` prop
6. **Always use CSS variable classes for fonts**: use `font-body` or `font-heading` (which resolve to `var(--fonts-body)` / `var(--fonts-heading)`) — never write `fontFamily: 'Inter'` or any hardcoded font name. Setting a font name directly as an inline style bypasses the CSS variable chain and will not update if the token changes.
7. **Semantic HTML**: use correct HTML elements (`button`, `nav`, `header`, etc.)
8. **Accessibility**: include `aria-*` attributes and focus states where relevant

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

---

## Figma Variables System

All Figma variables are stored in `src/data/figmaTokens.ts` and rendered in `src/pages/VariablesPage.tsx`. This is the source of truth for design tokens in the project.

### Collections

| Collection | Description | Modes |
|---|---|---|
| System Colours | Primitive color palette (Neutral, Semantic, Social) | Single |
| Theme | Semantic tokens that alias System Colours | Light / Dark |
| Brand | Brand identity: colors, fonts, radius | Single |
| Base Sizes | Spacing scale | Single |
| Responsive | Layout, typography, container values per breakpoint | Desktop HD / Desktop / Tablet / Mobile |

### Data Types

```ts
type ColorValue = { hex: string; alias?: string }   // alias = the System Colour it references
type FloatValue = { value: number; alias?: string }  // alias = the Base Size variable it references
```

Helper shorthands used in the data file:
- `c(hex)` — plain color, no alias
- `a(hex, alias)` — color with a System Colour alias
- `f(value)` — plain float
- `f(value, alias)` — float with a variable alias (e.g. `f(12, 'Spacing/12')`)

### How to Sync Variables from Figma

Use the `mcp__figma__use_figma` tool with the file key `h7IRa1i2N5ucusuhqIhCTJ` to run Plugin API code directly. Do not use `get_variable_defs` — it only returns variables scoped to a selected node.

#### Fetch all collections + resolved hex values

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const variables = await figma.variables.getLocalVariablesAsync();

const varById = {};
for (const v of variables) varById[v.id] = v;

function toHex(c) {
  const r = Math.round(c.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(c.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(c.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function resolveColor(val, depth = 0) {
  if (depth > 5) return { hex: null, alias: null };
  if (val?.type === 'VARIABLE_ALIAS') {
    const ref = varById[val.id];
    if (!ref) return { hex: null, alias: null };
    const modeId = Object.keys(ref.valuesByMode)[0];
    return { hex: resolveColor(ref.valuesByMode[modeId], depth + 1).hex, alias: ref.name };
  }
  if (val && 'r' in val) return { hex: toHex(val), alias: null };
  return { hex: null, alias: null };
}

function resolveFloat(val, depth = 0) {
  if (depth > 5) return { value: null, alias: null };
  if (val?.type === 'VARIABLE_ALIAS') {
    const ref = varById[val.id];
    if (!ref) return { value: null, alias: null };
    const modeId = Object.keys(ref.valuesByMode)[0];
    return { value: resolveFloat(ref.valuesByMode[modeId], depth + 1).value, alias: ref.name };
  }
  if (typeof val === 'number') return { value: val, alias: null };
  return { value: null, alias: null };
}
```

#### Key lessons learned

1. **Always resolve VARIABLE_ALIAS references** — many variables (especially in Theme and Responsive) point to other variables rather than raw values. Dropping unresolved aliases means missing data.
2. **Preserve the alias name alongside the resolved value** — the alias (e.g. `Neutral/Grey 950`, `Spacing/12`) is what tells the reader *why* a token has a particular value. Storing only the hex loses the semantic relationship.
3. **Theme tokens cascade from System Colours** — when a System Colour changes, re-fetch both the System Colours collection AND the Theme collection, then update `figmaTokens.ts`. Use `replace_all` on the old hex value paired with the alias name to update all affected Theme tokens in one edit.
4. **Responsive variables use aliases too** — e.g. `Container Max` on Tablet/Mobile aliases `Screen Width`, and `Field Spacing` aliases `Spacing/12`. Fetch these with `resolveFloat` so the alias is preserved and shown in the table.
5. **The data file is the sync point** — `figmaTokens.ts` is intentionally static (not fetched at runtime). When variables change in Figma, re-run the fetch scripts above and update the file. This keeps the app fast and avoids needing a Figma API token at runtime.

### Updating After a Figma Change

When variables are updated in Figma:

1. Re-fetch the changed collection(s) using the Plugin API scripts above
2. Update `src/data/figmaTokens.ts` with the new values
3. If a System Colour hex changed, also update all Theme tokens that alias it — use `replace_all` on `a('OLD_HEX', 'Colour/Name')` → `a('NEW_HEX', 'Colour/Name')`
4. Check the preview to confirm the Variables page reflects the changes
