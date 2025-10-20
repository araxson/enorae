# Stack Versions

Current versions of all technologies used in ENORAE. Keep this updated when upgrading dependencies.

---

## Core Framework

### Next.js
**Version**: 15.5.4
**Type**: App Router (not Pages Router)
**Docs**: https://nextjs.org/docs
**Key Features**:
- React Server Components
- Server Actions
- Streaming SSR
- Incremental Static Regeneration

**Rules**: [`domains/nextjs.md`](../domains/nextjs.md)

### React
**Version**: 19.1.0
**Type**: Server + Client Components
**Docs**: https://react.dev
**Key Features**:
- Server Components
- `use()` hook for promises
- Simplified Context API
- Metadata hoisting

**Rules**: [`domains/react.md`](../domains/react.md)

---

## Language & Type Safety

### TypeScript
**Version**: 5.9.3
**Mode**: Strict (always)
**Docs**: https://www.typescriptlang.org/docs
**Key Features**:
- `using` declarations (resource management)
- Decorator metadata
- Import attributes

**Config**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Rules**: [`domains/typescript.md`](../domains/typescript.md)

---

## Database & Backend

### Supabase
**Version**: 2.58.0
**Type**: PostgreSQL + Auth + Realtime
**Docs**: https://supabase.com/docs
**Key Features**:
- Row Level Security (RLS)
- Multi-schema support
- Realtime subscriptions
- Edge Functions

**Schema Organization**:
- `organization` - Salons, staff, locations, chains
- `catalog` - Services, categories, pricing
- `scheduling` - Appointments, schedules, availability
- `inventory` - Products, stock, suppliers
- `identity` - Users, profiles, roles
- `communication` - Messages, notifications
- `analytics` - Metrics, reports, insights
- `engagement` - Favorites, reviews

**Rules**: [`domains/database.md`](../domains/database.md), [`domains/security.md`](../domains/security.md)

---

## Styling & UI

### Tailwind CSS
**Version**: 4.1.14
**Type**: Utility-first CSS framework
**Docs**: https://tailwindcss.com/docs
**Key Features**:
- `@utility` instead of `@layer`
- `@theme` for design tokens
- Container queries
- CSS-first configuration

**Config**: `tailwind.config.ts`
**Globals**: `app/globals.css` (protected)

**Rules**: [`domains/ui.md`](../domains/ui.md)

### shadcn/ui
**Version**: Latest (components installed individually)
**Type**: Composable component library
**Docs**: https://ui.shadcn.com
**Registry**: `components.json`
**Install Command**: `npx shadcn@latest add <component>`

**Installed Components**: All components pre-installed
- Forms: `form`, `input`, `textarea`, `select`, `checkbox`, `radio-group`
- Feedback: `alert`, `toast`, `dialog`, `sheet`, `popover`
- Data: `table`, `card`, `badge`, `avatar`, `skeleton`
- Layout: `sidebar`, `tabs`, `accordion`, `collapsible`, `separator`
- Charts: `chart` (with Recharts)
- And more...

**Protected**: `components/ui/*.tsx` - Never edit directly

**Rules**: [`domains/ui.md`](../domains/ui.md#ui-p002)

---

## Validation & Forms

### Zod
**Version**: Latest
**Type**: TypeScript-first schema validation
**Docs**: https://zod.dev
**Usage**: All server actions, API routes, form validation

**Pattern**:
```ts
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

type Input = z.infer<typeof schema>
```

**Rules**: [DB-M302](../03-QUICK-SEARCH.md#db-m302), [SEC-M302](../03-QUICK-SEARCH.md#sec-m302)

### React Hook Form
**Version**: Latest
**Type**: Form state management
**Docs**: https://react-hook-form.com
**Integration**: Works with Zod via `@hookform/resolvers/zod`

**Rules**: [A11Y-M301](../03-QUICK-SEARCH.md#a11y-m301)

---

## Development Tools

### Node.js
**Version**: 24.7.0 (LTS recommended)
**Package Manager**: npm / pnpm / yarn (project uses npm)

### Git
**Version**: Latest
**Branches**:
- `main` - Production branch
- Feature branches - `feature/description`

---

## Deployment & Infrastructure

### Vercel
**Platform**: Next.js deployment
**Features**:
- Edge Functions
- Image Optimization
- Analytics
- Preview Deployments

### Supabase Cloud
**Platform**: Database + Auth
**Features**:
- Managed PostgreSQL
- Auth with MFA
- Realtime subscriptions
- Edge Functions

---

## Runtime & Environment

### Browsers Supported
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile: iOS Safari 14+, Chrome Android latest

### Environment Variables
**Required**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

**Optional**:
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager
- `NEXT_PUBLIC_APP_URL` - Application base URL

---

## Package Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "db:types": "supabase gen types typescript --local > lib/types/database.types.ts"
  }
}
```

**Critical Command**: `npm run typecheck` - MUST pass before commits

---

## Version Update Checklist

When upgrading versions:

1. ✅ Update this document
2. ✅ Update `package.json`
3. ✅ Run `npm install`
4. ✅ Run `npm run typecheck`
5. ✅ Test critical paths
6. ✅ Check breaking changes in release notes
7. ✅ Update relevant rule files if patterns change
8. ✅ Commit version bump separately

---

## Compatibility Matrix

**Next.js 15.5.4** requires:
- React 19.x
- Node.js 18.18+
- TypeScript 5.x

**React 19.1.0** requires:
- TypeScript 5.0+
- Next.js 15+

**Tailwind CSS 4.1.14** requires:
- PostCSS 8.x
- Next.js 15+ (built-in support)

---

**📖 Related Documentation:**
- [Architecture Rules](../domains/architecture.md) - File structure
- [Database Rules](../domains/database.md) - Type generation
- [All Rules](../03-QUICK-SEARCH.md) - Complete index

**Last Updated:** 2025-10-18
