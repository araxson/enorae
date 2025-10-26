# Pass 2: Comprehensive File Organization Audit & Remediation Report

**Date:** 2025-10-25  
**Status:** Analysis Complete - Ready for Execution  
**Objective:** Consolidate custom API files, split large files, eliminate anti-patterns  

---

## Executive Summary

Pass 1 successfully restored type files and created barrel exports. Pass 2 focuses on three major violations:

1. **Custom-Named API Files** - Files like `actions.ts`, `helpers.ts`, `analytics.ts` exist alongside canonical `queries.ts`/`mutations.ts`
2. **Large API Files** - 9 files exceed 300-line threshold and must be split into domain subdirectories
3. **Anti-Pattern Directories** - 20+ `/api/internal/` directories violate canonical structure

**Impact:** These violations prevent consistent import patterns and make codebase navigation unpredictable.

---

## Validation Baseline

```bash
# Before Pass 2
npm run typecheck
# Status: PASS (file organization errors: 0, logic errors may exist)

# Custom API files found: 45+
find features -type f -path '*/api/*.ts' ! -name 'queries.ts' ! -name 'mutations.ts' ! -name 'types.ts' ! -name 'schema.ts' ! -name 'index.ts' ! -path '*/api/internal/*' ! -path '*/api/queries/*' ! -path '*/api/mutations/*' | wc -l

# Large files (300+ lines): 9
wc -l features/*/*/api/{queries,mutations}.ts | grep -E '^\s+[3-9][0-9]{2,}\s' | wc -l

# /api/internal/ directories: 20+
find features -type d -path '*/api/internal' | wc -l
```

---

## Priority 1: Custom-Named API Files (45+ Files)

### Category 1A: Query Helpers (Move to queries.ts or lib/)

These files contain helper functions or utility types used by queries:

```
features/business/metrics/api/analytics.ts              (81 lines) - Types & helpers
features/business/insights/api/business-insights.ts    (72 lines) - Query helpers
features/business/insights/api/customer-analytics.ts   (85 lines) - Query helpers
features/business/insights/api/churn-prediction.ts     (68 lines) - Prediction logic
features/admin/analytics/api/admin-analytics-shared.ts (43 lines) - Shared helpers
features/admin/analytics/api/admin-analytics-types.ts  (52 lines) - Type definitions
features/admin/analytics/api/rpc-functions.ts          (38 lines) - RPC wrappers
features/business/analytics/api/rpc-functions.ts       (29 lines) - RPC wrappers
features/admin/messages/api/messages-dashboard.ts      (96 lines) - Dashboard aggregator
features/admin/messages/api/message-dashboard-analytics.ts (71 lines) - Analytics helpers
features/admin/messages/api/message-dashboard-helpers.ts   (65 lines) - Helper utilities
features/admin/appointments/api/alerts.ts              (58 lines) - Alert helpers
features/admin/appointments/api/metrics.ts             (47 lines) - Metrics aggregation
features/admin/appointments/api/salons.ts              (54 lines) - Salon queries
features/admin/security-monitoring/api/failed-logins.ts (63 lines) - Login analytics
features/admin/security-monitoring/api/helpers.ts      (71 lines) - Security helpers
features/admin/security/api/monitoring.ts              (55 lines) - Monitoring logic
```

**Remediation Pattern:**

```bash
# 1. Merge helper functions into queries.ts under appropriate sections

# Before (Split across files):
features/admin/appointments/api/alerts.ts
features/admin/appointments/api/metrics.ts
features/admin/appointments/api/salons.ts
features/admin/appointments/api/queries.ts

# After (Consolidated):
features/admin/appointments/api/queries.ts  # All read operations + helpers
# Delete alerts.ts, metrics.ts, salons.ts
```

**Specific Examples:**

#### Example 1: features/admin/appointments/

**Before:**
```
api/
├── alerts.ts       (helpers for alert detection)
├── metrics.ts      (helpers for metric aggregation)
├── salons.ts       (query wrappers)
├── queries.ts      (main queries)
└── mutations.ts    (main mutations)
```

**After:**
```
api/
├── queries.ts      # Consolidated: all reads + helpers
└── mutations.ts    # All writes
```

