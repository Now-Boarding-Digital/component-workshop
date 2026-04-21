# Component Workshop

A shared React component workspace for designer-developer collaboration.
Components are generated from Figma designs using Claude Code and previewed live.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the component showcase.

## For the Designer

Read `CLAUDE.md` before starting. It has:
- The prompt template to use with Claude Code
- Component rules to follow
- Git workflow for submitting components for review

## Project Structure

```
src/
  components/       # One folder per component
    Button/
      index.tsx
  pages/
    ComponentShowcase.tsx   # Add new components here to preview them
  main.tsx
  index.css
CLAUDE.md           # Claude Code conventions — read this first
tailwind.config.ts  # Add design tokens here
```

## Adding a New Component

1. Branch: `git checkout -b component/[name]`
2. Generate with Claude Code using the prompt template in `CLAUDE.md`
3. Import and add to `ComponentShowcase.tsx`
4. Preview at localhost:5173
5. Commit and open a PR
