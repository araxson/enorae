# Staff Portal - Violations Found & Fixed

**Quick Reference Card**

---

## Violation #1: Custom Typography Pattern (scroll-m-20)

**Location:** `/features/staff/location/index.tsx`

**Lines:** 17, 23, 37

### ❌ BEFORE (Violation)
```tsx
<h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">
  Location Information
</h1>
<h2 className="scroll-m-20 text-3xl font-semibold">Your Location</h2>
<h2 className="scroll-m-20 text-3xl font-semibold">All Salon Locations</h2>
```

### ✅ AFTER (Fixed)
```tsx
<h1 className="text-3xl font-bold tracking-tight">
  Location Information
</h1>
<h2 className="text-xl font-semibold">Your Location</h2>
<h2 className="text-xl font-semibold">All Salon Locations</h2>
```

### Why it was wrong
- `scroll-m-20` is a utility from the old Typography component pattern
- Should not be used with direct HTML heading tags
- Pattern was inconsistent with shadcn/ui standards

### Pattern to follow
- Use `text-3xl font-bold tracking-tight` for h1 page titles
- Use `text-xl font-semibold` for h2 section headings
- No `scroll-m-*` utilities on headings

---

## Violation #2: Custom Typography Pattern (scroll-m-20)

**Location:** `/features/staff/settings/index.tsx`

**Line:** 15

### ❌ BEFORE (Violation)
```tsx
<h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">
  Settings & Preferences
</h1>
```

### ✅ AFTER (Fixed)
```tsx
<h1 className="text-3xl font-bold tracking-tight">
  Settings & Preferences
</h1>
```

### Pattern to follow
Same as Violation #1 - consistent h1 styling across portal

---

## Violation #3: Slot Customization with className

**Location:** `/features/staff/staff-common/components/staff-summary-grid.tsx`

**Lines:** 31-37

### ❌ BEFORE (Violation)
```tsx
<CardHeader className="pb-3">
  <CardTitle>
    <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
      <span>{summary.label}</span>
      {Icon ? <Icon className="h-4 w-4 text-foreground" /> : null}
    </div>
  </CardTitle>
</CardHeader>
```

### ✅ AFTER (Fixed)
```tsx
<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
  <div className="text-sm font-medium text-muted-foreground">
    {summary.label}
  </div>
  {Icon ? <Icon className="h-4 w-4" /> : null}
</CardHeader>
```

### Why it was wrong
- CardTitle slot was wrapping a div with custom styling classes
- Slot components (CardTitle, CardDescription, etc.) should have ZERO className attributes
- Typography styling was being applied inside the slot instead of on plain elements

### Pattern to follow
- Apply layout classes to container components (CardHeader, CardContent)
- Use plain HTML elements for styled text content
- Never add className to CardTitle, CardDescription, AlertTitle, AlertDescription slots
- If you need custom styling, don't use the slot - use a plain div/p/span

---

## Violation #4: Badge Layout Class Redundancy

**Location:** `/features/staff/staff-common/components/staff-page-heading.tsx`

**Line:** 103

### ❌ BEFORE (Violation)
```tsx
<Badge variant="secondary" className="hidden sm:inline-flex items-center gap-1">
  <Sparkles className="h-3.5 w-3.5" />
  Staff Portal
</Badge>
```

### ✅ AFTER (Fixed)
```tsx
<Badge variant="secondary" className="hidden sm:inline-flex gap-1">
  <Sparkles className="h-3.5 w-3.5" />
  Staff Portal
</Badge>
```

### Why it was wrong
- `items-center` was redundant because Badge already has flex alignment
- Minor violation but represents improper understanding of component defaults

### Pattern to follow
- Only add layout classes that modify default behavior
- Understand shadcn component defaults before adding className
- Keep className attributes minimal and intentional

---

## Common Patterns to Avoid

### ❌ DON'T: Add className to shadcn slots
```tsx
<CardTitle className="text-lg font-bold">Title</CardTitle>
<AlertDescription className="text-sm">Message</AlertDescription>
```

### ✅ DO: Use slots as-is, style plain elements
```tsx
<CardTitle>Title</CardTitle>
<AlertDescription>Message</AlertDescription>

<!-- OR -->

<CardHeader>
  <div className="text-lg font-bold">Title</div>
  <p className="text-sm">Message</p>
</CardHeader>
```

---

### ❌ DON'T: Use scroll-m-* utilities
```tsx
<h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">
```

### ✅ DO: Use standard heading patterns
```tsx
<h1 className="text-3xl font-bold tracking-tight">
<h2 className="text-xl font-semibold">
```

---

### ❌ DON'T: Wrap slots with styled containers
```tsx
<CardTitle>
  <div className="flex items-center gap-2">
    <Icon />
    <span className="font-bold">Title</span>
  </div>
</CardTitle>
```

### ✅ DO: Apply layout to header, use plain elements
```tsx
<CardHeader className="flex flex-row items-center gap-2">
  <Icon />
  <div>Title</div>
</CardHeader>
```

---

## Pattern Rules Summary

1. **Slots are sacred** - Never add className to CardTitle, CardDescription, AlertTitle, AlertDescription
2. **Layout on containers** - Apply flex, gap, padding to CardHeader, CardContent, Alert
3. **Typography on elements** - Apply text-*, font-* to plain div, p, span, h1-h6
4. **No scroll-m-*** - Avoid scroll margin utilities from old Typography component
5. **Minimal className** - Only add what's necessary to modify default behavior

---

## Quick Checklist

Before committing Staff Portal code:

- [ ] No `scroll-m-20` or `scroll-m-*` utilities
- [ ] No `className` attributes on CardTitle, CardDescription, AlertTitle, AlertDescription
- [ ] Layout classes only on CardHeader, CardContent, Alert containers
- [ ] Typography classes on plain HTML elements only
- [ ] All page files 5-15 lines
- [ ] All queries.ts have `import 'server-only'`
- [ ] All mutations.ts have `'use server'`
- [ ] All database operations verify auth
- [ ] All mutations call `revalidatePath()`

---

**Status:** ✅ All violations fixed
**Date:** 2025-10-20
**Files Modified:** 4
