---
description: Update existing rules with latest best practices from Context7 using parallel agents
---

# Update Rules with Latest Best Practices

**ULTRATHINK** through the entire update process. Launch **9 parallel agents** to refresh existing documentation with latest patterns from Context7 MCP.

---

## Task

Use a **SINGLE MESSAGE** with **9 parallel Task tool calls** to launch the `rules-updater` agent for each file.

**Agent 1 - Architecture:**
```
Update 01-architecture.md with latest file structure patterns.
- Read current 01-architecture.md from docs/rules/
- Fetch Next.js latest file conventions from Context7
- Compare current patterns with latest
- Update file placement decision trees
- Add any new file size limits or conventions
- Document version changes
```

**Agent 2 - TypeScript:**
```
Update 02-typescript.md with latest TypeScript features.
- Read current 02-typescript.md
- Fetch TypeScript latest from Context7
- Identify new features, utility types
- Update strict mode requirements
- Add new type inference patterns
- Document breaking changes
```

**Agent 3 - React:**
```
Update 03-react.md with latest React patterns.
- Read current 03-react.md
- Fetch React latest from Context7
- Update hooks documentation (new APIs)
- Refresh Server Component patterns
- Add performance improvements
- Document deprecations
```

**Agent 4 - Next.js:**
```
Update 04-nextjs.md with latest Next.js patterns.
- Read current 04-nextjs.md
- Fetch Next.js latest from Context7
- Update caching strategies
- Add new experimental features
- Document breaking changes
- Update async params patterns
```

**Agent 5 - Database:**
```
Update 05-database.md with Supabase latest.
- Read current 05-database.md
- Fetch Supabase latest from Context7
- Update RLS patterns
- Add new query optimization techniques
- Update client API changes
- Document new features
```

**Agent 6 - API:**
```
Update 06-api.md with Server Actions latest.
- Read current 06-api.md
- Fetch Next.js Server Actions latest from Context7
- Update validation patterns
- Add new error handling approaches
- Document API changes
- Update Zod integration
```

**Agent 7 - Forms:**
```
Update 07-forms.md with Zod latest patterns.
- Read current 07-forms.md
- Fetch Zod latest from Context7
- Update schema patterns
- Refresh useActionState examples
- Add new validation techniques
- Document Zod API changes
```

**Agent 8 - UI:**
```
Update 08-ui.md with shadcn/ui and Tailwind latest.
- Read current 08-ui.md
- Fetch shadcn/ui and Tailwind latest from Context7
- Add new components
- Update composition patterns
- Refresh Tailwind utility patterns
- Document component API changes
```

**Agent 9 - Auth:**
```
Update 09-auth.md with Supabase Auth latest.
- Read current 09-auth.md
- Fetch Supabase Auth latest from Context7
- Update session management patterns
- Add new security features
- Refresh RLS integration
- Document Auth API changes
```

---

## What Each Agent Does

For each file, the agent will:

1. **Read existing file** in `docs/rules/`
2. **Extract current versions** and patterns
3. **Fetch latest** from Context7 MCP
4. **Compare** current vs latest documentation
5. **Identify changes:**
   - ✨ New features
   - 🔥 Breaking changes
   - ⚠️ Deprecations
   - ⚡ Performance improvements
6. **Update file:**
   - Version numbers
   - Last Updated date
   - Patterns with version tags
   - FORBIDDEN anti-patterns
   - Detection commands
7. **Add changelog** (Recent Updates section)
8. **Provide summary** of changes

---

## Stack (Never Changes)

- **Database:** Supabase ONLY
- **Auth:** Supabase Auth ONLY
- **UI:** shadcn/ui ONLY
- **Forms:** Zod + Server Actions ONLY (NO React Hook Form)
- **Styling:** Tailwind CSS

---

## When to Run This Command

### Quarterly Maintenance (Every 3 Months)
```bash
/update-rules
```
Updates all 9 files with cumulative changes.

### Major Version Release
```bash
/update-rules Next.js new major version released
```
Updates relevant files (Next.js, API, Forms).

### Minor Version Update
```bash
/update-rules React new version with new features
```
Updates specific file with new patterns.

### Pattern Discovery
```bash
/update-rules Found better caching pattern
```
Updates file with newly discovered best practice.

---

## Critical Requirements

1. **All agents run in parallel** - single message with 9 Task calls
2. **Use Context7 MCP** to fetch latest docs for each topic
3. **ULTRATHINK** each update thoroughly
4. **Preserve structure** - template format stays intact
5. **Document versions** - update all version numbers
6. **Add migration paths** - for breaking changes

---

## Success Criteria

- [ ] 9 agents launched in parallel
- [ ] Context7 fetched for all files
- [ ] Version numbers updated
- [ ] Last Updated dates current
- [ ] New patterns documented with version tags
- [ ] Breaking changes with migration paths
- [ ] Detection commands updated
- [ ] Comprehensive changelog provided
- [ ] Structure preserved

---

## Example Output (After Completion)

```markdown
## Update Summary

**Date:** [Current Date]
**Files Updated:** All 9 rule files

### Context7 Versions Fetched
- TypeScript: [previous] → [latest from Context7]
- React: [previous] → [latest from Context7]
- Next.js: [previous] → [latest from Context7]
- Supabase: [previous] → [latest from Context7]
- Zod: [previous] → [latest from Context7]
- shadcn/ui: [latest from Context7]
- Tailwind: [previous] → [latest from Context7]

### Key Changes

#### 04-nextjs.md
✨ New: [New feature from Context7]
🔥 Breaking: [Breaking change from Context7]
⚠️ Deprecated: [Deprecated pattern from Context7]

#### 03-react.md
✨ New: [New feature from Context7]
⚡ Performance: [Performance improvement from Context7]

#### 08-ui.md
✨ New: [New components from Context7]
📝 Updated: [Updated patterns from Context7]

### Recommendations
1. [Recommendation based on Context7 findings]
2. [Migration steps for breaking changes]
3. [Testing recommendations]
4. Run detection commands on codebase

### Next Update: [3 months from current date]
```

---

**Run quarterly or when major versions release!** 🔄
