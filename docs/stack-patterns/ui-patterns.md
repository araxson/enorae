# UI Patterns - shadcn/ui Rules

**STRICT ENFORCEMENT: Use shadcn/ui components exclusively. NO custom styles. NO typography wrappers.**

---

## 🔴 ABSOLUTE REQUIREMENTS - NON-NEGOTIABLE

### Rule 1: NO Custom Styles - shadcn Components ONLY
**Use ONLY shadcn/ui primitives. Custom styling is FORBIDDEN.**

```tsx
// ❌ FORBIDDEN - Custom markup with manual styles
<div className="rounded-lg border-2 border-blue-500 p-6 bg-white shadow-lg">
  <h3 className="text-2xl font-bold text-gray-900">Title</h3>
  <p className="text-gray-600 mt-2">Description text</p>
</div>

// ✅ REQUIRED - shadcn Card primitive
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
</Card>
```

### Rule 2: NO Wrappers in Component Slots
**Component slots already provide styling. Render PLAIN TEXT only.**

```tsx
// ❌ FORBIDDEN - Wrapping slot content
<CardTitle>
  <span className="text-2xl font-bold text-primary">Title Text</span>
</CardTitle>

<AlertDescription>
  <p className="text-sm text-gray-700">Message here</p>
</AlertDescription>

<SidebarMenuItem>
  <span className="font-medium text-base">Menu Item</span>
</SidebarMenuItem>

// ✅ REQUIRED - Plain text in slots
<CardTitle>Title Text</CardTitle>
<AlertDescription>Message here</AlertDescription>
<SidebarMenuItem>Menu Item</SidebarMenuItem>
```

**Affected slots (render plain text):**
- `CardTitle`, `CardDescription`
- `AlertTitle`, `AlertDescription`
- `DialogTitle`, `DialogDescription`
- `SheetTitle`, `SheetDescription`
- `SidebarMenuItem`, `SidebarMenuButton`
- `TabsTrigger`, `DropdownMenuItem`
- All title/description slots in any shadcn component

### Rule 3: ALWAYS Replace Ad-Hoc Markup with shadcn Primitives
**Assume a shadcn primitive exists (53 available). Never write custom UI first.**

```tsx
// ❌ FORBIDDEN - Ad-hoc markup
<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <p className="font-bold text-yellow-800">Warning</p>
  <p className="text-yellow-700">Check your input</p>
</div>

// ✅ REQUIRED - Alert primitive
<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>Check your input</AlertDescription>
</Alert>

// ❌ FORBIDDEN - Custom status badge
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Active
</span>

// ✅ REQUIRED - Badge primitive
<Badge variant="success">Active</Badge>

// ❌ FORBIDDEN - Custom tabs
<div className="flex border-b">
  <button className="px-4 py-2 border-b-2 border-blue-500">Tab 1</button>
  <button className="px-4 py-2 text-gray-500">Tab 2</button>
</div>

// ✅ REQUIRED - Tabs primitive
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
</Tabs>
```

**Decision tree:**
1. Is there a shadcn primitive for this? → **Use it** (check MCP)
2. Can I compose multiple primitives? → **Compose them**
3. Is there truly no primitive? → **Use design tokens ONLY** (bg-muted, text-foreground, etc.)
4. Still stuck? → **Ask before proceeding** (never assume custom UI is acceptable)

### Rule 4: ALWAYS Preserve Documented Composition
**Every shadcn component has a required structure. Follow it EXACTLY.**

```tsx
// ❌ FORBIDDEN - Incorrect Card structure
<Card>
  <h2>Title</h2>
  <p>Description</p>
  <div>Content here</div>
</Card>

// ✅ REQUIRED - Correct Card composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>

// ❌ FORBIDDEN - Incorrect Dialog structure
<Dialog>
  <DialogContent>
    <h2>Are you sure?</h2>
    <p>This action cannot be undone</p>
    <Button>Confirm</Button>
  </DialogContent>
</Dialog>

// ✅ REQUIRED - Correct Dialog composition
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone</DialogDescription>
    </DialogHeader>
    <Button>Confirm</Button>
  </DialogContent>
</Dialog>
```

