# AI UI Refactoring Instructions - shadcn/ui Component System

**MISSION:** Systematically scan and refactor the entire project to properly use shadcn/ui primitives and design system tokens.

---

## Your Task

You are an AI assistant tasked with refactoring this codebase to follow shadcn/ui best practices. You will:

1. **Scan** the entire project for UI violations
2. **Explore** shadcn/ui using the MCP server (`mcp__shadcn__*` tools)
3. **Refactor** files to use proper shadcn/ui compositions
4. **Fix** all violations systematically

---

## Important: shadcn/ui Accessibility Updates (Nov 2024)

**CRITICAL CHANGE:** As of November 3, 2024, shadcn/ui made significant accessibility improvements:

- **CardTitle** and **CardDescription** now render as `<div>` elements instead of `<h3>` and `<p>`
- This change improves accessibility by allowing developers to control heading hierarchy
- Similar changes may apply to other components (AlertTitle, DialogTitle, SheetTitle, etc.)
- **DO NOT assume semantic HTML elements** - treat all text slots as styled containers

**Why this matters:**
```tsx
// ❌ WRONG ASSUMPTION - CardTitle is NOT an <h3>
<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle> {/* This is a <div>, not <h3> */}
  </CardHeader>
</Card>

// ✅ CORRECT - Add semantic HTML if needed for accessibility
<Card>
  <CardHeader>
    <CardTitle>
      <h2>Dashboard</h2> {/* Add semantic element inside if required */}
    </CardTitle>
  </CardHeader>
</Card>
```

However, in most cases, you should use the slots as-is without adding semantic elements unless specifically required for accessibility.

---

## Critical Refactoring Rules

### RULE 1: Eliminate ALL Custom Typography Wrappers

**SEARCH FOR:**
- Custom typography component imports (from `@/components/ui/typography`)
- Wrapper components for headings (H1, H2, H3, Heading1, Heading2, Title, Subtitle, etc.)
- Wrapper components for text (Text, Paragraph, P, Lead, Muted, Small, Large, etc.)
- Custom font/text size utilities

**DETECTION PATTERN:**
```bash
# Find custom typography imports
rg "from ['\"]@/components/ui/typography['\"]" --type tsx --type ts

# Find usage of custom typography wrappers
rg "\b(H1|H2|H3|H4|H5|H6|Heading[1-6]|Title|Subtitle|Text|Paragraph|P|Lead|Muted|Small|Large)\b" --type tsx -g '!components/ui/**'
```

**ACTION:**
1. Use `mcp__shadcn__get-component-docs` to explore available components
2. Replace custom typography with shadcn/ui slots
3. Remove ALL custom typography wrapper imports

**PATTERN:**

❌ ANTI-PATTERN (Custom wrappers):
```tsx
import { H2, P } from '@/components/ui/typography'

<H2>Dashboard</H2>
<P>Welcome to your dashboard</P>
```

✅ CORRECT PATTERN (shadcn/ui slot composition):
```tsx
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
    <CardDescription>Welcome to your dashboard</CardDescription>
  </CardHeader>
</Card>
```

---

### RULE 2: NEVER Customize Component Slot Styling

**SEARCH FOR:**
- Typography classes on component slots (`text-{size}`, `font-{weight}`, `text-{color}`)
- Font customization on slots designed to have preset styling
- Color overrides on semantic component slots

**DETECTION PATTERN:**
```bash
# Find slots with text sizing customization
rg "(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|DialogDescription|SheetTitle|SheetDescription).*className.*(text-[a-z0-9]+|font-[a-z]+)" --type tsx

# Find slots with color customization
rg "(CardTitle|CardDescription|AlertTitle|AlertDescription).*className.*(text-\[|bg-\[)" --type tsx
```

**ACTION:**
1. Remove ALL typography/font/color classes from component slots
2. Keep ONLY layout/spacing classes (flex, gap, padding, margin, grid)
3. Let shadcn/ui slots use their built-in sizing and styling

