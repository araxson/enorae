# shadcn/ui Components Reference

## Critical Rules

1. Use installed components exactly as exported from `@/components/ui/*` (UI-P003).
2. Read local docs in `docs/shadcn-components/` before modifying compositions.
3. Never edit files under `components/ui` directly—compose in features instead.
4. Include required subcomponents when rendering composites (UI-P002).
5. Propose new primitives via ADR before installing additional components.

## Installed Components

### Feedback & Data

- `Alert` — [docs/shadcn-components/alert.md](../../shadcn-components/alert.md)
- `Badge` — [docs/shadcn-components/badge.md](../../shadcn-components/badge.md)
- `Chart` — [docs/shadcn-components/chart.md](../../shadcn-components/chart.md)
- `Empty` — [docs/shadcn-components/empty.md](../../shadcn-components/empty.md)
- `Progress` — [docs/shadcn-components/progress.md](../../shadcn-components/progress.md)
- `Skeleton` — [docs/shadcn-components/skeleton.md](../../shadcn-components/skeleton.md)
- `Spinner` — [docs/shadcn-components/spinner.md](../../shadcn-components/spinner.md)
- `Table` — [docs/shadcn-components/table.md](../../shadcn-components/table.md)

### Forms

- `Button` — [docs/shadcn-components/button.md](../../shadcn-components/button.md)
- `Button Group` — [docs/shadcn-components/button-group.md](../../shadcn-components/button-group.md)
- `Checkbox` — [docs/shadcn-components/checkbox.md](../../shadcn-components/checkbox.md)
- `Combobox` — [docs/shadcn-components/combobox.md](../../shadcn-components/combobox.md)
- `Command` — [docs/shadcn-components/command.md](../../shadcn-components/command.md)
- `Field` — [docs/shadcn-components/field.md](../../shadcn-components/field.md)
- `Form` — [docs/shadcn-components/form.md](../../shadcn-components/form.md)
- `Input` — [docs/shadcn-components/input.md](../../shadcn-components/input.md)
- `Input Group` — [docs/shadcn-components/input-group.md](../../shadcn-components/input-group.md)
- `Input Otp` — [docs/shadcn-components/input-otp.md](../../shadcn-components/input-otp.md)
- `Radio Group` — [docs/shadcn-components/radio-group.md](../../shadcn-components/radio-group.md)
- `Select` — [docs/shadcn-components/select.md](../../shadcn-components/select.md)
- `Slider` — [docs/shadcn-components/slider.md](../../shadcn-components/slider.md)
- `Switch` — [docs/shadcn-components/switch.md](../../shadcn-components/switch.md)
- `Textarea` — [docs/shadcn-components/textarea.md](../../shadcn-components/textarea.md)
- `Toggle` — [docs/shadcn-components/toggle.md](../../shadcn-components/toggle.md)
- `Toggle Group` — [docs/shadcn-components/toggle-group.md](../../shadcn-components/toggle-group.md)

### Layout

- `Accordion` — [docs/shadcn-components/accordion.md](../../shadcn-components/accordion.md)
- `Aspect Ratio` — [docs/shadcn-components/aspect-ratio.md](../../shadcn-components/aspect-ratio.md)
- `Calendar` — [docs/shadcn-components/calendar.md](../../shadcn-components/calendar.md)
- `Card` — [docs/shadcn-components/card.md](../../shadcn-components/card.md)
- `Carousel` — [docs/shadcn-components/carousel.md](../../shadcn-components/carousel.md)
- `Collapsible` — [docs/shadcn-components/collapsible.md](../../shadcn-components/collapsible.md)
- `Hover Card` — [docs/shadcn-components/hover-card.md](../../shadcn-components/hover-card.md)
- `Resizable` — [docs/shadcn-components/resizable.md](../../shadcn-components/resizable.md)
- `Separator` — [docs/shadcn-components/separator.md](../../shadcn-components/separator.md)
- `Sidebar` — [docs/shadcn-components/sidebar.md](../../shadcn-components/sidebar.md)

### Navigation

- `Breadcrumb` — [docs/shadcn-components/breadcrumb.md](../../shadcn-components/breadcrumb.md)
- `Menubar` — [docs/shadcn-components/menubar.md](../../shadcn-components/menubar.md)
- `Navigation Menu` — [docs/shadcn-components/navigation-menu.md](../../shadcn-components/navigation-menu.md)
- `Pagination` — [docs/shadcn-components/pagination.md](../../shadcn-components/pagination.md)
- `Tabs` — [docs/shadcn-components/tabs.md](../../shadcn-components/tabs.md)

### Overlay

- `Alert Dialog` — [docs/shadcn-components/alert-dialog.md](../../shadcn-components/alert-dialog.md)
- `Context Menu` — [docs/shadcn-components/context-menu.md](../../shadcn-components/context-menu.md)
- `Dialog` — [docs/shadcn-components/dialog.md](../../shadcn-components/dialog.md)
- `Drawer` — [docs/shadcn-components/drawer.md](../../shadcn-components/drawer.md)
- `Dropdown Menu` — [docs/shadcn-components/dropdown-menu.md](../../shadcn-components/dropdown-menu.md)
- `Popover` — [docs/shadcn-components/popover.md](../../shadcn-components/popover.md)
- `Sheet` — [docs/shadcn-components/sheet.md](../../shadcn-components/sheet.md)
- `Sonner` — [docs/shadcn-components/sonner.md](../../shadcn-components/sonner.md)
- `Tooltip` — [docs/shadcn-components/tooltip.md](../../shadcn-components/tooltip.md)

### Utilities

- `Avatar` — [docs/shadcn-components/avatar.md](../../shadcn-components/avatar.md)
- `Item` — [docs/shadcn-components/item.md](../../shadcn-components/item.md)
- `Kbd` — [docs/shadcn-components/kbd.md](../../shadcn-components/kbd.md)
- `Label` — [docs/shadcn-components/label.md](../../shadcn-components/label.md)
- `Scroll Area` — [docs/shadcn-components/scroll-area.md](../../shadcn-components/scroll-area.md)

## Usage Checklist

1. Confirm the component exists: `ls components/ui/<component>.tsx`.
2. Review local docs for variants and required subcomponents.
3. Compose in feature-level components; do not alter the base implementation.
4. Apply styling via `className` using tokens from `app/globals.css`.
5. Re-run `node scripts/rebuild_rules.mjs` after adding new components.