# Rule Template

Use this template when creating new rules for ENORAE.

---

## Rule Naming Convention

```
{DOMAIN}-{SEVERITY}{NUMBER}
```

### Domain Codes
- `ARCH` - Architecture (file structure, directives)
- `DB` - Database (queries, mutations, RLS)
- `SEC` - Security (auth, authorization, policies)
- `UI` - User Interface (components, styling)
- `NEXT` - Next.js specific patterns
- `REACT` - React specific patterns
- `TS` - TypeScript patterns
- `PERF` - Performance optimization
- `A11Y` - Accessibility

### Severity Levels
- `P` (P001-P099) - Critical (security vulnerabilities, breaking changes)
- `H` (H100-H299) - High (major behavioral or UX issues)
- `M` (M300-M699) - Medium (code quality, maintainability)
- `L` (L700-L999) - Low (optimizations, nice-to-haves)

### Numbering
- Sequential within severity level
- Leave gaps for future insertions
- Check existing rules to avoid conflicts

---

## Template

```markdown
### Rule: {DOMAIN}-{SEVERITY}{NUMBER} {#domain-severity-number}
**Pattern:** [One sentence describing what developers should do]
**Why:** [Why this pattern is important - explain the problem it prevents]
**Detection:** [How to find violations - search patterns, commands, or manual inspection]
**Fix:** [Step-by-step or quick fix instructions]
**Example:**
```[language]
// ❌ WRONG (violation)
[bad code example]

// ✅ CORRECT (compliant)
[good code example]
```
**Reference:** [File path, URL, or codebase location]
**Related Rules:** [Links to related rules using format: [RULE-CODE](../path/file.md#rule-code)]
```

---

## Example: Critical Rule

```markdown
### Rule: DB-P004 {#db-p004}
**Pattern:** Never expose service role key in client-side code
**Why:** Service role key bypasses RLS and grants full database access. Exposing it in client bundles allows unauthorized access to all data.
**Detection:** Search for `SUPABASE_SERVICE_ROLE_KEY` in client components or `'use client'` files
**Fix:** Move operations requiring service role to API routes or server actions
**Example:**
```ts
// ❌ WRONG
'use client'
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// ✅ CORRECT (API route)
export async function POST(request: Request) {
  const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  // ... server-side operation
}
```
**Reference:** https://supabase.com/docs/guides/auth/row-level-security
**Related Rules:** [SEC-P001](./security.md#sec-p001), [ARCH-P001](./architecture.md#arch-p001)
```

---

## Example: High Priority Rule

```markdown
### Rule: UI-H104 {#ui-h104}
**Pattern:** Dialog components must include DialogTitle for accessibility
**Why:** Screen readers rely on DialogTitle to announce dialog purpose. Missing titles create confusing UX.
**Detection:** Search for `<Dialog>` without `<DialogTitle>` child
**Fix:** Add DialogHeader and DialogTitle to all Dialog compositions
**Example:**
```tsx
// ❌ WRONG
<Dialog>
  <DialogContent>
    <form>...</form>
  </DialogContent>
</Dialog>

// ✅ CORRECT
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Appointment</DialogTitle>
      <DialogDescription>Fill in the details below</DialogDescription>
    </DialogHeader>
    <form>...</form>
  </DialogContent>
</Dialog>
```
**Reference:** https://ui.shadcn.com/docs/components/dialog
**Related Rules:** [UI-P002](./ui.md#ui-p002), [A11Y-H101](../domains/accessibility.md#a11y-h101)
```

---

## Example: Medium Priority Rule

```markdown
### Rule: ARCH-M303 {#arch-m303}
**Pattern:** Feature exports should use named exports, not default exports
**Why:** Named exports improve discoverability, enable tree-shaking, and make refactoring safer
**Detection:** Search for `export default` in feature index files
**Fix:** Convert to named exports
**Example:**
```ts
// ❌ WRONG
export default function FeatureComponent() { ... }

// ✅ CORRECT
export function FeatureComponent() { ... }
export { FeatureComponent }
```
**Reference:** Internal code standards
**Related Rules:** [ARCH-H101](./architecture.md#arch-h101)
```

---

## Example: Low Priority Rule

