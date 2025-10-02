# Clean shadcn/ui Component Overrides

Remove redundant inline styling and custom overrides from shadcn/ui components throughout the codebase to ensure consistent usage of component defaults.

## Objective

Audit all shadcn/ui component usage and remove extra custom styling that was added on top of default shadcn components.

## Process

1. **Read component defaults** - Read actual shadcn component source files in `components/ui/` to understand their default classes
2. **Audit usage** - Search through `features/` for all shadcn component usage patterns
3. **Identify overrides** - Find classes that duplicate defaults or override component styling
4. **Remove redundant classes** - Clean up duplicate default classes and design overrides
5. **Preserve layout utilities** - Keep classes for positioning, sizing, and layout
6. **Verify cleanup** - Confirm all components use pure defaults with only intentional customizations

## What to Remove

### Redundant Defaults
- Classes already included in component defaults (check component source)
- Duplicate spacing, sizing, or styling that components already provide

### Design Overrides
- Custom background colors on components with default backgrounds
- Custom border colors and border widths
- Custom text colors (except semantic/contextual requirements)
- Custom shadows, transitions, and hover states
- Font weight overrides on typography components

### Interaction Overrides
- `cursor-pointer` on interactive components
- Custom `transition-*` classes
- Custom `hover:*` states

## What to Keep

### Layout & Structural Classes
- Width/height constraints: `w-full`, `max-w-*`, `min-w-*`, `h-full`, `flex-1`
- Positioning: `relative`, `absolute`, `fixed`, `top-*`, `left-*`
- Display: `block`, `inline-block`, `hidden`
- Overflow: `overflow-hidden`, `overflow-auto`

### Flexbox & Grid Utilities
- Layout: `flex`, `grid`, `flex-col`, `flex-row`
- Alignment: `items-center`, `justify-between`, `gap-*`

### Typography Utilities
- Alignment: `text-center`, `text-right`, `text-left`
- Line control: `leading-*`, `line-clamp-*`, `tracking-*`
- Whitespace: `whitespace-*`, `truncate`

### Semantic/Contextual Colors
- Foreground colors required by background context (e.g., `text-primary-foreground` with `bg-primary`)
- Semantic colors for specific purposes (e.g., `text-destructive` for errors)
- `text-muted-foreground` when used semantically for body text

## Methodology

### Discovery Phase
- Use `grep` to find components with className props
- Read component source files to understand defaults
- Identify patterns of override usage

### Cleanup Phase
- Process one component type at a time (Badge, Card, Typography, etc.)
- Use bash scripts for batch replacements when appropriate
- Test each change to ensure no visual regressions

### Verification Phase
- Search for remaining overrides using grep patterns
- Verify components render correctly with defaults
- Confirm only layout utilities remain

## Component Strategy

### Components with Variants
- Use built-in variants instead of custom classes
- Remove any styling that variants already provide
- Only add layout utilities, never styling classes

### Typography Components
- Remove font-weight overrides (check defaults first)
- Keep only semantic color applications
- Preserve layout and spacing utilities

### Container Components
- Remove custom colors and borders
- Keep structural classes (overflow, positioning)
- Preserve intentional spacing adjustments

## Guidelines

- **Check defaults first** - Always read the component source before removing classes
- **Preserve semantics** - Keep colors when they serve a semantic purpose
- **Layout only** - className should primarily contain layout/positioning, not styling
- **Use variants** - Prefer component variants over custom classes
- **Batch operations** - Use scripts for repetitive patterns across multiple files
- **Test thoroughly** - Verify visual consistency after cleanup

## Success Criteria

- All shadcn components use default styling where appropriate
- Custom classes limited to layout, positioning, and semantic requirements
- No redundant classes that duplicate component defaults
- Styling controlled through component variants, not inline classes
- Consistent component usage across the codebase

## Deliverables

Provide a summary report:
- Number of files modified
- Component types cleaned
- Classes removed by category
- Verification that overrides are eliminated
