# 🪝 Claude Code Hooks - Enorae Project

> **Enforces mandatory documentation reading and validates all file operations**

## 📋 Overview

These hooks ensure Claude Code AI assistants follow all project rules and documentation before creating, editing, or modifying any files in the Enorae project.

## 🎯 Purpose

**Problem**: AI assistants often skip reading documentation and violate critical project rules.

**Solution**: Mandatory hooks that:
1. Force reading of ALL documentation before starting work
2. Validate every file operation against project rules
3. Block forbidden operations (database changes, wrong naming, etc.)

---

## 🔧 Hook Files

### 1. `claude-code.json` (Hook Configuration)

Defines all hooks and rules for the project.

**Version**: 2.0.0

**Hooks**:
- `pre-chat`: Runs before every chat session (MANDATORY)
- `pre-file-write`: Runs before creating/editing files (MANDATORY)
- `pre-commit`: Runs before git commits (OPTIONAL)

**Rules**:
- 14 mandatory documentation files
- Forbidden actions (database changes, custom UI, etc.)
- Required patterns (DAL, types, naming)
- Critical reminders

---

### 2. `pre-chat.sh` (Documentation Reading Hook)

**Purpose**: Forces Claude to read ALL documentation before starting work.

**What it does**:
1. Lists all 14 mandatory documentation files
2. Shows critical rules (MUST DO / NEVER DO)
3. Displays project quick reference
4. Shows file naming conventions
5. Provides checklist before starting

**Files that MUST be read**:

#### Core (3 files):
- `CLAUDE.md` (13KB) - AI Development Guidelines
- `README.md` (9KB) - Project Overview
- `docs/index.md` (15KB) - Documentation Index

#### Architecture (4 files):
- `docs/02-architecture/overview.md` (28KB)
- `docs/02-architecture/project-structure.md` (51KB)
- `docs/02-architecture/roles-and-routing.md` (12KB)
- `docs/02-architecture/naming-conventions.md` (20KB)

#### Database (3 files):
- `docs/03-database/schema-overview.md` (9KB)
- `docs/03-database/detailed-analysis.md` (12KB)
- `docs/03-database/best-practices.md` (22KB)

#### Frontend (4 files):
- `docs/04-frontend/component-patterns.md` (~25KB)
- `docs/04-frontend/state-and-performance.md` (~8KB)
- `docs/04-frontend/error-handling-and-testing.md` (~7KB)
- `docs/04-frontend/reference.md` (~8KB)

**Total**: ~200KB across 14 files

**Output**: Displays comprehensive checklist and reminders

---

### 3. `pre-file-write.sh` (File Validation Hook)

**Purpose**: Validates every file operation against project rules.

**What it checks**:

#### 1. File Naming Validation
- ❌ Blocks forbidden suffixes: `-v2`, `-new`, `-old`, `-fixed`, `-temp`
- ✅ Enforces kebab-case for components: `salon-card.tsx`
- ✅ Enforces DAL naming: `[feature].queries.ts`
- ✅ Enforces actions naming: `[feature].actions.ts`

#### 2. DAL Content Validation
- ❌ Blocks missing `'server-only'` directive
- ❌ Blocks direct schema queries (`.schema(...)`)
- ❌ Blocks Tables type usage (must use Views)
- ✅ Reminds about auth checks
- ✅ Reminds about public views

#### 3. Database Operations Validation
- ❌ Blocks database migrations without permission
- ⚠️  Warns about custom type definitions

#### 4. UI Component Validation
- ❌ Blocks creation of new UI primitives in `components/ui/`
- ✅ Allows feature-specific components

**Exit codes**:
- `0`: Validation passed, operation allowed
- `1`: Validation failed, operation blocked

---

## 🚀 Usage

### For Claude Code AI Assistants

The hooks run automatically:

1. **On session start**: `pre-chat.sh` displays documentation checklist
2. **Before file operations**: `pre-file-write.sh` validates the operation
3. **Before commits**: `pre-commit.sh` validates code (optional)

### For Developers

You can run hooks manually:

```bash
# Test pre-chat hook
./.claude/hooks/pre-chat.sh

# Test file validation
./.claude/hooks/pre-file-write.sh "path/to/file.tsx" "create"
```

---

## 📖 Critical Rules Enforced

### ✅ MUST DO

1. **Query from public views ONLY**
   ```typescript
   // ✅ CORRECT
   const { data } = await supabase.from('appointments').select('*')

   // ❌ WRONG
   const { data } = await supabase.schema('scheduling').from('appointments')
   ```

