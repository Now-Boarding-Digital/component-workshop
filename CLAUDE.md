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

## Component Rules

Every component Claude generates must follow these rules:

1. **File location**: `src/components/[ComponentName]/index.tsx`
2. **Named props interface**: always export a `[ComponentName]Props` interface
3. **Default export**: the component itself is the default export
4. **No inline styles**: use Tailwind classes only
5. **Semantic HTML**: use correct HTML elements (`button`, `nav`, `header`, etc.)
6. **Accessibility**: include `aria-*` attributes and focus states where relevant
7. **No hardcoded colors**: use Tailwind's palette or extend `tailwind.config.ts`

---

## Prompt Template

Use this at the start of every new component session:

```
We are building a React component library.
Stack: React 18, TypeScript (strict), Tailwind CSS v3, Vite.
Rules:
- File goes in src/components/[Name]/index.tsx
- Export a named [Name]Props interface
- Default export the component
- Tailwind only, no inline styles
- Semantic HTML and basic accessibility

Here is the Figma frame to match: [PASTE FIGMA URL]

Generate the component.
```

---

## Adding a Component to the Showcase

After generating a component, add it to `src/pages/ComponentShowcase.tsx`:

1. Import it at the top
2. Add a `<section>` block following the existing pattern
3. Run `npm run dev` to preview

---

## Git Workflow

```bash
# Start a new component
git checkout -b component/[component-name]

# After generating and reviewing
git add .
git commit -m "feat: add [ComponentName] component"
git push origin component/[component-name]

# Then open a PR for Nate to review
```

---

## Design Tokens

As you identify colors, spacing, and typography from Figma, add them to
`tailwind.config.ts` under `theme.extend` rather than using arbitrary
Tailwind values like `bg-[#FF0000]`.

Example:
```ts
colors: {
  brand: {
    primary: '#1A1A2E',
    accent: '#E94560',
  }
}
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
