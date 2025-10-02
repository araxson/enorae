Follow the clean structure pattern in `docs/CLEAN_STRUCTURE_PATTERN.md` and fix ALL remaining issues:

## Critical Issues to Fix:

### 1. Inventory Schema Queries (High Priority)
- Find all `.schema('inventory')` queries in features
- Find all `.schema('organization')` queries in features
- Create public views for inventory tables (products, suppliers, stock_alerts, etc.)
- Update ALL queries to use public views instead of direct schema access
- Update types to use `Database['public']['Views']` not `Tables`

### 2. Missing Feature Folders
Add these folders where appropriate (only if needed):
- `features/[feature]/lib/` - For feature-specific utilities
- `features/[feature]/schemas/` - For Zod validation schemas
- `features/[feature]/hooks/` - For custom React hooks

### 3. Validation Schemas
Create validation schemas for these features:
- `booking/schemas/booking.schemas.ts`
- `appointments-management/schemas/appointment.schemas.ts`
- `services-management/schemas/service.schemas.ts`
- `staff-management/schemas/staff.schemas.ts`

Move existing validation from `lib/validations/` to feature schemas where appropriate.

### 4. Verification
After fixing, verify:
```bash
# No direct schema queries
grep -r "\.schema(" ./features --include="*.ts"

# No createClient in components
grep -r "createClient" ./features --include="index.tsx"

# TypeScript check
pnpm typecheck

# Build check
pnpm build
```

## Success Criteria:
- ✅ All queries use public views (not schemas)
- ✅ All types use Views (not Tables)
- ✅ Features have validation schemas where needed
- ✅ No TypeScript errors
- ✅ Build succeeds

Follow the patterns established in `TRANSFORMATION_COMPLETE.md` and `lib/dal/helpers.ts`.

**Priority**: Fix schema queries FIRST, then add optional folders/schemas.

---

**End of Prompt** - Send this to Claude Code ⬆️
