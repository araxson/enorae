# UI Analysis - Violation Detection

Scan codebase for UI/styling violations. Update existing report or create new.

## Required Reading

**CRITICAL**: Read these files completely before scanning:
1. **Primary Rules**: `docs/rules/core/ui.md`
2. **Color Tokens**: `app/globals.css` (lines 6-114)
3. **Component Docs**: `docs/shadcn-components/` (component-specific patterns)

**Quick Reference**:
- Rules Index: `docs/rules/01-rules-index.md#ui-*`
- Related: A11Y-H101, A11Y-H102, A11Y-H103

---

## Scan Targets

### Critical Priority
- `features/**/components/**/*.tsx`
- `app/**/*.tsx` (exclude `components/ui/`)

### High Priority
- `components/shared/**/*.tsx`

### EXCLUDE (Protected Files)
- `components/ui/*.tsx` - shadcn/ui registry (NEVER scan)
- `app/globals.css` - Design system tokens (NEVER scan)

---

## Violation Rules

### CRITICAL (P-level)

#### UI-P004: Remove Typography Imports
**Pattern**: Eliminate `@/components/ui/typography` usage; use shadcn slots or design tokens

**Detection**:
```bash
rg "from '@/components/ui/typography'" --glob '!docs/**' --glob '!components/ui/**'
```

**Example Violation**:
```tsx
// ❌ WRONG - typography imports
import { H1, P, Muted } from '@/components/ui/typography'
<H1>Dashboard</H1>
<P>No notifications</P>

// ✅ CORRECT - shadcn Card slots
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
    <CardDescription>No notifications</CardDescription>
  </CardHeader>
</Card>

// ❌ WRONG 
<div className="space-y-2">
  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
  <p className="text-muted-foreground">No notifications</p>
</div>
```

**Reference**: `docs/rules/domains/critical/UI-P004.md`, `docs/rules/domains/ui.md#ui-p004`

---

#### UI-P002: Complete shadcn/ui Compositions
**Pattern**: Composite components MUST include required subcomponents

**Detection**: Manual review for incomplete Dialog/Card/Alert/Sheet compositions

**Example Violation**:
```tsx
// ❌ WRONG - Missing DialogHeader/DialogTitle
<Dialog>
  <DialogContent>Content</DialogContent>
</Dialog>

// ✅ CORRECT - Complete composition
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    Content
  </DialogContent>
</Dialog>
```

**Common Patterns**:
- Dialog → DialogContent → DialogHeader → DialogTitle + DialogDescription
- Card → CardHeader → CardTitle + CardDescription
- Alert → AlertTitle + AlertDescription

**Reference**: `docs/rules/core/ui.md#ui-p002`, `docs/shadcn-components/[component].md`

---

#### UI-P003: shadcn/ui Components Only
**Pattern**: ONLY use `@/components/ui/*` (never custom UI or other libraries)

**Detection**:
```bash
# Custom UI primitives
rg "const.*Button.*=.*<button" --type tsx --glob 'features/**'
rg "<(button|input|select|textarea) className" --type tsx --glob '!components/ui/**'

# Other UI libraries
rg "from ['\"](antd|@mui|react-bootstrap|@headlessui)" --type tsx
```

**Example Violation**:
```tsx
// ❌ WRONG - Custom primitives
const CustomButton = ({ children }) => <button className="...">{children}</button>

// ❌ WRONG - Other libraries
import { Button } from '@mui/material'

// ❌ WRONG - Raw HTML controls
<input type="text" className="border p-2" />

// ✅ CORRECT - shadcn/ui only
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
```

**Reference**: `docs/rules/core/ui.md#ui-p003`, `docs/shadcn-components/`

---


**Detection**:
```bash
# Find deprecated syntax in custom files only
rg "@layer (components|utilities)" --type css --glob '!app/globals.css' --glob '!node_modules/**'
```

**Reference**: `docs/rules/core/ui.md#ui-h101`

---

#### UI-H102: Semantic Color Tokens Only
**Pattern**: ONLY use color tokens from `app/globals.css` (never arbitrary colors)

**Detection**:
```bash
# Arbitrary Tailwind colors (bg-blue-500, text-gray-600, etc.)
rg "bg-(blue|red|green|gray|slate|zinc|neutral|stone|amber|yellow|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]" --type tsx --glob '!components/ui/**'

rg "text-(blue|red|green|gray|slate|zinc|neutral|stone)-[0-9]" --type tsx --glob '!components/ui/**'

rg "border-(blue|red|gray|slate|zinc)-[0-9]" --type tsx --glob '!components/ui/**'

# Arbitrary values (hex, rgb, hsl)
rg "(bg|text|border)-\[#[0-9a-f]{3,6}\]" --type tsx --glob '!components/ui/**'
rg "(bg|text|border)-\[(rgb|hsl)" --type tsx --glob '!components/ui/**'
```

