# claude.md

Quick reference for Claude Code.

## 📚 IMPORTANT: Read the Rules First

**Before making any changes to the codebase, read `docs/rules/` for comprehensive patterns:**

- `01-architecture.md` - File structure, routing, bundle optimization
- `02-typescript.md` - Type safety, performance patterns
- `03-react.md` - React 19 patterns, Server/Client components
- `04-nextjs.md` - Next.js 15/16 caching, performance
- `05-database.md` - Supabase RLS, queries, security
- `06-api.md` - Server Actions, validation, security
- `07-forms.md` - Accessibility (WCAG 2.1 AA), UX patterns
- `08-ui.md` - UI accessibility, performance
- `09-auth.md` - Authentication security, session management

**When to read the rules:**
- Before implementing new features
- When fixing bugs or refactoring
- When unsure about best practices
- Before code reviews or audits

## 🚫 Never Edit

**Never edit:** `components/ui/*`, `app/globals.css`, `lib/types/database.types.ts`
