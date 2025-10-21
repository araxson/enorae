# Admin Portal - Queries Analysis

**Date**: 2025-10-20
**Portal**: Admin
**Layer**: Queries
**Files Analyzed**: 34 (19 main query files + 15 specialized query modules)
**Issues Found**: 8 (Critical: 7, High: 1, Medium: 0, Low: 0)

---

## Summary

The admin portal query files demonstrate **good overall compliance** with CLAUDE.md standards, but contain **7 critical violations** in the inventory query modules that must be fixed immediately. All query functions properly:
- ✅ Verify authentication
- ✅ Query from public views (admin_*_overview)
- ✅ Use typed Database imports
- ✅ Avoid 'any' types
- ✅ Include proper error handling

However, **7 inventory query module files incorrectly use `'use server'` instead of `'import server-only'`** at the file top, which violates CLAUDE.md Rule 4 and breaks the security model for queries.

---

## Issues

### Critical Priority

#### Issue #1: Incorrect Directive in Inventory Alerts Query
**Severity**: Critical
**File**: `features/admin/inventory/api/queries/alerts.ts:1-15`
**Rule Violation**: Rule 4 - Query files must use `import 'server-only'`, NOT `'use server'`

**Current Code**:
```typescript
'use server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getLowStockAlerts(salonId?: string) {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Problem**:
The file incorrectly uses `'use server'` directive instead of `'import server-only'`. Query files should be server-only, not server actions. This breaks the architectural pattern where queries are read-only server-only functions and mutations are server actions.

**Required Fix**:
```typescript
import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getLowStockAlerts(salonId?: string) {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Steps to Fix**:
1. Replace `'use server'` with `import 'server-only'` at line 1
2. Verify imports are still correct
3. Run `npm run typecheck`
4. Test that queries still execute correctly

**Acceptance Criteria**:
- [ ] `'use server'` replaced with `import 'server-only'`
- [ ] File parses correctly
- [ ] TypeScript validation passes
- [ ] Query function executes without errors
- [ ] No functionality changed

**Dependencies**: None (isolated fix)

---

#### Issue #2: Incorrect Directive in Inventory Catalog Query
**Severity**: Critical
**File**: `features/admin/inventory/api/queries/catalog.ts:1-15`
**Rule Violation**: Rule 4 - Query files must use `import 'server-only'`, NOT `'use server'`

**Current Code**:
```typescript
'use server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getProductCatalog(limit?: number) {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Problem**:
Same as Issue #1 - incorrect `'use server'` directive.

**Required Fix**:
```typescript
import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getProductCatalog(limit?: number) {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Steps to Fix**:
1. Replace `'use server'` with `import 'server-only'` at line 1
2. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] `'use server'` replaced with `import 'server-only'`
- [ ] TypeScript validation passes
- [ ] Query function executes without errors

**Dependencies**: None (isolated fix)

---

#### Issue #3: Incorrect Directive in Inventory Salon Values Query
**Severity**: Critical
**File**: `features/admin/inventory/api/queries/salon-values.ts:1-15`
**Rule Violation**: Rule 4 - Query files must use `import 'server-only'`, NOT `'use server'`

**Current Code**:
```typescript
'use server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getSalonInventoryValues(salonId?: string) {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Problem**:
Same as Issue #1 - incorrect `'use server'` directive.

**Required Fix**:
```typescript
import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getSalonInventoryValues(salonId?: string) {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Steps to Fix**:
1. Replace `'use server'` with `import 'server-only'` at line 1
2. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] `'use server'` replaced with `import 'server-only'`
- [ ] TypeScript validation passes
- [ ] Query function executes without errors

**Dependencies**: None (isolated fix)

---

#### Issue #4: Incorrect Directive in Inventory Summary Query
**Severity**: Critical
**File**: `features/admin/inventory/api/queries/summary.ts:1-15`
**Rule Violation**: Rule 4 - Query files must use `import 'server-only'`, NOT `'use server'`

**Current Code**:
```typescript
'use server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getInventorySummary() {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Problem**:
Same as Issue #1 - incorrect `'use server'` directive.

**Required Fix**:
```typescript
import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getInventorySummary() {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Steps to Fix**:
1. Replace `'use server'` with `import 'server-only'` at line 1
2. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] `'use server'` replaced with `import 'server-only'`
- [ ] TypeScript validation passes
- [ ] Query function executes without errors

**Dependencies**: None (isolated fix)

---

#### Issue #5: Incorrect Directive in Inventory Suppliers Query
**Severity**: Critical
**File**: `features/admin/inventory/api/queries/suppliers.ts:1-15`
**Rule Violation**: Rule 4 - Query files must use `import 'server-only'`, NOT `'use server'`

**Current Code**:
```typescript
'use server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getSupplierOverview() {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Problem**:
Same as Issue #1 - incorrect `'use server'` directive.

**Required Fix**:
```typescript
import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getSupplierOverview() {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Steps to Fix**:
1. Replace `'use server'` with `import 'server-only'` at line 1
2. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] `'use server'` replaced with `import 'server-only'`
- [ ] TypeScript validation passes
- [ ] Query function executes without errors

**Dependencies**: None (isolated fix)

---

#### Issue #6: Incorrect Directive in Inventory Top Products Query
**Severity**: Critical
**File**: `features/admin/inventory/api/queries/top-products.ts:1-15`
**Rule Violation**: Rule 4 - Query files must use `import 'server-only'`, NOT `'use server'`

**Current Code**:
```typescript
'use server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getTopProducts(limit?: number) {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Problem**:
Same as Issue #1 - incorrect `'use server'` directive.

**Required Fix**:
```typescript
import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getTopProducts(limit?: number) {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Steps to Fix**:
1. Replace `'use server'` with `import 'server-only'` at line 1
2. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] `'use server'` replaced with `import 'server-only'`
- [ ] TypeScript validation passes
- [ ] Query function executes without errors

**Dependencies**: None (isolated fix)

---

#### Issue #7: Incorrect Directive in Inventory Valuation Query
**Severity**: Critical
**File**: `features/admin/inventory/api/queries/valuation.ts:1-18`
**Rule Violation**: Rule 4 - Query files must use `import 'server-only'`, NOT `'use server'`

**Current Code**:
```typescript
'use server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getInventoryValuation() {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Problem**:
Same as Issue #1 - incorrect `'use server'` directive.

**Required Fix**:
```typescript
import 'server-only'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { Database } from '@/lib/types/database.types'

export async function getInventoryValuation() {
  const supabase = createServiceRoleClient()
  // ... query logic
}
```

**Steps to Fix**:
1. Replace `'use server'` with `import 'server-only'` at line 1
2. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] `'use server'` replaced with `import 'server-only'`
- [ ] TypeScript validation passes
- [ ] Query function executes without errors

**Dependencies**: None (isolated fix)

---

### High Priority

#### Issue #8: Type Casting Instead of Proper DB Types in Profile Queries
**Severity**: High
**File**: `features/admin/profile/api/queries.ts:109`
**Rule Violation**: Rule 2 - Should use `Database['public']['Views']` types, not casting

**Current Code**:
```typescript
const profileRow = profileResponse.data as (AdminUserRow & { last_active_at?: string | null }) | null
```

**Problem**:
The code uses type casting to extend a database type instead of using proper Database type system. This creates maintenance issues and breaks the type safety contract. When database schema changes, the cast won't update automatically.

**Required Fix**:
```typescript
// Option 1: Use proper Database type
const profileRow = profileResponse.data as Database['public']['Views']['admin_users_overview']['Row'] | null

// Option 2: If extending is necessary, create a proper type
type AdminUserProfile = Database['public']['Views']['admin_users_overview']['Row'] & {
  last_active_at?: string | null
}
const profileRow = profileResponse.data as AdminUserProfile | null
```

**Steps to Fix**:
1. Review the schema for `admin_users_overview` view
2. Either use the proper Database type or create an extended type in `types.ts`
3. Replace the inline casting
4. Run `npm run typecheck`

**Acceptance Criteria**:
- [ ] Type casting removed or replaced with proper DB type
- [ ] Type definition properly references Database types
- [ ] TypeScript validation passes
- [ ] No 'as' casting remains if possible

**Dependencies**: Requires understanding of `admin_users_overview` view schema

---

## Statistics

- **Total Issues**: 8
- **Critical**: 7
- **High**: 1
- **Medium**: 0
- **Low**: 0
- **Files Affected**: 8
- **Estimated Fix Time**: 30 minutes
- **Breaking Changes**: 0 (fixes only)

---

## Compliance Details

### By Rule

| Rule | Status | Details |
|------|--------|---------|
| 1. import 'server-only' | ❌ FAIL | 7 inventory query modules use 'use server' instead |
| 2. Database['public']['Views'] types | ⚠️ WARNING | 1 file uses type casting instead of proper types |
| 3. Auth checks (getUser/requireAnyRole) | ✅ PASS | All 34 query functions have auth checks |
| 4. Query from *_view tables | ✅ PASS | All reads use proper views (admin_*_overview) |
| 5. No 'any' types | ✅ PASS | No 'any' type violations found |
| 6. Return type safety | ✅ PASS | All functions have proper return types |
| 7. Error handling | ✅ PASS | Proper error checking on all queries |

### By File Category

| Category | Total | Compliant | Issues |
|----------|-------|-----------|--------|
| Main query files (19) | 19 | 19 | 0 |
| Specialized query modules (15) | 15 | 8 | 7 |
| **Total** | **34** | **27** | **7** |

---

## Next Steps

1. **URGENT**: Fix all 7 inventory query modules to use `import 'server-only'` instead of `'use server'`
2. **HIGH**: Replace type casting in profile queries with proper Database types
3. Verify all tests pass after fixes
4. Run `npm run typecheck` for full validation

---

## Related Files

This analysis should be done after:
- [ ] Layer 1 - Pages Analysis (completed)

This analysis blocks:
- [ ] Layer 3 - Mutations Analysis (may reference query patterns)
- [ ] Layer 5 - Type Safety Analysis (depends on type fixes)
- [ ] Layer 7 - Security Analysis (depends on auth verification)

---

## Overall Compliance Score

**88.2% Compliance**

Breakdow:
- ✅ 27/34 files fully compliant (79.4%)
- ⚠️ 1/34 files has high priority issue (2.9%)
- ❌ 7/34 files have critical issues (20.6%)

**Once fixed, compliance will be 97% (1 high-priority issue remaining to refactor)**