**Required compositions:**
- `Card` → `CardHeader` → `CardTitle` + `CardDescription` + `CardContent` + `CardFooter`
- `Alert` → `AlertTitle` + `AlertDescription`
- `Dialog` → `DialogContent` → `DialogHeader` → `DialogTitle` + `DialogDescription`
- `Sheet` → `SheetContent` → `SheetHeader` → `SheetTitle` + `SheetDescription`
- `Accordion` → `AccordionItem` → `AccordionTrigger` + `AccordionContent`
- `Tabs` → `TabsList` → `TabsTrigger` + `TabsContent`
- `DropdownMenu` → `DropdownMenuTrigger` + `DropdownMenuContent` → `DropdownMenuItem`

### Rule 5: REMOVE All Typography Imports
**Delete typography imports from EVERY module. Rework markup to use shadcn primitives.**

```tsx
// ❌ FORBIDDEN - Typography wrapper imports
import { H1, H2, H3, P, Lead, Muted } from '@/components/ui/typography'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'

// ✅ REQUIRED - shadcn primitive imports
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// ❌ FORBIDDEN - Using typography wrappers
<H1>Page Title</H1>
<P>Paragraph text here</P>
<Muted>Secondary text</Muted>

// ✅ REQUIRED - Plain semantic HTML with design tokens
<h1 className="text-4xl font-bold">Page Title</h1>
<p className="text-muted-foreground">Paragraph text here</p>

// ✅ BETTER - Use shadcn component slots
<CardTitle>Page Title</CardTitle>
<CardDescription>Paragraph text here</CardDescription>
```

**Where to remove typography:**
- `features/*` - All feature modules
- `components/navigation/*` - Header, Footer, Nav components
- `components/shared/*` - Shared UI components
- `app/(marketing)/*` - Marketing layouts

**Fallback when NO shadcn slot exists:**
```tsx
// Only use design tokens, never custom styles
<p className="text-foreground">Primary text</p>
<p className="text-muted-foreground">Secondary text</p>
<p className="text-destructive">Error text</p>

// NEVER do this:
<p className="text-gray-700 text-sm leading-6">Text</p>
```

### Rule 6: NEVER Edit components/ui/*.tsx
**ALL changes happen in feature/layout files ONLY.**

```bash
# ❌ FORBIDDEN - Editing shadcn components
components/ui/card.tsx          # DON'T TOUCH
components/ui/button.tsx        # DON'T TOUCH
components/ui/typography.tsx    # DON'T TOUCH (DELETE IF EXISTS)

# ✅ REQUIRED - Edit feature files only
features/home/sections/hero/hero.tsx
features/about/about-page.tsx
components/navigation/header.tsx
app/(marketing)/layout.tsx
```

**When you need customization:**
1. Check if it's possible with component props (`variant`, `size`, `className` for layout)
2. Compose multiple primitives instead
3. Use design tokens for spacing/layout only
4. If still blocked, consult team (never edit `components/ui/`)

---

## Quick Reference