```markdown
### Rule: PERF-L703 {#perf-l703}
**Pattern:** Use Next.js Image component for all images
**Why:** Automatic optimization, lazy loading, and responsive images reduce page weight
**Detection:** Search for `<img>` tags in components
**Fix:** Replace with next/image Image component
**Example:**
```tsx
// ❌ WRONG
<img src="/logo.png" alt="Logo" />

// ✅ CORRECT
import Image from 'next/image'
<Image src="/logo.png" alt="Logo" width={200} height={50} />
```
**Reference:** https://nextjs.org/docs/app/api-reference/components/image
**Related Rules:** [PERF-L701](./performance.md#perf-l701)
```

---

## Checklist for New Rules

Before adding a new rule, ensure:

- [ ] Rule code follows naming convention
- [ ] Severity is appropriate for the issue
- [ ] Pattern is clear and actionable
- [ ] Why section explains the problem
- [ ] Detection provides concrete search/check method
- [ ] Fix gives step-by-step instructions
- [ ] Example shows both wrong and correct code
- [ ] Reference points to authoritative source
- [ ] Related rules are linked (if applicable)
- [ ] Anchor ID matches rule code in lowercase
- [ ] Rule added to [`03-QUICK-SEARCH.md`](../03-QUICK-SEARCH.md)
- [ ] Rule added to appropriate category in parent file
- [ ] Cross-references updated in related files
- [ ] [`04-TASK-GUIDE.md`](../04-TASK-GUIDE.md) updated if relevant

---

## Adding a Rule (Step-by-Step)

1. **Determine domain and severity**
   - What aspect does it cover? (ARCH, DB, SEC, UI, etc.)
   - How severe is violation? (P, H, M, L)

2. **Assign rule number**
   - Check existing rules in that category
   - Use next available number in severity range

3. **Write the rule**
   - Use template above
   - Fill all required fields
   - Add anchor ID: `{#domain-severity-number}`

4. **Add to domain file**
   - Place in appropriate severity section
   - Maintain sequential order
   - Add section anchor if creating new section

5. **Update rules index**
   - Add to severity section in [`03-QUICK-SEARCH.md`](../03-QUICK-SEARCH.md)
   - Add to rule definitions (alphabetical)
   - Include file link and quick description

6. **Update task guide (if needed)**
   - Add to relevant "I want to..." section in [`04-TASK-GUIDE.md`](../04-TASK-GUIDE.md)
   - Add to common errors table if applicable

7. **Add cross-references**
   - Link from related rules
   - Update "Related Rules" in existing rules

8. **Test**
   - Verify all links work
   - Check anchor IDs jump correctly
   - Ensure examples are accurate

---

## Rule Categories by File

**File** | **Domains** | **Focus**
--- | --- | ---
[`domains/database.md`](../domains/database.md) | DB | Supabase queries, views, RLS
[`domains/security.md`](../domains/security.md) | SEC | Auth, authorization, RLS enforcement
[`domains/architecture.md`](../domains/architecture.md) | ARCH | File structure, directives, features
[`domains/ui.md`](../domains/ui.md) | UI | shadcn/ui, Tailwind, Typography
[`domains/nextjs.md`](../domains/nextjs.md) | NEXT | Next.js App Router patterns
[`domains/react.md`](../domains/react.md) | REACT | React 19 Server/Client
[`domains/typescript.md`](../domains/typescript.md) | TS | TypeScript strictness
[`domains/performance.md`](../domains/performance.md) | PERF | Indexes, queries, bundles
[`domains/accessibility.md`](../domains/accessibility.md) | A11Y | WCAG, aria, forms

---

## When to Create a New Rule

**Do create a rule when:**
- ✅ Pattern prevents common bugs or security issues
- ✅ Pattern significantly improves code quality
- ✅ Pattern is violated in multiple places
- ✅ Pattern aligns with stack best practices
- ✅ Detection and fix are clear

**Don't create a rule when:**
- ❌ It's purely stylistic preference
- ❌ It's already covered by TypeScript compiler
- ❌ It's automatically enforced by tooling
- ❌ It applies to only one specific case
- ❌ It contradicts framework documentation

---

**📖 Related Documentation:**
- [Rules Index](../03-QUICK-SEARCH.md) - All existing rules
- [Task-Based Guide](../04-TASK-GUIDE.md) - Usage context
- [Stack Versions](./stack-versions.md) - Current versions

**Last Updated:** 2025-10-18