**Steps:**
1. Open `features/admin/appointments/api/alerts.ts` - copy all functions
2. Paste into `features/admin/appointments/api/queries.ts` under `// === Alert Helpers ===` section
3. Remove `alerts.ts`, `metrics.ts`, `salons.ts` files
4. Find all imports of these files:
   ```bash
   rg "from '@/features/admin/appointments/api/(alerts|metrics|salons)" --type tsx
   ```
5. Update imports to:
   ```typescript
   // Before
   import { getAlertMetrics } from '@/features/admin/appointments/api/alerts'
   
   // After
   import { getAlertMetrics } from '@/features/admin/appointments/api/queries'
   ```

### Category 1B: Mutation/Action Files (Move to mutations.ts)

These files contain server actions/mutations:

```
features/business/appointments/api/actions.ts     (82 lines) - Status updates
features/business/notifications/api/actions.ts    (76 lines) - Notification actions
features/admin/profile/api/actions.ts             (91 lines) - Profile actions
```

**Remediation Pattern:**

```bash
# 1. Append actions.ts content to mutations.ts
# 2. Remove actions.ts
# 3. Update all imports

# Find imports
rg "from '@/features/business/appointments/api/actions'" --type tsx

# Replace with
"from '@/features/business/appointments/api/mutations'"
```

#### Example: features/business/appointments/

**Current Issue:**
```typescript
// components/appointment-card.tsx
import { updateAppointmentStatus } from '@/features/business/appointments/api/actions'

// api/mutations.ts (DUPLICATE - same function defined here too!)
export async function updateAppointmentStatus(...) { ... }

// api/actions.ts (DUPLICATE)
export async function updateAppointmentStatus(...) { ... }
```

**Fix:**
1. Keep only mutations.ts definition
2. Delete actions.ts
3. Update all imports to mutations.ts
4. Run `npm run typecheck` to verify

### Category 1C: Shared Utilities (Move to lib/)

These are cross-cutting helpers that belong in `lib/`:

```
features/business/settings-audit-logs/api/helpers.ts  (103 lines) - Audit formatting
features/business/business-common/api/export-utils.ts (87 lines) - Export utilities
features/admin/dashboard/api/internal/helpers.ts      (94 lines) - Dashboard helpers
features/admin/profile/api/profile-helpers.ts        (112 lines) - Profile utilities
features/admin/profile/api/utils.ts                  (68 lines) - Profile utilities
```

**Remediation Pattern:**

```bash
# 1. Create lib directory for feature
mkdir -p lib/features/{business,admin}/{feature}

# 2. Move helper file
mv features/admin/appointments/api/helpers.ts lib/features/admin/appointments/helpers.ts

# 3. Update all imports
# Before: import { ... } from '@/features/admin/appointments/api/helpers'
# After:  import { ... } from '@/lib/features/admin/appointments/helpers'
```

---

## Priority 2: Large Files Requiring Split (9 Files)

### Files Exceeding 300-Line Threshold

Per `file-organization-patterns.md`, files should be split when exceeding 300 lines:

| File | Lines | Recommendation |
|------|-------|-----------------|
| `admin/moderation/api/queries.ts` | 464 | MUST SPLIT - Sentiment analysis + reviews + messages |
| `admin/chains/api/mutations.ts` | 327 | SPLIT - Lifecycle + verification + subscription logic |
| `business/chains/api/mutations.ts` | 322 | SPLIT - CRUD + settings + verification |
| `business/notifications/api/queries.ts` | 321 | SPLIT - Notifications + preferences + templates |
| `staff/clients/api/queries.ts` | 329 | SPLIT - Clients + history + analytics |
| `staff/clients/api/mutations.ts` | 332 | SPLIT - Client operations + status updates |
| `staff/time-off/api/mutations.ts` | 330 | SPLIT - Requests + approvals + updates |
| `admin/salons/api/queries.ts` | 320 | SPLIT - Salon queries + health + compliance |
| `staff/analytics/api/queries.ts` | 307 | SPLIT - Analytics operations |

### Splitting Strategy: Stage 2 → Domain Subdirectories

**Target Structure:**
```
api/
├── queries/
│   ├── index.ts         # Re-export all
│   ├── domain1.ts       # Related functions (< 150 lines each)
│   ├── domain2.ts
│   └── domain3.ts
└── mutations/
    ├── index.ts         # Re-export all
    ├── domain1.ts
    └── domain2.ts
```

#### Example: admin/moderation/api/queries.ts (464 lines → 3 files)

**Analysis of Functions:**

