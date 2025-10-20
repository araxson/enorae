# Color Tokens Reference

**ONLY these color tokens are allowed. Reference them via Tailwind utilities.**

## Base Colors (8 tokens)
- `bg-background`
- `bg-card`
- `bg-muted`
- `bg-popover`
- `text-card-foreground`
- `text-foreground`
- `text-muted-foreground`
- `text-popover-foreground`

## Semantic Colors (8 tokens)
- `bg-accent`
- `bg-destructive`
- `bg-primary`
- `bg-secondary`
- `text-accent-foreground`
- `text-destructive-foreground`
- `text-primary-foreground`
- `text-secondary-foreground`

## Border & Ring (3 tokens)
- `border-border`
- `border-input`
- `ring-ring`

## Chart Colors (5 tokens)
- `bg-chart-1`
- `bg-chart-2`
- `bg-chart-3`
- `bg-chart-4`
- `bg-chart-5`

## Sidebar Colors (8 tokens)
- `bg-sidebar`
- `bg-sidebar-accent`
- `bg-sidebar-primary`
- `border-sidebar-border`
- `ring-sidebar-ring`
- `text-sidebar-accent-foreground`
- `text-sidebar-foreground`
- `text-sidebar-primary-foreground`

## ❌ Forbidden

- `bg-blue-500`, `text-gray-600`, `border-slate-200`
- Arbitrary hex colors like `bg-[#fff]`, `text-[#000]`
- Any Tailwind palette class not mapped through `app/globals.css`

## Adding New Tokens

1. Propose additions in `app/globals.css`.
2. Update this reference file with the new token.
3. Regenerate metadata via `node scripts/rebuild_rules.mjs`.