**Example Violation**:
```tsx
// ❌ WRONG - Arbitrary colors
<div className="bg-blue-500 text-white" />
<p className="text-gray-600" />
<Card className="border-slate-200" />
<div className="bg-[#ffffff]" />

// ✅ CORRECT - Semantic tokens from globals.css
<div className="bg-primary text-primary-foreground" />
<p className="text-muted-foreground" />
<Card className="border-border" />
<div className="bg-background" />
```

**Allowed Tokens** (read complete list in `app/globals.css`):
```tsx
// Base
bg-background, text-foreground, border-border, border-input, outline-ring

// Cards/Popovers
bg-card, text-card-foreground, bg-popover, text-popover-foreground

// Interactive
bg-primary, text-primary-foreground
bg-secondary, text-secondary-foreground
bg-accent, text-accent-foreground

// States
bg-muted, text-muted-foreground
text-destructive

// Sidebar (if using Sidebar)
bg-sidebar, text-sidebar-foreground, bg-sidebar-primary, etc.

// Charts (data viz only)
bg-chart-1 through bg-chart-5
```

**CRITICAL**: Any color NOT in `app/globals.css` is a violation.

**Reference**: `docs/rules/core/ui.md#ui-h102`, `app/globals.css`

---

#### UI-H103: Accessible Group Labels
**Pattern**: Grouped controls need `aria-label` or `aria-labelledby`

**Detection**:
```bash
rg "ButtonGroup|ToggleGroup" --type tsx -A 2 | rg -v "aria-label"
```

**Example**:
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
```

**Reference**: `docs/rules/core/ui.md#ui-h103`, `docs/shadcn-components/button-group.md`

---

### MEDIUM PRIORITY (M-level)

#### UI-M301: Container Queries
**Pattern**: Use named container queries for responsive layouts

**Detection**: Manual review of responsive layouts using viewport breakpoints

**Reference**: `docs/rules/core/ui.md#ui-m301`

---

#### UI-M302: Chart Accessibility
**Pattern**: Chart components include `accessibilityLayer` prop

**Detection**:
```bash
rg "(LineChart|BarChart|AreaChart|PieChart)" --type tsx -A 2 | rg -v "accessibilityLayer"
```

**Reference**: `docs/rules/core/ui.md#ui-m302`, `docs/shadcn-components/chart.md`

---

### LOW PRIORITY (L-level)

#### UI-L701: HSL Color Values
**Pattern**: Use `hsl()` in `:root` with `@theme inline`

**Note**: Already correctly implemented in `app/globals.css`

**Reference**: `docs/rules/core/ui.md#ui-l701`

---

## Scanning Strategy

### Priority Order
1. **Critical Pass**: UI-P004, UI-P003, UI-H102 (highest impact)
2. **High Priority**: UI-P002, UI-H103
3. **Medium Priority**: UI-M301, UI-M302
4. **Low Priority**: UI-L701

### Detection Commands

**Quick Scan (Critical Only)**:
```bash
# Typography import violations
rg "from '@/components/ui/typography'" --type tsx --glob 'features/**'

# Custom UI components
rg "<(button|input|select) className" --type tsx --glob 'features/**'

# Arbitrary colors
rg "bg-(blue|red|gray|slate)-[0-9]" --type tsx --glob 'features/**'
```

**Full Scan** (see individual rule Detection sections above)

---

## Output Format

**Location**:
- JSON: `docs/analyze-fixes/ui/analysis-report.json`
- Markdown: `docs/analyze-fixes/ui/analysis-report.md`

**Structure**:
```json
{
  "domain": "ui",
  "timestamp": "2025-10-19T...",
  "summary": {
    "total_violations": 0,
    "by_priority": {"P": 0, "H": 0, "M": 0, "L": 0},
    "by_rule": {"UI-P004": 0, "UI-P002": 0, ...}
  },
  "violations": [
    {
      "rule_id": "UI-P004",
      "priority": "P",
      "file": "features/.../component.tsx",
      "line": 42,
      "code": "import { H1, P } from '@/components/ui/typography'",
      "message": "Typography import. Use shadcn slots (CardTitle, Badge) or design tokens",
      "status": "pending"
    }
  ]
}
```

---

## Execution Workflow

1. **Read Rules**: `docs/rules/core/ui.md` + `app/globals.css`
2. **Read Component Docs**: `docs/shadcn-components/` for patterns
3. **Scan Critical**: UI-P004, UI-P003, UI-H102
4. **Scan High**: UI-P002, UI-H103
5. **Scan Medium/Low**: UI-M301, UI-M302, UI-L701
6. **Generate Report**: JSON + Markdown
7. **Save**: `docs/analyze-fixes/ui/`

**Execute scan now following this workflow.**