```typescript
// Domain 1: Sentiment Analysis (Helper functions + types)
- analyzeSentiment()
- calculateFakeLikelihood()
- calculateQualityScore()
- calculateReputationScore()
- Type: SentimentResult, FakeLikelihoodInput, QualityScoreInput, ReputationStats, ReputationResult

// Domain 2: Review Queries  
- getReviewsForModeration()
- getFlaggedReviews()
- Type: ModerationFilters, ModerationReview

// Domain 3: Message & Stats Queries
- getMessageThreadsForMonitoring()
- getModerationStats()
- Type: ModerationStats
```

**Remediation Steps:**

1. **Create domain files:**
   ```bash
   touch /Users/afshin/Desktop/Enorae/features/admin/moderation/api/queries/index.ts
   touch /Users/afshin/Desktop/Enorae/features/admin/moderation/api/queries/sentiment.ts
   touch /Users/afshin/Desktop/Enorae/features/admin/moderation/api/queries/reviews.ts
   touch /Users/afshin/Desktop/Enorae/features/admin/moderation/api/queries/monitoring.ts
   ```

2. **Split content:**
   
   `api/queries/sentiment.ts`:
   ```typescript
   import 'server-only'
   
   // All sentiment analysis types and helper functions
   type SentimentLabel = 'positive' | 'neutral' | 'negative'
   interface SentimentResult { ... }
   interface FakeLikelihoodInput { ... }
   // ... all sentiment-related functions ...
   
   export function analyzeSentiment(text: string | null): SentimentResult { ... }
   export function calculateFakeLikelihood(input: FakeLikelihoodInput): number { ... }
   // ... export all sentiment functions ...
   ```

   `api/queries/reviews.ts`:
   ```typescript
   import 'server-only'
   import { createServiceRoleClient } from '@/lib/supabase/service-role'
   import type { Database } from '@/lib/types/database.types'
   
   export interface ModerationFilters { ... }
   export interface ModerationReview extends ReviewRow { ... }
   
   export async function getReviewsForModeration(...) { ... }
   export async function getFlaggedReviews(): Promise<ModerationReview[]> { ... }
   ```

   `api/queries/monitoring.ts`:
   ```typescript
   import 'server-only'
   
   export interface ModerationStats { ... }
   
   export async function getMessageThreadsForMonitoring(): Promise<MessageThread[]> { ... }
   export async function getModerationStats(): Promise<ModerationStats> { ... }
   ```

   `api/queries/index.ts`:
   ```typescript
   // Re-export all for clean imports
   export * from './sentiment'
   export * from './reviews'
   export * from './monitoring'
   ```

3. **Delete original file:**
   ```bash
   rm /Users/afshin/Desktop/Enorae/features/admin/moderation/api/queries.ts
   ```

4. **Update imports:**
   ```bash
   # Find all imports of old location
   rg "from '@/features/admin/moderation/api/queries'" --type tsx
   
   # No change needed! Imports still work because of index.ts re-export
   ```

5. **Verify:**
   ```bash
   npm run typecheck
   ```

---

## Priority 3: Anti-Pattern /api/internal/ (20+ Directories)

### The Problem

`/api/internal/` violates canonical structure. Per patterns documentation:
- Internal implementation details should be helpers in queries/mutations
- Subdirectories should be for domain grouping, not "internal vs external"
- Import paths become unpredictable

### Current Anti-Pattern

```
features/business/notifications/api/
├── internal/
│   ├── constants.ts
│   ├── notification-counts.ts
│   ├── notification-preferences.ts
│   ├── notification-queries.ts
│   └── notification-stats.ts
├── queries.ts      (only 45 lines)
└── mutations.ts
```

### Canonical Pattern

```
features/business/notifications/api/
├── queries/
│   ├── index.ts              # Re-export
│   ├── counts.ts             # Notification counts
│   ├── preferences.ts        # Notification preferences
│   └── stats.ts              # Notification stats
└── mutations.ts
```

### Affected Features (20+ directories)

