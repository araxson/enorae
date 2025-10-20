# UI Fix - Batch Auto-Fixer

Auto-fix UI violations in batches. Run multiple times to complete all fixes.

## Input Source

**Report**: `docs/analyze-fixes/ui/analysis-report.json`

**Reference Docs**:
- Rules: `docs/rules/core/ui.md`
- Colors: `app/globals.css` (lines 6-114)
- Components: `docs/shadcn-components/[component].md`

---

## Fix Patterns by Rule

### UI-P004: Remove Typography Imports

**Pattern**: Eliminate `@/components/ui/typography` → Use shadcn slots or design tokens

```tsx
// ❌ WRONG - typography imports
import { H1, P, Muted } from '@/components/ui/typography'

<H1>Page Title</H1>
<P>Description text</P>
<Muted>Label</Muted>

// ✅ CORRECT - shadcn Card slots
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Page Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
</Card>

// ✅ CORRECT - semantic HTML + design tokens (when no primitive exists)
<div className="space-y-2">
  <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
  <p className="text-muted-foreground">Description text</p>
</div>
```

**Available shadcn slots** (50+ primitives):
- Card: CardTitle, CardDescription
- Dialog: DialogTitle, DialogDescription
- Alert: AlertTitle, AlertDescription
- Badge, Button, SidebarMenuButton (built-in typography)

**Reference**: `docs/rules/domains/critical/UI-P004.md`, `docs/shadcn-components/[component].md`

---

### UI-P002: Complete Compositions

**Pattern**: Add missing shadcn/ui subcomponents

**Dialog Pattern**:
```tsx
// ❌ WRONG
<Dialog>
  <DialogContent>
    <h2>Title</h2>
    {content}
  </DialogContent>
</Dialog>

// ✅ CORRECT
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Optional description</DialogDescription>
    </DialogHeader>
    {content}
  </DialogContent>
</Dialog>
```

**Card Pattern**:
```tsx
// ❌ WRONG
<Card>
  <h3>Title</h3>
  {content}
</Card>

// ✅ CORRECT
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{content}</CardContent>
  <CardFooter>{actions}</CardFooter>
</Card>
```

**Alert Pattern**:
```tsx
// ✅ CORRECT
<Alert>
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>Alert message</AlertDescription>
</Alert>
```

**Reference**: `docs/shadcn-components/[dialog|card|alert].md`

---

### UI-P003: shadcn/ui Components Only

**Pattern**: Replace custom UI → shadcn/ui imports

**Buttons**:
```tsx
// ❌ WRONG
<button className="px-4 py-2 rounded bg-blue-500">Click</button>

// ✅ CORRECT
import { Button } from '@/components/ui/button'
<Button>Click</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

**Form Inputs**:
```tsx
// ❌ WRONG
<input type="text" className="border rounded p-2" />
<select className="border rounded p-2">...</select>
<textarea className="border rounded p-2" />

// ✅ CORRECT
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

<Input placeholder="Enter text" />
<Select>
  <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
<Textarea placeholder="Enter notes" />
```

**Other Libraries**:
```tsx
// ❌ WRONG
import { Button } from '@mui/material'
import { Input } from 'antd'

// ✅ CORRECT
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
```

**Reference**: `docs/shadcn-components/`, `components/ui/`

---

### UI-H101: Tailwind v4 Utilities

**Pattern**: Convert `@layer components`/`@layer utilities` → `@utility` (if found in custom CSS)

**Context**: Tailwind v4 is already correctly configured:
```css
// app/globals.css (DO NOT EDIT - already correct)
@import "tailwindcss";     // ✅ Tailwind v4 import
@layer base { ... }        // ✅ Still valid
```

**Scope**: Only custom CSS in `features/**/` or `components/shared/**/`
**NEVER edit `app/globals.css`** - protected design system file.

**Fix Pattern** (if violations exist):
```css
/* ❌ WRONG - Deprecated Tailwind v3 syntax */
@layer components {
  .btn-ghost { color: var(--primary); }
}

/* ✅ CORRECT - Tailwind v4 syntax */
@utility btn-ghost {
  color: var(--primary);
  background-color: transparent;
}
```

**Note**: Likely **zero violations** - Tailwind v4 already set up correctly.

---

### UI-H102: Semantic Color Tokens

**Pattern**: Replace arbitrary colors → semantic tokens from `app/globals.css`

**Read `app/globals.css` for complete token list.** Common replacements:

```tsx
// ❌ WRONG → ✅ CORRECT

// Backgrounds
bg-blue-500          → bg-primary
bg-gray-100          → bg-muted
bg-white             → bg-background
bg-gray-50           → bg-card
bg-red-50            → bg-destructive (or use Alert/Badge variants)

