# Logging Migration Guide
**Target**: Replace 148 console.* statements with structured logger
**Priority**: HIGH
**Estimated Effort**: 2-3 hours with agent assistance

---

## Quick Reference

### Import Pattern
```typescript
// Add to imports
import { logInfo, logWarn, logError, logDebug } from '@/lib/observability'
// OR for operations
import { createOperationLogger } from '@/lib/observability'
```

### Migration Patterns

#### Pattern 1: Simple Error Logging
```typescript
// ❌ BEFORE
console.error('[Component] Error message:', error)

// ✅ AFTER
logError('Error message', {
  error: error instanceof Error ? error : String(error),
  operationName: 'componentAction',
})
```

#### Pattern 2: Info/Debug Logging
```typescript
// ❌ BEFORE
console.log('[Feature] Starting operation')

// ✅ AFTER
logInfo('Starting operation', {
  operationName: 'featureAction',
  userId,
  // ... relevant context
})
```

#### Pattern 3: Warning Logging
```typescript
// ❌ BEFORE
console.warn('[Validation] Invalid input:', value)

// ✅ AFTER
logWarn('Invalid input detected', {
  operationName: 'validation',
  value,
  // ... context
})
```

#### Pattern 4: Operation Logger (Best for Mutations)
```typescript
// ❌ BEFORE
async function createSalon(data: FormData) {
  try {
    console.log('Creating salon')
    // ... operation
    console.log('Salon created successfully')
  } catch (error) {
    console.error('Failed to create salon:', error)
    throw error
  }
}

// ✅ AFTER
async function createSalon(data: FormData) {
  const logger = createOperationLogger('createSalon', { userId })
  logger.start()

  try {
    // ... operation
    logger.success()
  } catch (error) {
    logger.error(error, 'database')
    throw error
  }
}
```

---

## Files by Priority

### Priority 1: Authentication (8 files) 🔴
**Critical for security audit trails**

```
features/auth/login/components/login-form.tsx
features/auth/signup/components/signup-form.tsx
features/auth/verify-otp/api/mutations/resend.ts
features/auth/verify-otp/api/mutations/verify.ts
features/auth/verify-otp/components/resend-otp.tsx
features/auth/forgot-password/api/mutations/request-reset.ts
features/auth/reset-password/api/mutations/reset.ts
features/auth/login/api/mutations/login.ts
```

**Example Fix**:
```typescript
// features/auth/login/components/login-form.tsx:69
// BEFORE
console.error('[LoginForm] unexpected error:', error)

// AFTER
import { logError } from '@/lib/observability'
logError('Login form submission failed', {
  error: error instanceof Error ? error : String(error),
  operationName: 'loginFormSubmit',
})
```

---

### Priority 2: Admin Operations (25 files) 🔴
**Important for administrative audit logs**

```
features/admin/users/api/queries/all-users.ts
features/admin/users/api/queries/single-user.ts
features/admin/security-monitoring/api/queries/data.ts
features/admin/security/api/queries/audit-logs.ts
features/admin/appointments/api/queries/snapshot.ts
features/admin/profile/api/queries/data.ts
features/admin/rate-limit-tracking/api/queries/data.ts
features/admin/reviews/api/queries/index.ts
features/admin/analytics/components/analytics-dashboard.tsx
features/admin/appointments/components/appointments-dashboard.tsx
features/admin/dashboard/components/admin-dashboard.tsx
features/admin/security-monitoring/components/security-dashboard.tsx
features/admin/roles/components/bulk-assign-dialog.tsx
features/admin/moderation/api/moderation-factory.ts
features/admin/admin-common/api/audit.ts
features/admin/admin-common/api/errors.ts
features/admin/chains/api/mutations/audit.ts
features/admin/dashboard/api/mutations/audit.ts
features/admin/roles/api/mutations/audit.ts
features/admin/rate-limit-rules/api/queries/data.ts
features/admin/rate-limit-rules/api/mutations/actions.ts
features/admin/database-toast/api/queries/data.ts
features/admin/database-toast/api/mutations/actions.ts
features/admin/profile/api/mutations/actions.ts
features/admin/session-security/api/queries/data.ts
```

---

### Priority 3: Business Dashboard (15 files) 🟡
**High visibility, user-facing**

