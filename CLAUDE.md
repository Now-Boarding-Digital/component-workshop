# CLAUDE.md — Component Workshop

This file gives Claude Code the context it needs to generate consistent
components in this project. Keep it open or reference it at the start
of every Claude Code session.

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
