# 📚 ENORAE DOCUMENTATION INDEX

> **Single Next.js App • 42 Tables • 8 Domains • 11 Roles • 4 Portals**
> **Last Updated**: 2025-10-01

---

## 🎯 START HERE

### For Developers (First Time)
1. **[README.md](../README.md)** - Project overview and quick start
2. **[CLAUDE.md](../CLAUDE.md)** - **MANDATORY** AI development guidelines
3. **[PROJECT_TREE.md](./PROJECT_TREE.md)** - **CURRENT** project structure (auto-generated)
4. **[02-architecture/project-structure.md](./02-architecture/project-structure.md)** - Full project structure
5. **[02-architecture/naming-conventions.md](./02-architecture/naming-conventions.md)** - File naming rules

### For AI Assistants
1. **[CLAUDE.md](../CLAUDE.md)** - **PRIMARY REFERENCE** - Development rules
2. **[PROJECT_TREE.md](./PROJECT_TREE.md)** - **CURRENT** structure (auto-generated each session)
3. **[02-architecture/project-structure.md](./02-architecture/project-structure.md)** - Complete file tree
4. **[02-architecture/overview.md](./02-architecture/overview.md)** - Architecture patterns
5. **[04-frontend/component-patterns.md](./04-frontend/component-patterns.md)** - Frontend patterns

---

## 📖 DOCUMENTATION STRUCTURE

### 📁 01-getting-started/
*Coming soon - Quick start guides*

### 📁 02-architecture/
**System Design & Organization**

| File | Size | Description |
|------|------|-------------|
| [overview.md](./02-architecture/overview.md) | 28KB | Architecture decisions, why single app, database analysis |
| [project-structure.md](./02-architecture/project-structure.md) | 51KB | Complete file tree, all routes, all features |
| [roles-and-routing.md](./02-architecture/roles-and-routing.md) | 12KB | 11 roles, 4 portals, middleware, auth flow |
| [naming-conventions.md](./02-architecture/naming-conventions.md) | 20KB | File/folder naming rules, 10 patterns, examples |

**When to read:**
- `overview.md` - Understanding architecture decisions
- `project-structure.md` - Planning new features, seeing full structure
- `roles-and-routing.md` - Implementing auth, roles, middleware
- `naming-conventions.md` - Creating new files/folders, code reviews

---

### 📁 03-database/
**Database Schema & Best Practices**

| File | Size | Description |
|------|------|-------------|
| [schema-overview.md](./03-database/schema-overview.md) | 9KB | 42 tables, 108 functions, 8 schemas, complete breakdown |
| [detailed-analysis.md](./03-database/detailed-analysis.md) | 12KB | Deep audit, critical findings, health score, issues |
| [best-practices.md](./03-database/best-practices.md) | 22KB | RLS performance (94% faster), query optimization |

**When to read:**
- `schema-overview.md` - Understanding database structure, planning features
- `detailed-analysis.md` - Before any database work, understanding reality
- `best-practices.md` - Writing queries, RLS policies, optimization

**Critical Patterns:**
- Wrap `auth.uid()` in `(select ...)` for 94% faster queries
- Always query from `public` views (not schema tables)
- Add explicit filters to help RLS + query planner
- Index all RLS columns

---

### 📁 04-frontend/
**Frontend Patterns & Best Practices**

| File | Size | Description |
|------|------|-------------|
| [component-patterns.md](./04-frontend/component-patterns.md) | ~25KB | DAL pattern, type safety, component patterns |
| [state-and-performance.md](./04-frontend/state-and-performance.md) | ~8KB | State management, performance optimization |
| [error-handling-and-testing.md](./04-frontend/error-handling-and-testing.md) | ~7KB | Error handling, testing strategies |
| [reference.md](./04-frontend/reference.md) | ~8KB | Quick reference, conventions, checklist |

**When to read:**
- `component-patterns.md` - Building features, DAL pattern, types
- `state-and-performance.md` - State management, caching, optimization
- `error-handling-and-testing.md` - Error boundaries, testing
- `reference.md` - Quick lookups, checklists, conventions

---

## 🗺️ DOCUMENTATION MAP

```
                    ┌─────────────────┐
                    │   START HERE    │
                    │   README.md     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
      ┌──────────────┐ ┌──────────┐ ┌────────────┐
      │  CLAUDE.md   │ │  index   │ │  Project   │
      │ (MANDATORY)  │ │   (You   │ │  Structure │
      │              │ │  are     │ │            │
      │ Development  │ │  here)   │ │ Complete   │
      │    Rules     │ └──────────┘ │ File Tree  │
      └──────┬───────┘              └──────┬─────┘
             │                             │
             └───────────┬─────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
  ┌──────────────┐ ┌──────────┐ ┌────────────────┐
  │   Naming     │ │  Archi-  │ │  Roles &       │
  │ Conventions  │ │  tecture │ │  Routing       │
  │              │ │          │ │                │
  │ File/Folder  │ │ System   │ │ 11 Roles       │
  │   Rules      │ │ Design   │ │ 4 Portals      │
  └──────────────┘ └────┬─────┘ └────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼                           ▼
  ┌──────────────┐           ┌───────────────┐
  │  Frontend    │           │   Database    │
  │  Patterns    │           │  Best         │
  │              │           │  Practices    │
  │ Components   │           │               │
  │ DAL, State   │           │ RLS & Query   │
  └──────────────┘           └───────────────┘
```