2. **Use Views types, not Tables**
   ```typescript
   // ✅ CORRECT
   type Salon = Database['public']['Views']['salons']['Row']

   // ❌ WRONG
   type Salon = Database['public']['Tables']['salons']['Row']
   ```

3. **Add 'server-only' directive in DAL**
   ```typescript
   // ✅ CORRECT
   import 'server-only'
   import { createClient } from '@/lib/supabase/server'
   ```

4. **Check auth in every DAL function**
   ```typescript
   // ✅ CORRECT
   export async function getData() {
     const supabase = await createClient()
     const { data: { user } } = await supabase.auth.getUser()
     if (!user) throw new Error('Unauthorized')
     // ... query
   }
   ```

5. **Use kebab-case for file names**
   ```
   ✅ salon-card.tsx
   ✅ booking-form.tsx
   ❌ SalonCard.tsx
   ❌ booking_form.tsx
   ```

6. **Wrap auth.uid() in SELECT for RLS**
   ```sql
   -- ✅ CORRECT (94% faster)
   create policy "user_access" on todos
   to authenticated
   using ( (select auth.uid()) = user_id );

   -- ❌ WRONG (slow)
   using ( auth.uid() = user_id );
   ```

### ❌ NEVER DO

1. Create or modify database tables/schema
2. Query schema tables directly (`.schema(...)`)
3. Use Tables types (use Views types)
4. Create custom UI primitives
5. Use 'any' types
6. Skip auth checks in DAL
7. Create files with `-v2`, `-new`, `-fixed` suffixes

---

## 🔍 Validation Examples

### Example 1: Valid DAL File

```typescript
// features/salon-discovery/dal/salons.queries.ts
import 'server-only'  // ✅ Required
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Views']['salons']['Row']  // ✅ Views

export async function getSalons() {
  const supabase = await createClient()

  // ✅ Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // ✅ Public view query
  const { data } = await supabase.from('salons').select('*')

  return data
}
```

**Hook result**: ✅ PASS

---

### Example 2: Invalid DAL File

```typescript
// features/salon-discovery/dal/salons.queries.ts
// ❌ Missing 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Salon = Database['public']['Tables']['salons']['Row']  // ❌ Tables

export async function getSalons() {
  const supabase = await createClient()

  // ❌ No auth check

  // ❌ Schema query
  const { data } = await supabase.schema('organization').from('salons').select('*')

  return data
}
```

**Hook result**: ❌ BLOCKED with errors:
- Missing 'server-only' directive
- Using Tables instead of Views
- Direct schema query detected

---

### Example 3: Invalid File Name

```bash
# Attempting to create:
features/salon-discovery/components/salon-card-v2.tsx
```

**Hook result**: ❌ BLOCKED
```
❌ FORBIDDEN: File name contains forbidden suffix: salon-card-v2.tsx
   Rule: Never use suffixes like -v2, -new, -old, -fixed, -temp
   See: docs/02-architecture/naming-conventions.md
```

---

## 🛠️ Hook Development

### Adding New Validation Rules

Edit `pre-file-write.sh` and add new check functions:

```bash
check_new_rule() {
    local file="$1"

    # Your validation logic
    if [[ condition ]]; then
        echo -e "${RED}❌ FORBIDDEN: Your error message${NC}"
        return 1
    fi

    return 0
}

# Add to main validation
check_new_rule "$FILE_PATH" || exit 1
```

### Testing Hooks

```bash
# Test pre-chat
./.claude/hooks/pre-chat.sh

# Test file validation
./.claude/hooks/pre-file-write.sh "test.tsx" "create"

# Test with actual file
./.claude/hooks/pre-file-write.sh "features/test/dal/test.queries.ts" "create"
```

---

## 📚 Related Documentation

- **Hook Config**: `.claude/hooks/claude-code.json`
- **Main Rules**: `CLAUDE.md`
- **Naming**: `docs/02-architecture/naming-conventions.md`
- **DAL Pattern**: `docs/04-frontend/component-patterns.md`
- **Database Rules**: `docs/03-database/best-practices.md`

---

## 🎯 Success Criteria

A hook is working correctly when:

1. ✅ Claude reads ALL documentation before starting
2. ✅ Invalid file names are blocked
3. ✅ DAL files without 'server-only' are blocked
4. ✅ Schema queries are blocked
5. ✅ Custom UI components are blocked
6. ✅ Database migrations require explicit permission

---

**Last Updated**: 2025-10-01
**Version**: 2.0.0
**Status**: ✅ Active & Enforced
