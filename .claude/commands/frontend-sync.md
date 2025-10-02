# Frontend Database Sync - Complete Analysis & Implementation

Perform a comprehensive database-to-frontend sync analysis and implement missing features.

## Execution Steps

### 1. Database Analysis
- Read and analyze the complete database schema from `docs/03-database/schema-overview.md`
- Count total tables (42), functions (108), and public views (10)
- Review all 8 business domain schemas:
  - organization (8 tables)
  - catalog (5 tables)
  - scheduling (5 tables)
  - inventory (11 tables)
  - identity (5 tables)
  - communication (3 tables)
  - analytics (3 tables)
  - engagement (1 table)

### 2. Frontend Coverage Audit
- List all existing feature modules in `features/` directory
- Count all pages in `app/` directory
- Map each database table to frontend implementation
- Identify tables with 0% frontend coverage
- Calculate overall database coverage percentage

### 3. Gap Identification
Create a comprehensive gap analysis report covering:

**For each missing feature, identify:**
- Database tables available
- Database functions available
- Required DAL functions
- Required server actions
- Required UI components
- Required pages and routes
- Priority level (High/Medium/Low)
- Estimated implementation time

**Priority Classification:**
- 🔴 **Priority 1 (High)**: Business-critical features (inventory, messaging, scheduling)
- 🟡 **Priority 2 (Medium)**: Important features (analytics, settings, engagement)
- 🟢 **Priority 3 (Low)**: Nice-to-have features (preferences, advanced rules)

### 4. Quick Wins Implementation

**Automatically implement Priority 1 quick wins where backend exists:**

For each quick win feature:

1. **Create Feature Structure**
   ```bash
   mkdir -p features/{feature-name}/{dal,actions,components}
   ```

2. **Create DAL Functions** (`features/{feature}/dal/{feature}.queries.ts`)
   - Add `'server-only'` directive
   - Import types from `@/lib/types/database.types`
   - Create type-safe query functions
   - Always check auth first
   - Query from public views (not schema tables directly)
   - Export relationship types (e.g., `TypeWithRelations`)

3. **Create Server Actions** (`features/{feature}/actions/{feature}.actions.ts`)
   - Add `'use server'` directive
   - Implement UUID validation regex
   - Add proper Zod validation schemas
   - Implement try-catch error handling
   - Check auth with `auth.getUser()`
   - Verify ownership before mutations
   - Use schema tables for INSERT/UPDATE
   - Call `revalidatePath()` after mutations

4. **Create UI Components** (`features/{feature}/components/`)
   - Use only shadcn/ui primitives
   - Use layout components from `@/components/layout`
   - Use typography components from `@/components/ui/typography`
   - Implement proper client/server component separation
   - Add loading and error states

5. **Create Feature Index** (`features/{feature}/index.tsx`)
   - Server component by default
   - Fetch data via DAL
   - Compose UI components
   - Handle empty states

6. **Create Pages** (`app/(portal)/{feature}/page.tsx`)
   - Ultra-thin (5-15 lines max)
   - Only render feature component
   - Add proper metadata
   - Pass route params if needed

### 5. Integration Points

**For each new feature, check integration needs:**
- Add navigation links to appropriate sidebars
- Add routes to middleware if protected
- Update related components with new functionality
- Add favorite/like buttons where applicable
- Cross-link related features

### 6. Verification

**After implementation:**
```bash
# TypeScript compilation
pnpm tsc --noEmit

# Production build
pnpm build
```

**Must pass:**
- ✅ 0 TypeScript errors
- ✅ 0 build errors
- ✅ All new routes compile successfully

### 7. Documentation

**Create/update these files:**

1. **`docs/FRONTEND_IMPLEMENTATION_GAPS.md`**
   - Complete gap analysis
   - Coverage matrix by schema
   - Missing features list with priorities
   - Implementation roadmap

2. **`docs/FRONTEND_SYNC_REPORT.md`** (create new)
   - What was analyzed
   - What was implemented
   - Files created/modified
   - Routes added
   - Coverage improvement percentage
   - Next recommended features

### 8. Summary Report

**Provide final summary:**
- Total database tables: X
- Total database functions: X
- Current frontend coverage: X%
- Features implemented this session: X
- New pages created: X
- Files created: X
- Files modified: X
- TypeScript status: PASS/FAIL
- Build status: PASS/FAIL
- Next recommended features: [list]

## Implementation Priorities

### Phase 1: Quick Wins (2-4 hours each)
1. Customer Favorites (if not done)
2. Staff Schedule Viewer
3. Enhanced Analytics Dashboard
4. Blocked Times Management

### Phase 2: Important Features (6-10 hours each)
5. Messaging System
6. Salon Settings & Operating Hours
7. Time-Off Requests
8. Customer Engagement (Loyalty/Referrals)

### Phase 3: Major Features (15-25 hours each)
9. Complete Inventory Management
10. Purchase Order System
11. Product Usage Tracking
12. Advanced Booking Rules

## Code Quality Standards

**All implementations must follow:**

### Database Patterns
```typescript
// ✅ CORRECT - Query from public views
const { data } = await supabase.from('appointments').select('*')

// ❌ WRONG - Never query schema tables directly for SELECT
const { data } = await supabase.schema('scheduling').from('appointments')

// ✅ CORRECT - Use schema tables for INSERT/UPDATE
await supabase.schema('scheduling').from('appointments').insert(data)
```

### Type Safety
```typescript
// ✅ CORRECT - Use Views types for queries
type Appointment = Database['public']['Views']['appointments']['Row']

// ✅ CORRECT - Export relationship types
export type AppointmentWithRelations = Appointment & {
  customer: { id: string; full_name: string | null } | null
}

// ❌ FORBIDDEN - Never use 'any'
const data: any = await query()
```

### Security
```typescript
// ✅ REQUIRED - Always check auth
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')

// ✅ REQUIRED - UUID validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
if (!UUID_REGEX.test(id)) return { error: 'Invalid ID format' }

// ✅ REQUIRED - Ownership verification for mutations
const { data: salon } = await supabase
  .from('salons')
  .select('owner_id')
  .eq('id', salonId)
  .single()

if (salon?.owner_id !== user.id) {
  throw new Error('Unauthorized: Not your resource')
}
```

### UI Components
```typescript
// ✅ REQUIRED - Use shadcn/ui components
import { Button, Card, Input } from '@/components/ui/*'

// ✅ REQUIRED - Use layout components
import { Stack, Grid, Flex } from '@/components/layout'

// ✅ REQUIRED - Use typography components
import { H1, H2, P, Muted } from '@/components/ui/typography'

// ❌ FORBIDDEN - Don't create custom primitives
// Don't create custom Button, Input, Card components
```

## Success Criteria

**This command is successful when:**
- ✅ Complete gap analysis document created
- ✅ At least 1-3 quick win features implemented
- ✅ All new code passes TypeScript compilation
- ✅ Production build succeeds
- ✅ Database coverage increased by 5-15%
- ✅ Comprehensive report generated
- ✅ Next steps clearly documented

## Notes

- Focus on features where backend already exists (quick wins)
- Prioritize business-critical features (inventory, messaging, scheduling)
- Maintain ultra-thin page architecture (5-15 lines max)
- Follow all existing patterns from CLAUDE.md
- Use existing components, never create new UI primitives
- Always verify with TypeScript and build before completion

---

**Expected Duration**: 2-6 hours depending on features implemented
**Output**: 1-3 new features, complete documentation, verified build