**PATTERN:**

❌ ANTI-PATTERN (Customized slots):
```tsx
<CardTitle className="text-2xl font-bold text-primary">
  Welcome
</CardTitle>
<CardDescription className="text-lg text-gray-500">
  Get started
</CardDescription>
```

✅ CORRECT PATTERN (Unchanged slots):
```tsx
<CardTitle>Welcome</CardTitle>
<CardDescription>Get started</CardDescription>
```

✅ LAYOUT CLASSES OK:
```tsx
<CardHeader className="flex flex-row items-center justify-between gap-4">
  <CardTitle>Welcome</CardTitle>
  <Badge>New</Badge>
</CardHeader>
```

---

### RULE 3: Use Complete Component Compositions

**SEARCH FOR:**
- Incomplete component structures (missing required subcomponents)
- Direct HTML children inside component containers
- Manual markup bypassing component composition patterns

**DETECTION PATTERN:**
```bash
# Find Cards with direct HTML heading children
rg "<Card[^>]*>.*<h[1-6]" --type tsx

# Find Cards with direct paragraph children
rg "<Card[^>]*>.*<p>" --type tsx

# Find incomplete compositions
rg "<Card[^>]*>\s*<[^C]" --type tsx
```

**ACTION:**
1. Use `mcp__shadcn__get-component-docs` to check correct composition structure
2. Add missing subcomponents (CardHeader, CardContent, CardFooter, etc.)
3. Follow shadcn/ui composition patterns exactly

**PATTERN:**

❌ ANTI-PATTERN (Incomplete structure):
```tsx
<Card>
  <h2>Title</h2>
  <p>Description</p>
  <div>Content</div>
</Card>
```

✅ CORRECT PATTERN (Complete composition):
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

---

### RULE 4: Maximize shadcn/ui Primitive Usage

**ACTION:**
Before creating ANY custom markup, explore shadcn/ui:

1. **List Available Components:**
   ```bash
   # Use MCP to list all components
   mcp__shadcn__list-components
   ```

2. **Get Component Documentation:**
   ```bash
   # Get detailed docs for specific components
   mcp__shadcn__get-component-docs --component card
   mcp__shadcn__get-component-docs --component alert
   mcp__shadcn__get-component-docs --component dialog
   ```

3. **Match Patterns:**
   - Content cards → `Card` with `CardHeader`, `CardContent`, `CardFooter`
   - Callouts/notices → `Alert` with `AlertTitle`, `AlertDescription`
   - Modals → `Dialog` with `DialogContent`, `DialogHeader`, `DialogTitle`, etc.
   - Side panels → `Sheet` with `SheetContent`, `SheetHeader`, `SheetTitle`, etc.
   - Collapsible sections → `Accordion` with `AccordionItem`, `AccordionTrigger`, `AccordionContent`
   - Tabbed content → `Tabs` with `TabsList`, `TabsTrigger`, `TabsContent`
   - Forms → `Form` with `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`

**COMMON REPLACEMENTS:**
- Custom card layouts → `Card` component with proper slots
- Custom alert boxes → `Alert` component with `AlertTitle` and `AlertDescription`
- Custom dialogs/modals → `Dialog` component with proper composition
- Custom dropdowns → `DropdownMenu` or `Select` components
- Custom accordions → `Accordion` component
- Custom tabs → `Tabs` component

---

### RULE 5: Use Design Tokens Only

**SEARCH FOR:**
- Arbitrary color utilities: `(bg|text|border)-(blue|red|green|gray|slate)-{number}`
- Hex color values: `{prefix}-[#000000]`
- RGB color values: `{prefix}-[rgb(0,0,0)]`
- Arbitrary spacing values: `{prefix}-[{number}px]`