| What you need | Where to look |
|---------------|---------------|
| **Component structure** | [Composition Patterns](#composition-patterns) |
| **Design tokens** | [Color & Spacing Tokens](#color--spacing-tokens) |
| **Form patterns** | [Forms](#forms) |
| **Find violations** | [Detection Commands](#detection-commands) |
| **Component docs** | Use `mcp__shadcn__get_component_docs({ component: 'name' })` |

---

## Stack

- **Components:** shadcn/ui (53 primitives)
- **Icons:** lucide-react@0.544.0
- **Theming:** next-themes@0.4.6
- **Toasts:** sonner@2.0.7
- **Tokens:** `app/globals.css` (never edit)

---

## 🚨 Critical Rules - MUST FOLLOW

### 1. NEVER Import Custom Typography

```tsx
// ❌ FORBIDDEN
import { H1, H2, P, Lead, Muted } from '@/components/ui/typography'

// ✅ REQUIRED - Use shadcn/ui slots
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
```

### 2. NEVER Customize Slot Styling

```tsx
// ❌ FORBIDDEN - No typography classes on slots
<CardTitle className="text-2xl font-bold text-primary">Title</CardTitle>

// ✅ REQUIRED - Use slots as-is
<CardTitle>Title</CardTitle>

// ✅ ALLOWED - Layout classes only
<CardHeader className="flex flex-row items-center gap-4">
  <CardTitle>Title</CardTitle>
</CardHeader>
```

**Allowed classes on slots:**
- Layout: `flex`, `grid`, `flex-row`, `flex-col`, `items-*`, `justify-*`
- Spacing: `gap-*`, `space-*`, `p-*`, `m-*`

**Forbidden classes on slots:**
- Typography: `text-*`, `font-*`, `leading-*`, `tracking-*`
- Colors: `text-[color]`, `bg-[color]`, `border-[color]` (except design tokens)
- Sizing: Custom sizes, arbitrary values

### 3. NEVER Use Arbitrary Values

```tsx
// ❌ FORBIDDEN
className="bg-blue-500 text-[#FF0000] p-[24px]"

// ✅ REQUIRED - Design tokens only
className="bg-primary text-destructive p-6"
```

### 4. ALWAYS Use Complete Compositions

```tsx
// ❌ FORBIDDEN - Incomplete structure
<Card>
  <h2>Title</h2>
  <p>Description</p>
</Card>

// ✅ REQUIRED - Complete composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### 5. ALWAYS Explore MCP Before Custom Markup

```typescript
// Before creating ANY custom UI, check if shadcn/ui has it:
mcp__shadcn__list_components()
mcp__shadcn__get_component_docs({ component: 'component-name' })
```

---

## 📌 Important: November 2024 Update

**Text slots are now `<div>` elements (Nov 3, 2024):**

- `CardTitle`, `CardDescription` → `<div>` (not `<h3>`/`<p>`)
- `AlertTitle`, `AlertDescription` → `<div>` (not `<h3>`/`<p>`)
- `DialogTitle`, `DialogDescription` → `<div>` (not `<h2>`/`<p>`)
- All title/description slots across components → `<div>`

**Why:** Better accessibility - you control heading hierarchy.

**Default usage:**
```tsx
// ✅ Use slots as-is (they're styled divs)
<CardTitle>My Title</CardTitle>
```

**When to add semantic HTML:**
```tsx
// ✅ Only if specifically needed for SEO or a11y
<CardTitle>
  <h2>My Title</h2>
</CardTitle>
```

---

## Component Categories

**Always check MCP before building custom UI:**
```typescript
mcp__shadcn__list_components()
mcp__shadcn__get_component_docs({ component: 'name' })
```

### Customer Portal Examples

- **Metric summaries** (`features/customer/dashboard/components/customer-metrics.tsx`) pair each `CardHeader` label with `CardContent` values and avoid custom accent classes.
- **Salon hero banners** (`features/customer/salon-detail/components/salon-header.tsx`) keep media in a `CardContent` block and move text/action controls into a dedicated `CardHeader`.
- **Profile metadata chips** (`features/customer/profile/components/profile-metadata-editor.tsx`) wrap each chip list in its own nested card with a proper header instead of raw divs.
- **Alerts in dialogs** (`features/customer/appointments/components/cancel-appointment-dialog.tsx`) always render `AlertTitle` before the description, even for error states.

### Available Components (53 total)

**Layout & Content**
- `card`, `accordion`, `tabs`, `collapsible`, `separator`, `scroll-area`

**Forms & Inputs**
- `form`, `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`
- `input-otp`, `input-group`, `field`, `label`, `calendar`, `date-picker`

**Overlays**
- `dialog`, `drawer`, `sheet`, `alert-dialog`, `popover`, `tooltip`, `hover-card`

**Navigation**
- `navigation-menu`, `menubar`, `breadcrumb`, `pagination`, `sidebar`, `command`

**Buttons & Actions**
- `button`, `button-group`, `toggle`, `toggle-group`, `dropdown-menu`, `context-menu`

**Feedback**
- `alert`, `toast` (Sonner), `progress`, `skeleton`, `spinner`, `badge`, `sonner`

**Data Display**
- `table`, `data-table`, `avatar`, `chart`, `carousel`, `resizable`, `kbd`

**Typography Slots** (use these, never custom wrappers)
- `CardTitle`, `CardDescription`, `AlertTitle`, `AlertDescription`
- `DialogTitle`, `DialogDescription`, `SheetTitle`, `SheetDescription`

### Pattern Mapping

| Need this UI | Use this component |
|--------------|-------------------|
| Content block | `Card` → CardHeader + CardTitle + CardDescription + CardContent |
| Notice/callout | `Alert` → AlertTitle + AlertDescription |
| Modal popup | `Dialog` → DialogContent + DialogHeader + DialogTitle |
| Side panel | `Sheet` → SheetContent + SheetHeader + SheetTitle |
| Collapsible | `Accordion` → AccordionItem + AccordionTrigger + AccordionContent |
| Tabs | `Tabs` → TabsList + TabsTrigger + TabsContent |
| Dropdown | `DropdownMenu` → DropdownMenuTrigger + DropdownMenuContent |
| Form field | `FormField` → FormItem + FormLabel + FormControl + FormMessage |

---

## Composition Patterns

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
    <CardDescription>Current month performance</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-semibold">$12,345</p>
    <p className="text-sm text-muted-foreground">Up 12% vs last month</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">View report</Button>
  </CardFooter>
</Card>
```

### Alert

```tsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

<Alert>
  <Terminal className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>
```

### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Cancel appointment</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm cancellation</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
    </DialogHeader>
    {children}
  </DialogContent>
</Dialog>
```

### Sheet (Side Panel)

```tsx
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Manage your preferences</SheetDescription>
    </SheetHeader>
    {children}
  </SheetContent>
</Sheet>
```

### Accordion

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="password">Password settings</TabsContent>
</Tabs>
```

### Table

```tsx
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead className="text-right">Price</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell className="text-right">${item.price}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Forms

**Structure:** React Hook Form + Zod + shadcn/ui Form components

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## Color & Spacing Tokens

### Design Tokens (REQUIRED)

**Background:**
- `bg-background`, `bg-foreground`, `bg-card`, `bg-popover`
- `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-destructive`

**Text:**
- `text-foreground`, `text-muted-foreground`, `text-primary`, `text-secondary`
- `text-destructive`, `text-accent-foreground`

**Border:**
- `border-border`, `border-input`, `border-ring`

**Charts:**
- `bg-chart-1`, `bg-chart-2`, `bg-chart-3`, `bg-chart-4`, `bg-chart-5`

**Spacing (Tailwind scale):**
- Use: `p-2`, `p-4`, `p-6`, `gap-2`, `gap-4`, `m-4`, etc.
- Never: `p-[24px]`, `gap-[16px]`, arbitrary pixel values

**❌ FORBIDDEN:**
- Arbitrary colors: `bg-blue-500`, `text-red-600`
- Hex codes: `text-[#FF0000]`
- RGB/HSL: `bg-[rgb(0,0,0)]`
- Arbitrary spacing: `p-[24px]`

---

## Icons & Theming

### Icons (Lucide React)

```tsx
import { Calendar, Users, AlertCircle } from 'lucide-react'

<Calendar className="h-4 w-4 text-muted-foreground" />
<Button size="icon"><Users className="h-4 w-4" /></Button>
```

**Sizes:** `h-4 w-4` (buttons/inline), `h-6 w-6` (headers)

### Toasts (Sonner)

```tsx
// Setup in app/layout.tsx
import { Toaster } from '@/components/ui/sonner'
<Toaster richColors position="top-right" />

// Usage
import { toast } from 'sonner'
toast.success('Saved', { description: 'Changes applied.' })
toast.error('Failed', { description: 'Please try again.' })
```

### Theme Toggle

```tsx
'use client'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="dark:hidden" />
          <Moon className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

---

## Accessibility

- Icon-only buttons need `aria-label` and `size="icon"`
- Use shadcn form primitives for proper label associations
- Never remove focus outlines
- Add `sr-only` text for icon-only status indicators
- Remember: Title/description slots are `<div>` (add `<h*>` inside only if needed for SEO/a11y)

```tsx
// Icon-only button
<Button size="icon" aria-label="Delete item">
  <Trash className="h-4 w-4" />
</Button>

// Screen reader only text
<span className="sr-only">Loading...</span>
```

---

## Detection Commands

Run these before committing to find violations:

```bash
# 1. Custom typography imports (FORBIDDEN)
rg "from ['\"]@/components/ui/typography['\"]" --type tsx

# 2. Slot customization (FORBIDDEN)
rg "(CardTitle|CardDescription|AlertTitle|AlertDescription).*className.*(text-|font-)" --type tsx

# 3. Arbitrary colors (FORBIDDEN)
rg "(bg|text|border)-(blue|red|green|gray|slate|zinc)-[0-9]+" --type tsx
rg "className=.*\[#[0-9a-fA-F]{3,6}\]" --type tsx

# 4. Arbitrary spacing (FORBIDDEN)
rg "className=.*\[[0-9]+px\]" --type tsx

# 5. Incomplete compositions (FORBIDDEN)
rg "<Card[^>]*>.*<h[1-6]" --type tsx
rg "<Card>" features --type tsx | grep -v "CardHeader"

# 6. Inline styles (FORBIDDEN)
rg "style=\{\{" --type tsx
```

**Zero violations required before commit.**

---

## 🔒 Strict Enforcement - Pre-Commit Requirements

**ZERO violations allowed. All checks MUST pass before committing.**

### Automated Violation Detection

Run these commands before EVERY commit:

```bash
# 1. Typography imports (MUST return 0)
rg "from ['\"]@/components/ui/typography['\"]" --type tsx features/ components/ app/
rg "import.*\{.*[HP][0-9].*\}.*typography" --type tsx

# 2. Wrapped slot content (MUST return 0)
rg "<(CardTitle|CardDescription|AlertTitle|AlertDescription|DialogTitle|SidebarMenuItem)>.*<(span|p|div)" --type tsx features/
rg "(CardTitle|AlertTitle|DialogTitle).*className.*(text-|font-)" --type tsx

# 3. Arbitrary colors (MUST return 0)
rg "(bg|text|border)-(blue|red|green|yellow|purple|pink|indigo|gray|slate|zinc)-[0-9]+" --type tsx features/
rg "className=.*\[#[0-9a-fA-F]{3,6}\]" --type tsx
rg "className=.*(rgb|hsl)\(" --type tsx

# 4. Arbitrary spacing (MUST return 0)
rg "className=.*\[[0-9]+px\]" --type tsx features/

# 5. Inline styles (MUST return 0)
rg "style=\{\{" --type tsx features/

# 6. Incomplete Card compositions (MUST return 0)
rg "<Card[^>]*>.*<(h[1-6]|p|div class)" --type tsx features/

# 7. Ad-hoc UI containers (SHOULD return 0)
rg "<div className=\".*rounded.*border.*p-[0-9]" --type tsx features/
```

### Manual Verification Checklist

✅ **Rule 1: NO Custom Styles**
- [ ] All UI elements use shadcn primitives
- [ ] No ad-hoc `<div>` markup with manual styling
- [ ] No custom component wrappers for UI elements

✅ **Rule 2: NO Wrappers in Slots**
- [ ] CardTitle, CardDescription contain plain text only
- [ ] AlertTitle, AlertDescription contain plain text only
- [ ] DialogTitle, SheetTitle, SidebarMenuItem contain plain text only
- [ ] No `<span>`, `<p>`, or `<div>` wrappers inside slot components
- [ ] No `className` with text/font styles on slot components

✅ **Rule 3: shadcn Primitives First**
- [ ] Checked MCP for available components before creating custom UI
- [ ] All status indicators use `Badge` component
- [ ] All notices/callouts use `Alert` component
- [ ] All modals use `Dialog` or `Sheet` components
- [ ] All collapsible sections use `Accordion` or `Collapsible`

✅ **Rule 4: Correct Compositions**
- [ ] Card uses CardHeader → CardTitle/CardDescription → CardContent structure
- [ ] Alert uses AlertTitle + AlertDescription
- [ ] Dialog uses DialogHeader → DialogTitle + DialogDescription
- [ ] Sheet uses SheetHeader → SheetTitle + SheetDescription
- [ ] All compositions match shadcn documentation exactly

✅ **Rule 5: NO Typography Imports**
- [ ] Removed all imports from `@/components/ui/typography`
- [ ] Removed H1, H2, H3, P, Lead, Muted wrapper components
- [ ] Replaced with shadcn component slots where possible
- [ ] Fallback to plain semantic HTML with design tokens only
- [ ] No raw `<span>` or `<p>` wrappers unless structurally required

✅ **Rule 6: NO Editing components/ui/**
- [ ] All changes made in `features/*`, `components/navigation/*`, or `app/*`
- [ ] No modifications to any files in `components/ui/`
- [ ] No new custom UI primitives created

✅ **Design Tokens Only**
- [ ] Using `bg-primary`, `text-foreground`, `text-muted-foreground` (approved tokens)
- [ ] NO `bg-blue-500`, `text-red-600`, or arbitrary Tailwind colors
- [ ] NO hex codes: `#FF0000`, `#3B82F6`
- [ ] NO RGB/HSL: `rgb(255,0,0)`, `hsl(210,100%,50%)`
- [ ] NO arbitrary values: `p-[24px]`, `text-[14px]`

✅ **Build Verification**
```bash
npm run build
# MUST complete with 0 TypeScript errors
```

### Violation Response Protocol

**If ANY detection command returns results:**

1. **STOP immediately** - Do not proceed with commit
2. **Identify violation** - Review the flagged code
3. **Apply correct pattern** - Reference Rules 1-6 above
4. **Re-run detection** - Verify violation is resolved
5. **Commit only when clean** - All checks must pass

**Common violations and fixes:**

```tsx
// Violation: Typography import
import { H2 } from '@/components/ui/typography'
// Fix: Remove import, use CardTitle or plain <h2>

// Violation: Wrapped slot
<CardTitle><span className="font-bold">Text</span></CardTitle>
// Fix: <CardTitle>Text</CardTitle>

// Violation: Arbitrary color
<div className="bg-blue-500">Content</div>
// Fix: <Card className="bg-primary">Content</Card>

// Violation: Ad-hoc markup
<div className="rounded border p-4">Message</div>
// Fix: <Alert><AlertDescription>Message</AlertDescription></Alert>

// Violation: Incomplete composition
<Card><h3>Title</h3><p>Text</p></Card>
// Fix: <Card><CardHeader><CardTitle>Title</CardTitle></CardHeader></Card>
```

---

## 🎯 Enforcement Summary

**BEFORE any commit:**
1. Run all detection commands → ALL MUST return 0 results
2. Complete manual checklist → ALL items MUST be checked
3. Run `npm run build` → MUST succeed with 0 errors
4. Review changes → MUST follow Rules 1-6

**ZERO tolerance for:**
- Typography imports
- Wrapped slot content
- Arbitrary colors/spacing
- Incomplete compositions
- Custom UI when shadcn primitive exists
- Editing `components/ui/` files

**When in doubt:**
- Check shadcn docs: https://ui.shadcn.com/docs/components
- Use MCP tools: `mcp__shadcn__list_components()` and `mcp__shadcn__get_component_docs()`
- Ask the team
- NEVER proceed with custom UI without verification

---

## Common Refactoring Examples

**Replace custom typography:**
```tsx
// ❌ Before
import { H2, P } from '@/components/ui/typography'
<div><H2>Title</H2><P>Text</P></div>

// ✅ After
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
<Card><CardHeader><CardTitle>Title</CardTitle><CardDescription>Text</CardDescription></CardHeader></Card>
```

**Fix incomplete Card:**
```tsx
// ❌ Before
<Card><h3>Title</h3><p>Text</p></Card>

// ✅ After
<Card><CardHeader><CardTitle>Title</CardTitle><CardDescription>Text</CardDescription></CardHeader></Card>
```

**Remove slot styling:**
```tsx
// ❌ Before
<CardTitle className="text-2xl font-bold">Title</CardTitle>

// ✅ After
<CardTitle>Title</CardTitle>
```

**Use design tokens:**
```tsx
// ❌ Before
<div className="bg-red-100 text-red-700">Error</div>

// ✅ After
<Alert variant="destructive"><AlertTitle>Error</AlertTitle></Alert>
```

---

**Last Updated:** 2025-10-19 (Nov 3, 2024 shadcn/ui updates included)
**MCP Tools:** `mcp__shadcn__list_components()`, `mcp__shadcn__get_component_docs({ component: 'name' })`
**Docs:** https://ui.shadcn.com/docs | **Changelog:** https://ui.shadcn.com/docs/changelog
