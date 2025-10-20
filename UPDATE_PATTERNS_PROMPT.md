# Pattern Documentation Update Prompt

**Purpose:** Use Context7 MCP to fetch latest documentation and update pattern files with current best practices.

---

## Instructions for AI Agent

You are tasked with updating the pattern files in `docs/stack-patterns/` using the Context7 MCP to fetch the latest official documentation and best practices. Follow these steps for each pattern file:

---

## Update Process

### For Each Pattern File:

1. **Identify the technology** from the file name
2. **Use Context7 MCP** to fetch latest documentation
3. **Review current patterns** in the file
4. **Update with latest best practices**
5. **Maintain standalone format** (no cross-references)
6. **Keep all existing examples** unless deprecated
7. **Add new patterns** from latest docs
8. **Update version numbers**

---

## Pattern Files to Update

### 1. architecture-patterns.md

**Technologies:** Next.js App Router, React Server Components, Project structure

**Context7 Queries:**
```
Use mcp__context7__resolve-library-id and mcp__context7__get-library-docs for:
- Next.js (/vercel/next.js)
- React (/facebook/react)
```

**Focus Areas:**
- Latest App Router patterns (Next.js 15+)
- Server/Client Component best practices
- File organization conventions
- Route handler patterns
- Middleware patterns

**Update Sections:**
- Server/Client directive rules
- Page composition patterns
- Route handler patterns
- File organization
- Detection commands

---

### 2. nextjs-patterns.md

**Technologies:** Next.js 15 App Router

**Context7 Queries:**
```
Use mcp__context7__resolve-library-id and mcp__context7__get-library-docs for:
- Next.js latest docs (/vercel/next.js)
- Focus on: App Router, Routing, Data Fetching, Caching, Metadata, Server Actions
```

**Focus Areas:**
- Next.js 15 specific features
- App Router file conventions
- Streaming and Suspense patterns
- Metadata API updates
- Cache and revalidation strategies
- Server Actions best practices

**Update Sections:**
- File conventions
- Dynamic routes patterns
- Parallel routes & intercepting routes
- Loading and error states
- Metadata patterns
- Data fetching strategies
- Caching configurations

---

### 3. react-patterns.md

**Technologies:** React 19

**Context7 Queries:**
```
Use mcp__context7__resolve-library-id and mcp__context7__get-library-docs for:
- React 19 (/facebook/react)
- Focus on: Server Components, Hooks, Composition, useOptimistic, useActionState
```

**Focus Areas:**
- React 19 new features
- Server vs Client Components
- New hooks (useActionState, useOptimistic, use)
- Concurrent features
- Transitions
- Performance patterns

**Update Sections:**
- Server/Client Component guidelines
- All hooks with React 19 updates
- New React 19 hooks
- Component composition patterns
- Performance optimization
- Suspense patterns

---

### 4. typescript-patterns.md

**Technologies:** TypeScript 5.9+

**Context7 Queries:**
```
Use mcp__context7__resolve-library-id and mcp__context7__get-library-docs for:
- TypeScript latest (/microsoft/TypeScript)
- Focus on: Strict mode, Type inference, Utility types, New features
```

**Focus Areas:**
- TypeScript 5.9+ features
- Strict mode configuration
- Latest utility types
- Type inference improvements
- Template literal types
- Satisfies operator

**Update Sections:**
- tsconfig.json strict settings
- New utility types
- Type inference patterns
- Advanced type patterns
- Latest TypeScript features

---

### 5. supabase-patterns.md

**Technologies:** Supabase JS, Supabase Auth, Supabase SSR

**Context7 Queries:**
```
Use mcp__context7__resolve-library-id and mcp__context7__get-library-docs for:
- Supabase JS (/supabase/supabase-js)
- Supabase Auth (/supabase/auth-js)
- Focus on: SSR, Auth, Real-time, RLS, Type generation
```

**Focus Areas:**
- Latest SSR patterns with Next.js
- Auth methods and flows
- Real-time subscriptions
- RLS policy patterns
- Type generation
- Storage patterns