**DETECTION PATTERN:**
```bash
# Find arbitrary color utilities
rg "(bg|text|border)-(blue|red|green|yellow|purple|pink|indigo|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-[0-9]{2,3}" --type tsx

# Find hex colors
rg "className=.*\[#[0-9a-fA-F]{3,6}\]" --type tsx

# Find RGB colors
rg "className=.*\[rgb\(" --type tsx

# Find arbitrary spacing
rg "className=.*\[[0-9]+px\]" --type tsx
```

**ACTION:**
Replace with approved design system tokens from `app/globals.css`:

**SEMANTIC TOKENS (shadcn/ui standard):**
- Background: `bg-background`, `bg-foreground`, `bg-card`, `bg-popover`, `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-destructive`
- Text: `text-foreground`, `text-background`, `text-card-foreground`, `text-primary`, `text-primary-foreground`, `text-secondary`, `text-secondary-foreground`, `text-muted-foreground`, `text-accent-foreground`, `text-destructive`, `text-destructive-foreground`
- Border: `border-border`, `border-input`, `border-ring`, `border-primary`, `border-secondary`
- Chart: `bg-chart-1`, `bg-chart-2`, `bg-chart-3`, `bg-chart-4`, `bg-chart-5`
- Sidebar: `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-primary`, `text-sidebar-primary-foreground`

**PATTERN:**

❌ ANTI-PATTERN (Arbitrary values):
```tsx
<div className="bg-blue-500 text-white border-gray-300 p-[24px]">
  <h2 className="text-red-600 text-[18px]">Alert</h2>
</div>
```

✅ CORRECT PATTERN (Design tokens):
```tsx
<Alert variant="destructive">
  <AlertTitle>Alert</AlertTitle>
</Alert>
```

---

## Step-by-Step Refactoring Workflow

### PHASE 1: Project Scanning

**Step 1: Scan for Custom Typography Violations**
```bash
rg "from ['\"]@/components/ui/typography['\"]" --type tsx --type ts
rg "\b(H1|H2|H3|H4|H5|H6|P|Lead|Muted|Small|Large)\b" --type tsx -g '!components/ui/**'
```

**Step 2: Scan for Slot Customization**
```bash
rg "(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|DialogDescription|SheetTitle|SheetDescription|AccordionTrigger).*className.*(text-|font-)" --type tsx
```

**Step 3: Scan for Arbitrary Values**
```bash
rg "(bg|text|border)-(blue|red|green|gray|slate|zinc)-[0-9]+" --type tsx
rg "className=.*\[#[0-9a-fA-F]{3,6}\]" --type tsx
rg "className=.*\[[0-9]+px\]" --type tsx
```

**Step 4: Scan for Incomplete Compositions**
```bash
rg "<Card[^>]*>.*<h[1-6]" --type tsx
rg "<Alert[^>]*>.*<h[1-6]" --type tsx
rg "<Dialog[^>]*>.*<h[1-6]" --type tsx
```

---

### PHASE 2: shadcn/ui Exploration

**Use MCP Tools to Explore:**
```typescript
// List all available components
await mcp__shadcn__list_components()

// Get documentation for specific components
await mcp__shadcn__get_component_docs({ component: 'card' })
await mcp__shadcn__get_component_docs({ component: 'alert' })
await mcp__shadcn__get_component_docs({ component: 'dialog' })
await mcp__shadcn__get_component_docs({ component: 'sheet' })
await mcp__shadcn__get_component_docs({ component: 'accordion' })
await mcp__shadcn__get_component_docs({ component: 'tabs' })
await mcp__shadcn__get_component_docs({ component: 'form' })
```