```
features/business/
├── appointments/api/internal/           → queries/{domain}/
├── chains/api/internal/                 → queries/{domain}/
├── notifications/api/internal/          → queries/{domain}/
├── reviews/api/internal/                → queries/{domain}/ + mutations/{domain}/
├── settings-roles/api/internal/         → queries/{domain}/ + mutations/{domain}/
├── staff/api/internal/                  → queries/{domain}/
├── staff-schedules/api/internal/        → mutations/{domain}/
├── staff-services/api/internal/         → queries/{domain}/ + mutations/{domain}/

features/admin/
├── analytics/api/internal/              → queries/{domain}/
├── chains/api/internal/                 → mutations/{domain}/
├── dashboard/api/internal/              → queries/{domain}/
├── database-health/api/internal/        → queries/{domain}/
├── moderation/api/internal/             → mutations/{domain}/
├── salons/api/internal/                 → queries/{domain}/ + mutations/{domain}/
├── staff/api/internal/                  → queries/{domain}/

features/shared/
├── auth/api/internal/                   → queries.ts + mutations.ts
├── messaging/api/internal/              → queries.ts + mutations.ts

features/marketing/
├── salon-directory/api/internal/        → queries.ts
├── services-directory/api/internal/     → queries.ts

features/staff/
└── clients/api/internal/                → queries/{domain}/ + mutations/{domain}/
```

### Remediation Process

#### Step 1: Assessment - Check each /api/internal/ directory

```bash
# For each directory, count lines in files
for dir in features/*/*/api/internal/; do
  echo "=== $dir ==="
  find "$dir" -type f -name "*.ts" -exec wc -l {} + | tail -1
done
```

#### Step 2: Consolidation Decision

**If internal/ files total < 300 lines:**
→ Merge into main `queries.ts` or `mutations.ts`

**If internal/ files total 300-500 lines:**
→ Create `queries/{domain}/` structure with index.ts

**If internal/ files total > 500 lines:**
→ Create `queries/{domain}/` with further sub-splitting

#### Example: features/business/notifications/api/internal/

**Current Structure:**
```
api/internal/
├── constants.ts                    (28 lines)
├── notification-counts.ts          (35 lines)
├── notification-preferences.ts     (42 lines)
├── notification-queries.ts         (67 lines)
└── notification-stats.ts           (51 lines)
Total: 223 lines
```

**Decision:** < 300 lines → Consolidate into main queries.ts

**Steps:**

1. Open `features/business/notifications/api/queries.ts`
2. At top (after imports), add sections for internal content:
   ```typescript
   import 'server-only'
   // ... existing imports ...
   
   // === Constants ===
   export const NOTIFICATION_BATCH_SIZE = 100
   // ... all constants from internal/constants.ts ...
   
   // === Helper Functions ===
   function calculateNotificationCounts(...) { ... }
   // ... all helpers from internal/ ...
   
   // === Public Query Functions ===
   export async function getNotificationCounts(...) { ... }
   // ... all public queries ...
   ```

3. Delete `/api/internal/` directory:
   ```bash
   rm -rf /Users/afshin/Desktop/Enorae/features/business/notifications/api/internal
   ```

4. Find imports from internal:
   ```bash
   rg "from '@/features/business/notifications/api/internal" --type tsx
   ```

5. Update all imports to canonical location:
   ```typescript
   // Before
   import { getNotificationCounts } from '@/features/business/notifications/api/internal/notification-counts'
   
   // After
   import { getNotificationCounts } from '@/features/business/notifications/api/queries'
   ```

#### Example: features/admin/moderation/api/internal/ (Larger Case)

**Current Structure:**
```
api/internal/
├── analytics.ts         (156 lines)
├── review-queries.ts    (142 lines)
└── stats-queries.ts     (118 lines)
Total: 416 lines
```

**Decision:** 300-500 lines → Create mutations/{domain}/ structure

**Steps:**

1. Create directory structure:
   ```bash
   mkdir -p /Users/afshin/Desktop/Enorae/features/admin/moderation/api/mutations
   ```

2. Create domain files:
   ```bash
   touch /Users/afshin/Desktop/Enorae/features/admin/moderation/api/mutations/index.ts
   touch /Users/afshin/Desktop/Enorae/features/admin/moderation/api/mutations/analytics.ts
   touch /Users/afshin/Desktop/Enorae/features/admin/moderation/api/mutations/reviews.ts
   ```

3. Move and adapt internal files:
   ```bash
   # Copy content from internal/analytics.ts → mutations/analytics.ts
   # Add 'use server' directive
   # Update imports
   
   # Delete old internal directory
   rm -rf /Users/afshin/Desktop/Enorae/features/admin/moderation/api/internal
   ```