**Update Sections:**
- Client creation (server/client/middleware)
- Authentication flows
- Query patterns with latest API
- Mutation patterns
- RLS examples
- Real-time subscriptions
- Type safety patterns

---

### 6. ui-patterns.md

**Technologies:** shadcn/ui, lucide-react, next-themes, sonner

**Context7 Queries:**
```
Use mcp__context7__resolve-library-id and mcp__context7__get-library-docs for:
- shadcn/ui (search for official shadcn docs)
- Focus on: Component composition, Accessibility, Theming, Latest components
```

**Focus Areas:**
- Latest shadcn/ui components
- Component composition patterns
- Accessibility best practices
- Theme system
- New component variants
- Form components

**Update Sections:**
- Component composition examples
- All available components (50+)
- Component variants
- Accessibility patterns
- Theme configuration
- Icon usage patterns

---

### 7. forms-patterns.md

**Technologies:** React Hook Form, Zod

**Context7 Queries:**
```
Use mcp__context7__resolve-library-id and mcp__context7__get-library-docs for:
- React Hook Form (/react-hook-form/react-hook-form)
- Zod (/colinhacks/zod)
- Focus on: Validation, Server Actions, Type safety, Advanced patterns
```

**Focus Areas:**
- React Hook Form 7.x features
- Zod 3.x schema patterns
- Server Action integration
- Type safety with Zod inference
- Advanced validation
- Error handling

**Update Sections:**
- Zod schema patterns (all types)
- Form validation strategies
- Server Action integration
- Error handling patterns
- Advanced form patterns (multi-step, dynamic arrays)

---

## Update Guidelines

### What to Keep

✅ **Keep:**
- Standalone file format (no cross-references)
- Complete code examples
- Detection commands
- Before/after fix examples
- Quick reference checklists
- Table of contents
- Stack context section

### What to Update

🔄 **Update:**
- Version numbers in Stack Context
- Deprecated patterns → Latest patterns
- API changes (old methods → new methods)
- Add new features from latest docs
- Update code examples with latest syntax
- Add new best practices
- Update detection commands if needed

### What to Add

➕ **Add:**
- New features from latest docs
- New component variants (shadcn/ui)
- New hooks (React 19)
- New API methods
- New best practices
- New performance patterns
- New security patterns

### What to Remove

❌ **Remove:**
- Deprecated features
- Outdated patterns
- Incorrect examples
- Old API methods no longer recommended

---

## Quality Checklist

After updating each file, verify:

- [ ] All code examples are syntactically correct
- [ ] Examples use latest API methods
- [ ] Version numbers are current
- [ ] File remains standalone (no cross-refs)
- [ ] All sections have complete context
- [ ] Detection commands work
- [ ] Code is copy-paste ready
- [ ] Examples follow current best practices
- [ ] No deprecated features included
- [ ] Quick reference checklist is updated

---

## Execution Steps

### Step 1: Resolve Library IDs

For each technology, use:
```
mcp__context7__resolve-library-id with libraryName: "technology-name"
```

**Technologies to resolve:**
- Next.js
- React
- TypeScript
- Supabase
- React Hook Form
- Zod
- shadcn/ui (or search documentation)

### Step 2: Fetch Documentation

For each resolved library, use:
```
mcp__context7__get-library-docs with:
- context7CompatibleLibraryID: (from step 1)
- topic: (specific feature area)
- tokens: 5000-10000 (comprehensive documentation)
```

### Step 3: Review & Compare

1. Read the current pattern file
2. Compare with fetched documentation
3. Identify differences and updates
4. Note new features or patterns

### Step 4: Update File

1. Update Stack Context versions
2. Update deprecated patterns
3. Add new patterns/features
4. Update code examples
5. Update detection commands
6. Update Quick Reference checklist
7. Update "Last Updated" date

### Step 5: Validate

1. Check code syntax
2. Verify completeness
3. Ensure standalone format
4. Test detection commands
5. Verify no cross-references

---

## Example Context7 Usage

### Example 1: Update Next.js Patterns