**Component Discovery Checklist:**
- [x] Card (CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- [x] Alert (AlertTitle, AlertDescription)
- [x] Dialog (DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter)
- [x] Sheet (SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription)
- [x] Accordion (AccordionItem, AccordionTrigger, AccordionContent)
- [x] Tabs (TabsList, TabsTrigger, TabsContent)
- [x] Form (FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage)
- [x] Badge, Button, Separator, Skeleton, Avatar, Progress
- [x] DropdownMenu, Select, Combobox
- [x] Table (TableHeader, TableBody, TableRow, TableHead, TableCell)

---

### PHASE 3: Systematic File Refactoring

**For Each Violation Found:**

1. **Read the file** to understand current implementation
2. **Identify UI patterns** needing refactoring
3. **Match patterns to components** using `mcp__shadcn__get-component-docs`
4. **Refactor the code** following these sub-steps:
   - Remove custom typography imports
   - Add missing component subcomponents
   - Remove custom styling from slots
   - Replace arbitrary values with design tokens
   - Restructure to match shadcn/ui composition pattern
5. **Apply changes** using edit tools
6. **Verify** the refactoring maintains functionality

**Priority Order:**
1. Feature components (highest user visibility)
2. Page components (user-facing routes)
3. Shared/common components (reusable utilities)
4. Layout components (structural wrappers)

---

### PHASE 4: Common Refactoring Patterns

**Pattern 1: Replace Custom Text Wrappers with shadcn/ui Slots**

BEFORE (custom wrappers):
```tsx
import { H2, P } from '@/components/ui/typography'

function MyComponent() {
  return (
    <div>
      <H2>Title</H2>
      <P>Description text</P>
    </div>
  )
}
```

AFTER (shadcn/ui slots):
```tsx
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description text</CardDescription>
      </CardHeader>
    </Card>
  )
}
```

---

**Pattern 2: Fix Incomplete Component Structures**

BEFORE (incomplete):
```tsx
<Card>
  <h3>My Title</h3>
  <p>Some description</p>
  <div>Content here</div>
</Card>
```

AFTER (complete composition):
```tsx
<Card>
  <CardHeader>
    <CardTitle>My Title</CardTitle>
    <CardDescription>Some description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

---

**Pattern 3: Remove Slot Customization**

BEFORE (customized slots):
```tsx
<CardTitle className="text-2xl font-bold text-primary">
  Dashboard
</CardTitle>
<CardDescription className="text-lg text-muted-foreground">
  Welcome back
</CardDescription>
```

AFTER (unchanged slots):
```tsx
<CardTitle>Dashboard</CardTitle>
<CardDescription>Welcome back</CardDescription>
```

---

**Pattern 4: Replace Arbitrary Values with Design Tokens**

BEFORE (arbitrary values):
```tsx
<div className="bg-blue-500 text-white border-gray-300">
  <h2 className="text-red-600">Alert</h2>
</div>
```

AFTER (design tokens):
```tsx
<Alert variant="destructive">
  <AlertTitle>Alert</AlertTitle>
</Alert>
```

---

**Pattern 5: Use shadcn/ui Blocks for Complex Layouts**

shadcn/ui provides pre-built blocks for common patterns. Use `mcp__shadcn__list-blocks` to explore available blocks for:
- Login/Signup forms
- Sidebars
- Authentication flows
- OTP inputs

---

## Execution Instructions for AI

**START HERE:** When you receive this document, follow these steps:

### Step 1: Initial Scan
Run detection patterns from PHASE 1 to identify violations across the project.

### Step 2: Explore shadcn/ui
1. Use `mcp__shadcn__list-components` to see all components
2. Use `mcp__shadcn__get-component-docs` for each component type
3. **Check changelog sections** in component docs for recent updates
4. Understand composition patterns
5. Identify text slots (never customize these)
6. Note that text slots (CardTitle, CardDescription, etc.) are `<div>` elements, not semantic HTML

### Step 3: Prioritize Violations
Create a list of files with violations, sorted by:
1. **Critical** — Custom typography wrappers, slot customization
2. **High** — Arbitrary colors, arbitrary spacing
3. **Medium** — Incomplete compositions
4. **Low** — Minor composition improvements

### Step 4: Refactor Systematically
For each file:
1. Read the file
2. Identify all violations
3. Use MCP to find best component match
4. Apply refactoring patterns
5. Edit the file
6. Move to next file

### Step 5: Verify
After refactoring a batch of files:
- Re-run detection patterns
- Ensure no new violations introduced
- Check that functionality is preserved
- Verify design tokens are used correctly

---

## shadcn/ui Component Pattern Reference

**Card Pattern:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    {/* CardTitle and CardDescription are <div> elements (Nov 2024 update) */}
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

**Note:** As of Nov 3, 2024, CardTitle and CardDescription use `<div>` instead of `<h3>` and `<p>` for better accessibility. This allows you to control heading hierarchy in your application

**Alert Pattern:**
```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

<Alert>
  <Terminal className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
</Alert>
```

**Dialog Pattern:**
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

**Sheet Pattern:**
```tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

**Accordion Pattern:**
```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**Tabs Pattern:**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

**Form Pattern:**
```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>Your public display name.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

## Common Violations & Fixes

### Violation Type 1: Custom Typography Imports

**Detection:**
```bash
rg "from ['\"]@/components/ui/typography['\"]"
```

**Fix Strategy:**
1. Remove the custom typography import
2. Find matching shadcn/ui slot from MCP docs
3. Restructure to proper component composition
4. Ensure complete composition (no missing subcomponents)

---

### Violation Type 2: Slot Styling Customization

**Detection:**
```bash
rg "(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|DialogDescription).*className.*(text-|font-|color)"
```

**Fix Strategy:**
1. Remove all text sizing classes (`text-sm`, `text-lg`, `text-2xl`, etc.)
2. Remove all font weight classes (`font-bold`, `font-semibold`, etc.)
3. Remove all color classes (arbitrary or token-based)
4. Keep ONLY layout/spacing classes (`flex`, `gap-4`, `p-2`, `grid`, etc.)

---

### Violation Type 3: Arbitrary Design Values

**Detection:**
```bash
rg "(bg|text|border)-(blue|red|green|gray|slate|zinc)-[0-9]+"
rg "className=.*\[#[0-9a-fA-F]"
rg "className=.*\[[0-9]+px\]"
```

**Fix Strategy:**
1. Map arbitrary colors to semantic design tokens:
   - `bg-blue-500` → `bg-primary` or `bg-accent`
   - `text-red-600` → `text-destructive`
   - `bg-gray-100` → `bg-muted`
   - `text-gray-500` → `text-muted-foreground`
2. Replace arbitrary spacing with design system scale
3. Use component variants when available (Alert `variant="destructive"`)

---

### Violation Type 4: Incomplete Compositions

**Detection:**
```bash
rg "<Card[^>]*>.*<h[1-6]"
rg "<Card[^>]*>.*<p[^>]*>"
```

**Fix Strategy:**
1. Add missing CardHeader wrapper
2. Replace `<h1-6>` with CardTitle
3. Replace `<p>` with CardDescription
4. Wrap remaining content in CardContent
5. Add CardFooter if needed

---

## Complete Refactoring Examples

### Example 1: Stat Display

**BEFORE (custom wrappers + arbitrary values):**
```tsx
import { H2, P, Small } from '@/components/ui/typography'

export function Stats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-6 bg-blue-100 rounded-lg">
        <Small className="text-gray-600">Total Sales</Small>
        <H2 className="text-blue-600">$12,345</H2>
        <P className="text-sm text-green-600">+12% from last month</P>
      </div>
    </div>
  )
}
```

**AFTER (shadcn/ui + design tokens):**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function Stats() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Sales</CardDescription>
          <CardTitle>$12,345</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary">+12% from last month</Badge>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### Example 2: Error Message

**BEFORE (manual markup + arbitrary colors):**
```tsx
<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
  <h3 className="font-bold text-lg">Error</h3>
  <p className="text-sm">Something went wrong. Please try again.</p>
</div>
```

**AFTER (shadcn/ui):**
```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
</Alert>
```

---

### Example 3: Confirmation Dialog

**BEFORE (manual markup + arbitrary values):**
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div className="bg-white rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
    <p className="text-gray-600 mb-6">Are you sure you want to proceed?</p>
    <div className="flex gap-2">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Confirm</button>
      <button className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
    </div>
  </div>
</div>
```

**AFTER (shadcn/ui):**
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure you want to proceed?</DialogDescription>
    </DialogHeader>
    <DialogFooter className="gap-2">
      <Button>Confirm</Button>
      <Button variant="outline">Cancel</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Refactoring Checklist

Before marking a file as "fixed":
- [ ] No custom typography wrapper imports from `@/components/ui/typography`
- [ ] No custom heading/text components (H1, H2, H3, P, Lead, Muted, etc.)
- [ ] All shadcn/ui text slots use default styling (no text-*, font-*, color customization)
- [ ] Only layout/spacing classes on component wrappers (flex, gap, padding, grid, margin)
- [ ] All component compositions include required subcomponents per shadcn/ui docs
- [ ] No arbitrary color utilities (only design system tokens)
- [ ] No hex colors or RGB values
- [ ] No arbitrary spacing values (only design system scale)
- [ ] Semantic HTML with design tokens ONLY when NO shadcn/ui primitive exists
- [ ] Accessibility attributes preserved or added
- [ ] Component variants used appropriately

---

## MCP Tools Reference

**List all shadcn/ui components:**
```typescript
mcp__shadcn__list_components()
```

**Get component documentation:**
```typescript
mcp__shadcn__get_component_docs({ component: 'card' })
mcp__shadcn__get_component_docs({ component: 'alert' })
mcp__shadcn__get_component_docs({ component: 'dialog' })
```

**List available blocks:**
```typescript
mcp__shadcn__list_blocks()
```

**Get block documentation:**
```typescript
mcp__shadcn__get_block_docs({ block: 'sidebar-01' })
```

**IMPORTANT:** Always check component documentation for changelog entries. Component APIs and element types may change for accessibility improvements. When fetching component docs via MCP, look for "## Changelog" sections to stay updated on breaking changes and best practices

---

## AI Workflow Summary

**5-Step Systematic Refactoring Process:**

1. **SCAN** → Run detection patterns to find violations
   - Custom typography imports
   - Slot customization
   - Arbitrary values
   - Incomplete compositions

2. **EXPLORE** → Study shadcn/ui documentation via MCP
   - List all available primitives
   - Get component docs for each type
   - Understand composition patterns
   - Identify text slots (never customize)

3. **MATCH** → Map UI patterns to shadcn/ui components
   - Stat displays → Card with CardHeader, CardTitle, CardDescription
   - Alerts → Alert with AlertTitle, AlertDescription
   - Modals → Dialog with DialogContent, DialogHeader, DialogTitle
   - Side panels → Sheet with SheetContent, SheetHeader, SheetTitle
   - Forms → Form with FormField, FormItem, FormLabel, FormControl

4. **REFACTOR** → Apply systematic patterns
   - Remove custom wrappers
   - Complete compositions
   - Remove slot customization
   - Replace arbitrary values with tokens

5. **VERIFY** → Validate changes
   - Re-run detection patterns
   - Check design tokens are used
   - Ensure functionality preserved
   - Verify accessibility maintained

---

**Remember:** Your goal is to maximize shadcn/ui primitive usage and eliminate ALL custom typography wrappers and slot styling customizations. Every UI pattern should map to a shadcn/ui primitive using exact patterns from the official documentation.

---

**Last Updated:** 2025-10-19
**Based on:** shadcn/ui official documentation via MCP server

**Key Resources:**
- Official Documentation: https://ui.shadcn.com/docs
- Changelog: https://ui.shadcn.com/docs/changelog (check for breaking changes and updates)
- Component Docs: Access via `mcp__shadcn__get-component-docs` (includes changelog sections)

**Recent Important Changes:**
- **Nov 3, 2024:** CardTitle and CardDescription changed from `<h3>`/`<p>` to `<div>` for accessibility
- Always check component docs for changelog entries when refactoring
