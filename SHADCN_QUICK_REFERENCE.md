# shadcn/ui Conformance - Quick Reference Card

**Print this for your desk while refactoring**

---

## THE 4 VIOLATION TYPES

### 1️⃣ BADGE CLASSNAME (136 violations)

```tsx
// ❌ WRONG
<Badge className="flex items-center gap-1">
  <Icon /> Text
</Badge>

// ✅ RIGHT
<div className="flex items-center gap-1">
  <Icon />
  <Badge>Text</Badge>
</div>
```

**Key rule**: Badge has NO className. Layout goes to parent.

---

### 2️⃣ TEXT SIZING DIVS (193 violations)

```tsx
// ❌ WRONG
<div className="text-2xl font-bold">{value}</div>

// ✅ RIGHT
<Card>
  <CardContent>
    {value}
  </CardContent>
</Card>
```

**Key rule**: Use Card slots, not arbitrary divs with text-2xl.

---

### 3️⃣ CARDCONTENT STYLING (42 violations)

```tsx
// ❌ WRONG (styling on slot)
<CardContent className="bg-primary/10 text-sm p-2">
  Content
</CardContent>

// ✅ RIGHT (styling on child)
<CardContent className="p-2">
  <div className="bg-primary/10 text-sm">
    Content
  </div>
</CardContent>
```

**Key rule**: CardContent = layout classes only. Styling → child elements.

---

### 4️⃣ CUSTOM BORDER DIVS (12 violations)

```tsx
// ❌ WRONG
<div className="rounded-lg border p-4">
  <div>Title</div>
  <div>Content</div>
</div>

// ✅ RIGHT
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**Key rule**: Replace all `rounded-lg border` divs with Card component.

---

## LAYOUT vs STYLING CLASSES

### Layout (✅ KEEP ON COMPONENT)
- `flex`, `grid`, `gap-2`
- `p-4`, `pt-0`, `px-6`
- `items-center`, `justify-between`
- `w-full`, `h-32`
- `space-y-2`

### Styling (❌ MOVE TO CHILD)
- `bg-primary`, `bg-primary/10`
- `text-sm`, `text-primary`
- `font-bold`, `font-medium`
- `rounded-md`, `border`
- `shadow-lg`

---

## FIX WORKFLOW

1. **Find violation**
   ```bash
   grep "Badge.*className=" file.tsx
   ```

2. **Identify class type**
   - Layout? (flex, gap, p-) → Move to parent
   - Styling? (bg, text-color, font) → Move to child

3. **Refactor**
   - Extract className to parent div or child span
   - Remove from component
   - Test rendering

4. **Verify**
   ```bash
   npm run typecheck
   ```

---

## COMMON FIXES AT A GLANCE

### Badge + Icon
```tsx
// Before
<Badge className="flex items-center gap-1">
  <TrendingUp className="h-3 w-3" />
  {value}
</Badge>

// After
<div className="flex items-center gap-1">
  <Badge>{value}</Badge>
  <TrendingUp className="h-3 w-3" />
</div>
```

### Badge + Size
```tsx
// Before
<Badge className="text-xs">{status}</Badge>

// After
<Badge>{status}</Badge>
```

### Metric Value
```tsx
// Before
<CardContent>
  <div className="text-2xl font-bold">{123}</div>
</CardContent>

// After (Keep as-is, already correct)
<CardContent>
  <div className="text-2xl font-bold">{123}</div>
</CardContent>
```

### Custom Card
```tsx
// Before
<div className="rounded-lg border p-4">Content</div>

// After
<Card><CardContent>Content</CardContent></Card>
```

---

## DETECTION COMMANDS

**Find violations in your file**:
```bash
# Badge className
grep "Badge.*className=" src/components/my-component.tsx

# Text sizing
grep "className=.*text-[0-9]xl" src/components/my-component.tsx

# CardContent styling
grep "CardContent.*className=.*[bg|text]" src/components/my-component.tsx

# Custom borders
grep "className.*rounded-lg.*border" src/components/my-component.tsx
```

---

## TYPES TO CHECK

After fixing, these should compile:

```tsx
// Badge (no className)
<Badge variant="default">Text</Badge>

