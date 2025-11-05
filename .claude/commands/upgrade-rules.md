---
description: Upgrade rules files to new numbered structure with latest best practices using parallel agents
---

# Upgrade Rules to New Structure

**ULTRATHINK** through this entire process. Launch **9 parallel agents** to transform existing rules documentation with latest best practices from Context7 MCP.

---

## Task

Use a **SINGLE MESSAGE** with **9 parallel Task tool calls** to launch the `rules-upgrader` agent for each file.

**Agent 1 - Architecture:**
```
Create 01-architecture.md with file structure, naming conventions, and limits.
- Read existing architecture.md
- Fetch Next.js latest file structure patterns from Context7
- Include decision trees for file placement
- Add file size limits and splitting strategies
```

**Agent 2 - TypeScript:**
```
Create 02-typescript.md with type safety patterns.
- Read existing typescript.md
- Fetch TypeScript latest from Context7
- Strict mode requirements
- Type inference and utility types
```

**Agent 3 - React:**
```
Create 03-react.md with React component patterns.
- Read existing react.md
- Fetch React latest from Context7
- Server vs Client Components decision tree
- useActionState, useOptimistic hooks
```

**Agent 4 - Next.js:**
```
Create 04-nextjs.md with Next.js patterns.
- Read existing nextjs.md
- Fetch Next.js latest from Context7
- Caching strategies (revalidateTag, revalidatePath)
- Async params/searchParams patterns
```

**Agent 5 - Database:**
```
Create 05-database.md with Supabase-specific patterns.
- Read existing supabase.md
- Fetch Supabase latest from Context7
- RLS patterns, query optimization
- Schema design, migrations, views
- Type generation
```

**Agent 6 - API:**
```
Create 06-api.md with backend patterns.
- Extract Server Actions patterns from nextjs.md
- Fetch Next.js Server Actions latest from Context7
- Server Actions vs Route Handlers
- Validation with Zod
```

**Agent 7 - Forms:**
```
Create 07-forms.md with Zod-only validation patterns.
- Read existing forms.md
- Fetch Zod latest from Context7
- Server Actions + native forms
- useActionState for form state
- NO React Hook Form (FORBIDDEN)
```

**Agent 8 - UI:**
```
Create 08-ui.md with shadcn/ui patterns.
- Read existing ui.md
- Fetch shadcn/ui and Tailwind latest from Context7
- Component composition rules
- FORBIDDEN: custom styling on slots
- NO other UI libraries
```

**Agent 9 - Auth:**
```
Create 09-auth.md with Supabase Auth patterns.
- Extract auth from supabase.md
- Fetch Supabase Auth latest from Context7
- getUser vs getSession decision tree
- RLS integration (auth.uid(), JWT claims)
- NO other auth providers
```

---

## After Agents Complete

Create `docs/rules/README.md` with:
- Reading order (01 → 09)
- Stack versions from Context7 responses
- Quick reference table
- Before-writing-code checklist

---

## Stack (EXCLUSIVE)

- **Database:** Supabase ONLY
- **Auth:** Supabase Auth ONLY
- **UI:** shadcn/ui ONLY
- **Forms:** Zod + Server Actions ONLY (NO React Hook Form)
- **Styling:** Tailwind CSS

---

## Critical Requirements

1. **DO NOT** delete or modify files in `docs/rules/`
2. **Create** new directory `docs/rules/`
3. **Use Context7 MCP** to fetch latest docs for each topic
4. **All agents run in parallel** - single message with 9 Task calls
5. **ULTRATHINK** each transformation thoroughly

---

## Success Criteria

- [ ] 9 files created in `docs/rules/`
- [ ] README.md created
- [ ] All files follow template structure
- [ ] Context7 data fetched for all topics
- [ ] Original files in `docs/rules/` untouched
- [ ] Decision trees in all files
- [ ] FORBIDDEN sections in all files
- [ ] Detection commands in all files