```typescript
// Step 1: Resolve Next.js library
const resolved = await mcp__context7__resolve-library-id({
  libraryName: "Next.js"
})
// Returns: /vercel/next.js

// Step 2: Fetch App Router docs
const appRouterDocs = await mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/vercel/next.js",
  topic: "App Router routing patterns",
  tokens: 8000
})

// Step 3: Fetch Data Fetching docs
const dataFetchingDocs = await mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/vercel/next.js",
  topic: "Data fetching caching revalidation",
  tokens: 8000
})

// Step 4: Update nextjs-patterns.md with latest info
```

### Example 2: Update React Patterns

```typescript
// Step 1: Resolve React library
const resolved = await mcp__context7__resolve-library-id({
  libraryName: "React"
})
// Returns: /facebook/react

// Step 2: Fetch Server Components docs
const serverComponentDocs = await mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/facebook/react",
  topic: "Server Components",
  tokens: 8000
})

// Step 3: Fetch React 19 hooks docs
const hooksDocs = await mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/facebook/react",
  topic: "hooks useActionState useOptimistic",
  tokens: 8000
})

// Step 4: Update react-patterns.md
```

### Example 3: Update Supabase Patterns

```typescript
// Step 1: Resolve Supabase library
const resolved = await mcp__context7__resolve-library-id({
  libraryName: "Supabase"
})

// Step 2: Fetch SSR docs
const ssrDocs = await mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/supabase/supabase-js",
  topic: "Next.js SSR Server-Side Rendering",
  tokens: 8000
})

// Step 3: Fetch Auth docs
const authDocs = await mcp__context7__get-library-docs({
  context7CompatibleLibraryID: "/supabase/auth-js",
  topic: "Authentication flows OAuth",
  tokens: 8000
})

// Step 4: Update supabase-patterns.md
```

---

## Output Format

After updating each file, provide a summary:

```markdown
## Updated: [filename]

### Changes Made:
- Updated version from X.X.X to Y.Y.Y
- Added new pattern: [pattern name]
- Updated deprecated pattern: [old → new]
- Added 5 new code examples
- Updated detection commands

### New Features Added:
- [Feature 1 with example]
- [Feature 2 with example]
- [Feature 3 with example]

### Deprecated Features Removed:
- [Removed feature 1]
- [Removed feature 2]

### Code Examples Updated:
- [Example 1: description]
- [Example 2: description]
```

---

## Priority Order

Update files in this order:

1. **architecture-patterns.md** (Foundation - do first)
2. **nextjs-patterns.md** (Framework)
3. **react-patterns.md** (UI library)
4. **typescript-patterns.md** (Type safety)
5. **supabase-patterns.md** (Backend)
6. **ui-patterns.md** (Components)
7. **forms-patterns.md** (Forms)

---

## Special Instructions

### For shadcn/ui (ui-patterns.md)

Since shadcn/ui is a collection of copy-paste components, fetch documentation for:
- Component composition patterns
- Accessibility best practices
- Latest component additions
- Theme customization
- Form component patterns

Use search queries like:
- "shadcn/ui component library documentation"
- "shadcn/ui composition patterns"
- "shadcn/ui accessibility"

### For TypeScript (typescript-patterns.md)

Focus on:
- Strict mode configuration (tsconfig.json)
- Latest utility types
- Type inference improvements
- New language features
- Integration with React/Next.js types

### For Supabase (supabase-patterns.md)

Focus on:
- SSR with Next.js 15
- Latest auth methods
- Type generation from database
- Real-time subscriptions
- RLS policy patterns

---

## Final Validation

After all updates, verify:

1. **All files are standalone** - No cross-references between files
2. **Version numbers are current** - Check package.json for installed versions
3. **Code examples work** - Syntactically correct and follow latest APIs
4. **Detection commands are valid** - Shell commands work correctly
5. **Checklists are complete** - Quick Reference sections are comprehensive
6. **Last Updated date is current** - Update to today's date

---

## Maintenance Schedule

**Recommended Update Frequency:**
- Monthly: Check for major version updates
- Quarterly: Comprehensive review of all files
- On version bumps: Immediate update when dependencies are upgraded

---

**Created:** 2025-10-19
**Purpose:** Keep pattern documentation current with latest best practices using Context7 MCP