---

## 📊 QUICK REFERENCE

### Database
- **42 business tables** across 8 schemas
- **108 database functions**
- **10 queryable public views** (always query these, not schema tables)

### Architecture
- **Single Next.js 15 app** (not monorepo)
- **4 route groups**: (marketing), (customer), (staff), (business), (admin)
- **19 feature modules**: domain-driven architecture
- **11 roles**: super_admin → guest

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript 5.6, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **UI**: shadcn/ui (no custom primitives)
- **Deployment**: Vercel + Supabase Cloud

### File Naming
- **Folders**: `kebab-case/`
- **Components**: `kebab-case.tsx`
- **DAL**: `[feature].queries.ts`
- **Actions**: `[feature].actions.ts`
- **Hooks**: `use-[name].ts`

---

## 🎯 COMMON TASKS

### Starting a New Feature
1. Read [CLAUDE.md](../CLAUDE.md) Critical Rules section
2. Check [02-architecture/project-structure.md](./02-architecture/project-structure.md) for feature structure
3. Follow [02-architecture/naming-conventions.md](./02-architecture/naming-conventions.md) for file names
4. Use [04-frontend/component-patterns.md](./04-frontend/component-patterns.md) for DAL pattern

### Adding Database Queries
1. Read [CLAUDE.md](../CLAUDE.md) Database Rules (public views only)
2. Check [03-database/best-practices.md](./03-database/best-practices.md) for RLS patterns
3. Use [04-frontend/component-patterns.md](./04-frontend/component-patterns.md) for DAL pattern

### Implementing Auth/Roles
1. Read [02-architecture/roles-and-routing.md](./02-architecture/roles-and-routing.md) for middleware
2. Check [CLAUDE.md](../CLAUDE.md) Security section
3. Reference [02-architecture/overview.md](./02-architecture/overview.md) for role hierarchy

### Creating UI Components
1. Read [CLAUDE.md](../CLAUDE.md) UI Rules (shadcn/ui only)
2. Use shadcn/ui components from `components/ui/`
3. Follow [02-architecture/naming-conventions.md](./02-architecture/naming-conventions.md) for file names

---

## ✅ DOCUMENTATION CHECKLIST

Before starting development:
- [ ] Read README.md (project overview)
- [ ] **Read CLAUDE.md** (mandatory - all critical rules)
- [ ] Review project-structure.md (understand structure)
- [ ] Check naming-conventions.md (file naming)

Before writing database queries:
- [ ] Review CLAUDE.md Database Rules (public views only)
- [ ] Read database/best-practices.md (RLS patterns)
- [ ] Check table exists in project-structure.md

Before creating a new feature:
- [ ] Check project-structure.md (feature modules)
- [ ] Follow naming-conventions.md (folder/file naming)
- [ ] Use frontend/component-patterns.md (DAL pattern)

---

## 🔗 EXTERNAL RESOURCES

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📝 MAINTAINING DOCS

### When to Update
- **CLAUDE.md**: When adding new critical rules or patterns
- **project-structure.md**: When adding new features or routes
- **naming-conventions.md**: When establishing new naming patterns
- **overview.md**: When changing architecture decisions
- **roles-and-routing.md**: When adding/changing roles or routes
- **component-patterns.md**: When establishing new patterns
- **best-practices.md**: When discovering new optimization patterns

### Documentation Standards
- Keep docs in sync with code changes
- Use consistent formatting (emoji, headings, code blocks)
- Include code examples for patterns
- Update "Last Updated" dates
- Add cross-references between related docs

---

## 🎓 LEARNING PATH

### Week 1: Foundation
1. Day 1-2: README.md + CLAUDE.md (understand project & rules)
2. Day 3-4: project-structure.md (understand structure)
3. Day 5: naming-conventions.md (learn file naming)

### Week 2: Architecture
1. Day 1-2: overview.md (architecture decisions)
2. Day 3-4: roles-and-routing.md (roles & middleware)
3. Day 5: Review all docs, start coding

### Week 3: Patterns
1. Day 1-3: frontend/component-patterns.md (implement features)
2. Day 4-5: database/best-practices.md (optimize queries)

---

**Navigation**:
[← Back to Project Root](../README.md) | [Development Guidelines →](../CLAUDE.md)

---

*Last Updated*: 2025-10-01
*Total Documentation*: ~200KB across organized structure
*Status*: ✅ Production-Ready
*Architecture*: Single Next.js 15 App with 4 Portals
*Database*: 42 tables, 108 functions, 10 public views