```
features/business/dashboard/api/queries/analytics.ts
features/business/dashboard/api/queries/customer.ts
features/business/dashboard/api/queries/operational.ts
features/business/dashboard/api/queries/salon.ts
features/business/dashboard/components/business-dashboard.tsx
features/business/appointments/components/appointment-detail-dialog.tsx
features/business/appointments/components/edit-service-dialog.tsx
features/business/appointments/components/add-service-dialog.tsx
features/business/appointments/components/add-service/add-service-dialog-client.tsx
features/business/appointments/hooks/use-service-form-data.ts (✅ DONE)
features/business/appointments/hooks/use-edit-service-form.ts
features/business/appointments/hooks/use-add-service-form.ts
features/business/business-common/components/export-button.tsx
features/business/locations/hooks/use-address-search.ts
features/business/chains/api/mutations/chain-crud.ts
```

---

### Priority 4: Staff Operations (12 files) 🟡
**Daily operations, moderate traffic**

```
features/staff/dashboard/api/queries.ts
features/staff/dashboard/components/staff-dashboard-page.tsx
features/staff/appointments/api/mutations.ts
features/staff/services/api/mutations.ts
features/staff/profile/api/mutations.ts
features/staff/profile/api/queries.ts
features/staff/schedule/api/mutations/requests.ts
features/staff/clients/components/client-detail-dialog.tsx
features/staff/blocked-times/api/queries.ts
features/shared/portal-shell/components/sidebars/staff-sidebar.tsx
features/shared/portal-shell/components/sidebars/customer-sidebar.tsx
features/shared/ui-components/components/buttons/refresh-button.tsx
```

---

### Priority 5: Customer Features (18 files) 🟢
**User-facing, important for UX**

```
features/customer/profile/hooks/use-preferences-form.ts
features/customer/profile/api/mutations/profile.ts
features/customer/profile/components/profile-metadata-editor.tsx
features/customer/profile/components/profile-preferences-editor.tsx
features/customer/favorites/api/mutations/favorites.ts
features/customer/favorites/components/favorite-button.tsx
features/customer/booking/api/mutations/validate.ts
features/customer/booking/api/mutations/helpers.ts
features/customer/appointments/components/cancel-appointment-dialog.tsx
features/customer/salon-search/hooks/use-search-suggestions.ts
features/customer/salon-search/hooks/use-advanced-search.ts
features/customer/reviews/components/edit-review-dialog.tsx
features/customer/dashboard/components/customer-dashboard.tsx
features/shared/messaging/components/message-thread.tsx
features/shared/notifications/api/queries.ts
features/shared/notifications/api/mutations.ts
features/shared/profile/api/mutations.ts
features/shared/sessions/api/mutations.ts
```

---

### Priority 6: Marketing & Shared (12 files) 🟢
**Lower traffic, public-facing**

```
features/marketing/newsletter/api/mutations/subscribe.ts
features/marketing/explore/api/queries/salons.ts
features/marketing/layout-components/header/user-dropdown.tsx
features/marketing/contact/api/mutations/submit.ts
features/marketing/contact/sections/form/form.tsx
features/marketing/common-components/newsletter-form.tsx
features/shared/portal-shell/components/navigation/nav-favorites.tsx
features/shared/portal-shell/components/navigation/nav-user.tsx
features/shared/profile/components/username-form.tsx
features/shared/profile-metadata/api/mutations.ts
features/shared/profile-metadata/components/portfolio-gallery-section.tsx
features/shared/ui-components/components/error/error-boundary/error-boundary.tsx
```

---

### Priority 7: Analytics & Insights (10 files) 🟢
**Background processing, lower urgency**

```
features/business/analytics/api/queries/service-performance.ts
features/business/analytics/api/queries/customer-analytics.ts
features/business/analytics/api/rpc-functions.ts
features/business/service-performance-analytics/api/queries/service-performance-analytics.ts
features/business/transactions/api/queries/transactions.ts
features/business/metrics-operational/api/queries/metrics-operational.ts
features/business/insights/api/queries/alerts.ts
features/business/insights/api/queries/recommendations.ts
features/business/insights/api/queries/opportunities.ts
features/admin/analytics/api/queries/platform.ts
```

---

### Priority 8: Infrastructure (8 files) ⚪
**System-level, already has some logging**

```
lib/env.ts
lib/supabase/errors.ts
lib/utils/safe-form-data.ts
lib/utils/safe-json.ts
lib/utils/dates/format.ts
lib/auth/session-refresh.ts
lib/middleware/rate-limit/in-memory-limiter.ts
lib/performance/monitoring.tsx
```