4. Create index.ts re-export:
   ```typescript
   export * from './analytics'
   export * from './reviews'
   ```

5. Update all imports:
   ```bash
   rg "from '@/features/admin/moderation/api/internal" --type tsx
   ```

---

## Server Directive Verification

After consolidations, verify all canonical files have proper directives:

```bash
# Check for 'server-only' in all queries.ts files
rg "import 'server-only'" features/**/api/queries.ts --count

# Expected: [number matching queries.ts files]

# Check for 'use server' in all mutations.ts files  
rg "'use server'" features/**/api/mutations.ts --count

# Expected: [number matching mutations.ts files]

# Find violations:
rg "^export async function" features/**/api/queries.ts -A 2 | rg -L "server-only" | head -5
rg "^export async function" features/**/api/mutations.ts -A 2 | rg -L "use server" | head -5
```

---

## Execution Roadmap

### Phase 1: Custom-Named Files (Week 1)
1. **Day 1-2:** Consolidate query helpers (alerts.ts, metrics.ts → queries.ts)
2. **Day 3:** Consolidate mutation/action files (actions.ts → mutations.ts)
3. **Day 4:** Move utilities to lib/
4. **Day 5:** Verify all imports, run typecheck

### Phase 2: Large File Splitting (Week 2)
1. **Day 1:** Split admin/moderation/api/queries.ts (464 lines)
2. **Day 2:** Split admin/chains/api/mutations.ts (327 lines)
3. **Day 3:** Split business/chains/api/mutations.ts (322 lines)
4. **Day 4:** Split remaining 6 files
5. **Day 5:** Verify all imports, run typecheck

### Phase 3: Anti-Pattern Elimination (Week 3)
1. **Day 1-2:** Consolidate small internal/ directories (< 300 lines)
2. **Day 3-4:** Create domain subdirectories for medium internal/ (300-500 lines)
3. **Day 5:** Final verification and cleanup

---

## Verification Checklist

After each phase:

```bash
# Type checking
npm run typecheck  # MUST pass

# No duplicate function exports
rg "^export (async )?function" features/*/*/api/{queries,mutations}.ts | sort | uniq -d

# All imports resolvable
rg "from '@/features/[^']+/(api|lib)" --type tsx | wc -l
# Should be > 1000 with no errors

# No orphaned custom API files
find features -type f -path '*/api/*.ts' ! -name 'queries.ts' ! -name 'mutations.ts' ! -name 'types.ts' ! -name 'schema.ts' ! -name 'index.ts' ! -path '*/api/*/* -name "*.ts"' | wc -l
# Should be 0

# Canonical server directives
rg "import 'server-only'" features/**/api/queries.ts | wc -l
rg "'use server'" features/**/api/mutations.ts | wc -l
```

---

## Success Metrics

**Pass 2 Success = 100% Canonical File Organization**

| Metric | Target | Verification |
|--------|--------|---------------|
| Custom API files eliminated | 0 | `find features -path '*/api/*.ts' ! -name 'queries.ts' ! -name 'mutations.ts' ! -name 'types.ts' ! -name 'schema.ts' ! -name 'index.ts' ! -path '*/api/*/\*' | wc -l` = 0 |
| Large files (300+) remaining | 0 | `wc -l features/**/api/{queries,mutations}.ts | grep -E '^\s+[3-9]'` = 0 |
| /api/internal/ directories | 0 | `find features -type d -path '*/api/internal'` = 0 |
| import 'server-only' in queries | 100% | All queries.ts files start with this |
| 'use server' in mutations | 100% | All mutations.ts files have this |
| npm run typecheck | PASS | No file organization errors |

---

## Implementation Notes

**Important:**
- Never modify `lib/types/database.types.ts` - this is auto-generated
- Always add server directives first, then consolidate
- Run typecheck after moving more than 5 files
- Update barrel exports (`index.ts`) in each feature after consolidation
- Preserve all function logic - only reorganize files

**Git Best Practice:**
- Each consolidation = 1 commit (e.g., "refactor(appointments): consolidate api/actions.ts into mutations.ts")
- Include "refactor" label for code organization changes
- Reference this plan in commit messages for traceability

---

**Report Generated:** 2025-10-25 by File Placement Fixer  
**Next Steps:** Execute Phase 1 with team  
**Questions:** Refer to `docs/stack-patterns/file-organization-patterns.md`