// Card slots (pre-styled)
<Card>
  <CardHeader>
    <CardTitle>Heading</CardTitle>
  </CardHeader>
</Card>

// Layout classes OK
<div className="flex gap-2 p-4">content</div>

// Semantic elements OK
<h2 className="text-2xl">Heading</h2>
```

---

## BEFORE/AFTER EXAMPLES BY PORTAL

### Business Portal

**Metric Card**
```tsx
// ❌ BEFORE
<Card>
  <CardHeader>
    <CardTitle>Total Bookings</CardTitle>
  </CardHeader>
  <CardContent className="text-2xl font-bold">
    {count}
  </CardContent>
</Card>

// ✅ AFTER
<Card>
  <CardHeader>
    <CardTitle>Total Bookings</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{count}</div>
  </CardContent>
</Card>
```

### Admin Portal

**Status Badge**
```tsx
// ❌ BEFORE
<Badge variant="destructive" className="text-xs capitalize">
  {appointment.status}
</Badge>

// ✅ AFTER
<Badge variant="destructive">{appointment.status}</Badge>
```

### Customer Portal

**Featured Badge**
```tsx
// ❌ BEFORE
<Badge variant="secondary" className="ml-auto">
  Featured
</Badge>

// ✅ AFTER
<div className="ml-auto">
  <Badge variant="secondary">Featured</Badge>
</div>
```

### Staff Portal

**Location Badge**
```tsx
// ❌ BEFORE
<Badge variant="default" className="text-xs">
  Your Location
</Badge>

// ✅ AFTER
<Badge variant="default">Your Location</Badge>
```

---

## PRIORITY BY IMPACT

**Do First (Highest Impact)**
1. ✅ Custom border divs (12 files) → Direct visual impact
2. ✅ Badge className (136) → Most violations

**Do Next (Good to Have)**
3. ⏱️ Text sizing (193) → Semantic correctness
4. ⏱️ CardContent (42) → Polish

---

## CHECKLIST FOR EACH FIX

- [ ] Violation identified
- [ ] Fix type determined (layout vs styling)
- [ ] Code refactored
- [ ] Renders without error
- [ ] Styling unchanged
- [ ] TypeScript compiles
- [ ] Committed to git

---

## GOTCHAS

**Q: Do I keep text-2xl on metric values?**
A: Yes, if it's for visual display (metrics showing large numbers).

**Q: Can I style Badge variant?**
A: No. Use variant prop only. Styling → parent/child elements.

**Q: Is Card always the right choice?**
A: Yes for bordered containers. Use Box/div for unstyled containers.

**Q: Can CardContent have pt-0?**
A: Yes! `pt-0` is layout (removes padding). Styling would be `bg-*` or `text-*`.

**Q: What about responsive classes?**
A: Keep them! `md:flex`, `lg:grid-cols-4` are layout.

---

## CONFIDENCE CHECK AFTER FIX

```bash
# Run these to verify your fix
npm run typecheck    # Should pass
npm run build        # Should succeed
npm run lint         # Check for issues

# Manual checks
- [ ] Component appears in browser
- [ ] No layout changes
- [ ] Styling looks identical
- [ ] Interactive elements work
```

---

## TIME ESTIMATES

| Violation Type | Count | Time per fix | Total time |
|---|---|---|---|
| Custom border divs | 12 | 10-15 min | 2-3 hrs |
| Badge className | 136 | 1-2 min each | 2-3 hrs |
| Text sizing | 193 | 2-3 min each | 4-6 hrs |
| CardContent | 42 | 2-3 min each | 1-2 hrs |
| **TOTAL** | **607** | | **12-15 hrs** |

---

**Conform to shadcn/ui. Every. Single. Component.**

*Reference these three files while working:*
- SHADCN_AUDIT_SUMMARY.md (overview)
- SHADCN_CONFORMANCE_AUDIT_REPORT.md (full details)
- SHADCN_FIXES_IMPLEMENTATION_GUIDE.md (step-by-step)