---

## Automated Migration Strategy

### Step 1: Use Find & Replace with Verification

#### Error Logs
```bash
# Find
console\.error\('?\[([^\]]+)\]\s*([^']+)'?,\s*(\w+)\)

# Review and replace with
logError('$2', {
  error: $3 instanceof Error ? $3 : String($3),
  operationName: '$1',
})
```

#### Info Logs
```bash
# Find
console\.log\('?\[([^\]]+)\]\s*([^']+)'?\)

# Replace with
logInfo('$2', {
  operationName: '$1',
})
```

### Step 2: Add Imports
After replacing, add imports to each file:
```typescript
import { logInfo, logWarn, logError } from '@/lib/observability'
```

### Step 3: Verify Each File
1. Check TypeScript compilation
2. Test the feature manually
3. Verify logs appear in console (formatted JSON)

---

## Testing Checklist

After migration, verify:

- [ ] TypeScript compiles (`pnpm typecheck`)
- [ ] Logs appear in console as structured JSON
- [ ] Error logs include proper error objects
- [ ] Sensitive data is redacted (passwords, tokens)
- [ ] Operations have proper context (userId, salonId, etc.)
- [ ] Log levels are appropriate (debug vs info vs error)

---

## Error Categories

Use appropriate error categories:
```typescript
type ErrorCategory =
  | 'validation'   // Form validation, input errors
  | 'network'      // API calls, fetch failures
  | 'permission'   // Auth, authorization failures
  | 'system'       // Unexpected errors, crashes
  | 'database'     // Supabase queries, RLS
  | 'payment'      // Transaction failures
  | 'auth'         // Login, logout, session
  | 'not_found'    // 404, missing resources
  | 'unknown'      // Fallback
```

Example:
```typescript
logger.error(error, 'database', { query: 'user lookup' })
```

---

## Common Contexts

Include relevant context in all logs:

**User Context**:
```typescript
{
  userId: user.id,
  operationName: 'actionName',
}
```

**Resource Context**:
```typescript
{
  salonId: salon.id,
  staffId: staff.id,
  appointmentId: appointment.id,
}
```

**Performance Context**:
```typescript
{
  duration: Date.now() - startTime,
  resultCount: data.length,
}
```

---

## Bulk Migration Script (Optional)

For automated migration across multiple files:

```typescript
// migration-script.ts
import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

const files = glob.sync('features/**/*.{ts,tsx}')

files.forEach(file => {
  let content = readFileSync(file, 'utf-8')

  // Add import if console.* exists
  if (content.includes('console.')) {
    if (!content.includes('@/lib/observability')) {
      content = content.replace(
        /import.*from 'react'/,
        `import { logError, logInfo, logWarn } from '@/lib/observability'\n$&`
      )
    }
  }

  // Replace patterns
  content = content.replace(
    /console\.error\(\s*'?\[([^\]]+)\]\s*([^']+)'?,\s*(\w+)\)/g,
    `logError('$2', {\n  error: $3 instanceof Error ? $3 : String($3),\n  operationName: '$1',\n})`
  )

  writeFileSync(file, content)
})
```

**⚠️ Warning**: Always review automated changes before committing!

---

## Progress Tracking

### Summary
- **Total Files**: 148
- **Completed**: 3 ✅
  - `features/admin/users/api/mutations/ban.ts`
  - `features/business/appointments/hooks/use-service-form-data.ts`
  - `components/ui/chart.tsx`
- **Remaining**: 145

### Estimate
- **Per File**: ~1-2 minutes (review + test)
- **Total Time**: ~2-3 hours with agent assistance
- **Can be done incrementally**: Yes, by priority tier

---

## Questions & Support

**Q: What if a file has multiple console statements?**
A: Migrate all in one pass, test the file thoroughly.

**Q: Should I keep console.debug in development?**
A: No, use `logDebug()` which automatically filters by environment.

**Q: What about console.table or console.group?**
A: These are development-only. Replace with logDebug or remove.

**Q: Do I need to update tests?**
A: Mock the logger in tests if needed, or leave console.* in test files.

---

**Migration Start Date**: 2025-11-03
**Target Completion**: 2025-11-10 (1 week)
**Status**: 2% Complete (3/148 files)