// Text
text-white           → text-primary-foreground (with bg-primary)
text-gray-600        → text-muted-foreground
text-gray-900        → text-foreground
text-slate-500       → text-muted-foreground
text-red-500         → text-destructive

// Borders
border-gray-200      → border-border
border-slate-300     → border-input
border-red-500       → border-destructive

// Arbitrary values
bg-[#ffffff]         → bg-background
text-[#000000]       → text-foreground
bg-[rgb(255,0,0)]    → bg-destructive
```

**Context-Aware Replacements**:
```tsx
// Primary CTAs
<Button className="bg-blue-500 text-white">
→ <Button variant="default"> {/* or omit variant */}

// Secondary actions
<Button className="bg-gray-200 text-gray-900">
→ <Button variant="secondary">

// Destructive actions
<Button className="bg-red-500 text-white">
→ <Button variant="destructive">

// Cards/containers
<div className="bg-white border border-gray-200">
→ <div className="bg-card border border-border">

// Muted/subtle content
<div className="bg-gray-50">
→ <div className="bg-muted">

<p className="text-gray-600">
→ <P className="text-muted-foreground">
```

**CRITICAL**: If color doesn't exist in `app/globals.css`:
1. Check if semantic token covers use case
2. Request addition to globals.css
3. NEVER use arbitrary color as workaround

**Reference**: `app/globals.css`, `docs/rules/core/ui.md#ui-h102`

---

### UI-H103: Accessible Group Labels

**Pattern**: Add `aria-label` to grouped controls

```tsx
// ❌ WRONG
<ButtonGroup>
  <Button>List</Button>
  <Button>Grid</Button>
</ButtonGroup>

// ✅ CORRECT
<ButtonGroup aria-label="View mode">
  <Button>List</Button>
  <Button>Grid</Button>
</ButtonGroup>

<ToggleGroup aria-label="Text alignment">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>
```

**Reference**: `docs/shadcn-components/button-group.md`

---

### UI-M301: Container Queries

**Pattern**: Use named container queries

```tsx
// ❌ WRONG - Viewport breakpoints
<div className="flex md:flex-col lg:grid-cols-3">
  {children}
</div>

// ✅ CORRECT - Container queries
<div className="@container/main">
  <section className="flex @sm/main:flex-col @lg/main:grid-cols-3">
    {children}
  </section>
</div>
```

---

### UI-M302: Chart Accessibility

**Pattern**: Add `accessibilityLayer` prop to charts

```tsx
// ❌ WRONG
<LineChart data={data} config={config} />
<BarChart data={data} config={config} />

// ✅ CORRECT
<LineChart accessibilityLayer data={data} config={config} />
<BarChart accessibilityLayer data={data} config={config} />
<AreaChart accessibilityLayer data={data} config={config} />
```

**Reference**: `docs/shadcn-components/chart.md`

---

### UI-L701: HSL Color Format

**Pattern**: Use `hsl()` + `@theme inline`

```css
/* ✅ Already correctly implemented in app/globals.css */
:root {
  --background: oklch(1 0 0);
}

@theme inline {
  --color-background: var(--background);
}
```

**Note**: Only applies if refactoring color system. Current implementation is correct.

---

## Fix Workflow

### Process
1. **Load Report**: Read `docs/analyze-fixes/ui/analysis-report.json`
2. **Priority Sort**: Critical (P) → High (H) → Medium (M) → Low (L)
3. **Batch Fix**: Process 10-20 issues per run
4. **Update Status**: Mark issues as `"status": "fixed"` in JSON
5. **Save Report**: Write updated JSON
6. **Repeat**: Run again if pending issues remain

### Priority Order
```
P (Critical):  UI-P004 → UI-P002 → UI-P003
H (High):      UI-H101 → UI-H102 → UI-H103
M (Medium):    UI-M301 → UI-M302
L (Low):       UI-L701
```

### Import Additions

**Remove Typography Imports** (UI-P004):
```tsx
// ❌ REMOVE
import { H1, P, Muted } from '@/components/ui/typography'

// ✅ ADD shadcn component slots
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
```

**shadcn/ui Components** (UI-P003):
```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
```

---

## Quick Reference

**Color Token Lookup** (`app/globals.css`):
```tsx
// Most common replacements
bg-blue-500 → bg-primary
bg-gray-100 → bg-muted
text-gray-600 → text-muted-foreground
border-gray-200 → border-border
```

**Component Lookup** (`docs/shadcn-components/`):
- Forms: button.md, input.md, select.md, textarea.md, checkbox.md
- Layout: card.md, tabs.md, separator.md, accordion.md
- Feedback: dialog.md, alert.md, toast.md, skeleton.md
- Overlay: popover.md, tooltip.md, dropdown-menu.md

---

## Execution

**Start batch fixing now.**

Fix next 10-20 pending issues from report in priority order.
Update JSON with fixed status after each fix.
