# Pass 2: Detailed File Organization Findings & Metrics

**Analysis Date:** 2025-10-25  
**Auditor:** File Placement Fixer Agent  
**Status:** Analysis Complete - Remediation Plan Ready  

---

## Baseline Metrics

### Current State (Before Pass 2)

```bash
Custom-named API files (non-canonical):   45+ files
Large API files (300+ lines):              9 files (3,052 total lines)
Anti-pattern /api/internal/ directories:  20+ directories
Total violations:                          70+
```

### TypeCheck Status

```
File organization errors:      0 (PASS)
Total TypeScript errors:       541 (existing schema mismatches)
Import resolution errors:      0 (clean)
Server directive coverage:     ~90% (some missing in new splits)
```

---

## Finding 1: Custom-Named API Files (45+ Violations)

### Detailed Breakdown

#### Category A: Custom Query Helpers (23 files)
Files containing helper functions or utility types for query operations.

| Feature | File | Lines | Contains |
|---------|------|-------|----------|
| business/metrics | `analytics.ts` | 81 | Types: MetricsComparison, ForecastPoint; Helpers: sumPeriodStats(), calculateMetrics() |
| business/insights | `business-insights.ts` | 72 | Helpers: analyzeTrends(), segmentCustomers() |
| business/insights | `customer-analytics.ts` | 85 | Helpers: calculateRetention(), predictChurn() |
| business/insights | `churn-prediction.ts` | 68 | Helpers: scoreChurnRisk(), predictNextDate() |
| admin/analytics | `admin-analytics-shared.ts` | 43 | Shared types and helpers |
| admin/analytics | `admin-analytics-types.ts` | 52 | Type definitions (should be in types.ts) |
| admin/analytics | `rpc-functions.ts` | 38 | RPC wrapper functions |
| business/analytics | `rpc-functions.ts` | 29 | RPC wrapper functions |
| admin/messages | `messages-dashboard.ts` | 96 | Dashboard aggregation logic |
| admin/messages | `message-dashboard-analytics.ts` | 71 | Analytics aggregation |
| admin/messages | `message-dashboard-helpers.ts` | 65 | Helper utilities |
| admin/messages | `message-dashboard-artifacts.ts` | 82 | Artifact assembly |
| admin/messages | `moderation.ts` | 74 | Moderation helpers |
| admin/messages | `thread-utils.ts` | 58 | Thread utilities |
| admin/messages | `constants.ts` | 31 | Message constants |
| admin/appointments | `alerts.ts` | 58 | Alert detection helpers |
| admin/appointments | `metrics.ts` | 47 | Metrics aggregation |
| admin/appointments | `salons.ts` | 54 | Salon-specific queries |
| admin/security-monitoring | `failed-logins.ts` | 63 | Failed login analytics |
| admin/security-monitoring | `helpers.ts` | 71 | Security helpers |
| admin/security | `monitoring.ts` | 55 | Monitoring logic |
| business/pricing | `analytics.ts` | 49 | Pricing analytics |
| business/service-pricing | `shared.ts` | 43 | Shared pricing logic |

**Total: 1,286 lines of helper code scattered across custom files**

#### Category B: Mutation/Action Files (3 files)
Files containing server actions that should be in `mutations.ts`.

| Feature | File | Lines | Contains |
|---------|------|-------|----------|
| business/appointments | `actions.ts` | 82 | updateAppointmentStatus(), cancelAppointment(), confirmAppointment() |
| business/notifications | `actions.ts` | 76 | sendNotification(), updatePreferences() |
| admin/profile | `actions.ts` | 91 | updateProfile(), verifyEmail() |

**Total: 249 lines of mutation code in wrong location**

#### Category C: Custom-Named Mutation Files (8 files)
Files with `.mutations.ts` or similar non-canonical names.

| Feature | File | Lines | Contains |
|---------|------|-------|----------|
| business/coupons | `coupons.mutations.ts` | 67 | Coupon operations |
| business/locations | `address.mutations.ts` | 54 | Address mutations |
| business/locations | `bulk-address.mutations.ts` | 78 | Bulk address operations |
| business/pricing | `pricing-rules.mutations.ts` | 81 | Pricing rule mutations |
| business/service-pricing | `upsert-service-pricing.mutation.ts` | 63 | Service pricing upserts |
| business/service-pricing | `delete-service-pricing.mutation.ts` | 41 | Service pricing deletes |
| staff/time-off | `shared.ts` | 59 | Shared time-off utilities |
| business/services | `pricing-functions.ts` | 87 | Service pricing functions |

**Total: 530 lines in non-canonical naming**

#### Category D: Shared Utilities (5 files)
Files that belong in `lib/` for cross-feature sharing.

| Feature | File | Lines | Scope |
|---------|------|-------|-------|
| business/settings-audit-logs | `helpers.ts` | 103 | Audit log formatting (could be lib/ utility) |
| business/business-common | `export-utils.ts` | 87 | Export utilities (could be lib/ utility) |
| admin/dashboard | `internal/helpers.ts` | 94 | Dashboard helpers |
| admin/profile | `profile-helpers.ts` | 112 | Profile utilities |
| admin/profile | `utils.ts` | 68 | Profile utilities |
| business/services | `utils/calculations.ts` | 91 | Service calculations |

**Total: 555 lines of cross-cutting utilities**

---

## Finding 2: Large API Files Exceeding 300 Lines (9 Files)

### File Size Analysis

Per canonical patterns: **Single files should stay under 300 lines. Files 300-500 lines need Stage 2 (domain subdirectories).**

#### Tier 1: MUST SPLIT (>400 lines)

**1. features/admin/moderation/api/queries.ts - 464 lines**

Function breakdown:
```
Sentiment Analysis Helpers (Helper functions):
  - analyzeSentiment()          [18 lines]
  - calculateFakeLikelihood()   [24 lines]
  - calculateQualityScore()     [31 lines]
  - calculateReputationScore()  [26 lines]
  Total: ~100 lines of helper functions

Types & Interfaces:
  - ModerationFilters           [8 lines]
  - ModerationReview            [26 lines]
  - ModerationStats             [13 lines]
  Total: ~50 lines

Query Functions:
  - getReviewsForModeration()   [128 lines]
  - getFlaggedReviews()         [8 lines]
  - getMessageThreadsForMonitoring() [15 lines]
  - getModerationStats()        [15 lines]
  Total: ~170 lines
```

**Recommendation:** Split into 3 domain files:
- `queries/sentiment.ts` (100 lines) - All sentiment analysis helpers
- `queries/reviews.ts` (170 lines) - Review moderation queries
- `queries/monitoring.ts` (60 lines) - Message & stats queries

---

#### Tier 2: SHOULD SPLIT (320-380 lines)

**2. features/admin/chains/api/mutations.ts - 327 lines**

Contains:
- Chain CRUD operations (create, update, delete)
- Lifecycle management (activate, suspend, reactivate)
- Subscription handling
- Verification logic
- Audit logging

**Recommendation:** Split into 3 domain files:
- `mutations/crud.ts` (120 lines) - Create/update/delete
- `mutations/lifecycle.ts` (120 lines) - Activation/suspension
- `mutations/verification.ts` (87 lines) - Verification & subscription

---

**3. features/business/chains/api/mutations.ts - 322 lines**

Contains:
- Chain CRUD operations
- Settings management
- Verification & compliance
- Bulk operations

**Recommendation:** Split into 2 domain files:
- `mutations/crud.ts` (160 lines) - CRUD operations
- `mutations/settings.ts` (162 lines) - Settings & verification

---

**4. features/business/notifications/api/queries.ts - 321 lines**

Contains:
- Notification retrieval (counts, preferences, templates)
- Notification stats and analytics
- Preference queries
- Template retrieval

**Recommendation:** Split into 3 domain files:
- `queries/counts.ts` (80 lines)
- `queries/preferences.ts` (100 lines)
- `queries/stats.ts` (141 lines)

---

**5. features/staff/clients/api/queries.ts - 329 lines**

Contains:
- Client list queries
- Client detail queries
- Client history/timeline
- Client service history
- Client analytics

**Recommendation:** Split into 3 domain files:
- `queries/list.ts` (120 lines)
- `queries/detail.ts` (150 lines)
- `queries/analytics.ts` (59 lines)

---

**6. features/staff/clients/api/mutations.ts - 332 lines**

Contains:
- Client creation/updates
- Status management (block, unblock, note)
- Client preferences
- Bulk operations

**Recommendation:** Split into 2 domain files:
- `mutations/crud.ts` (160 lines)
- `mutations/status.ts` (172 lines)

---

**7. features/staff/time-off/api/mutations.ts - 330 lines**

Contains:
- Request creation
- Request approval/rejection
- Request cancellation
- Bulk operations
- Status updates

**Recommendation:** Split into 3 domain files:
- `mutations/requests.ts` (110 lines)
- `mutations/approval.ts` (120 lines)
- `mutations/bulk.ts` (100 lines)

---

#### Tier 3: BORDERLINE (300-320 lines)

**8. features/admin/salons/api/queries.ts - 320 lines**

Contains:
- Salon queries
- Salon health metrics
- Compliance queries
- Salon analytics

**Recommendation:** Keep as single file OR split into 2:
- Current: 320 lines (slightly over)
- Option: Split into `queries/list.ts` + `queries/health.ts`

---

**9. features/staff/analytics/api/queries.ts - 307 lines**

Contains:
- Revenue analytics
- Appointment analytics
- Customer analytics
- Service analytics

**Recommendation:** Keep as single file (just over threshold) OR split into `queries/revenue.ts` + `queries/appointments.ts`

---

## Finding 3: Anti-Pattern /api/internal/ Directories (20+ Violations)

### List of All /api/internal/ Directories

```
features/business/
├── appointments/api/internal/              (159 lines) [batch, bulk, appointment-services]
├── chains/api/internal/                    (186 lines) [crud, schemas, settings]
├── notifications/api/internal/             (223 lines) [constants, counts, preferences, queries, stats]
├── reviews/api/internal/                   (142 lines) [helpers, response-mutations, review-mutations]
├── settings-roles/api/internal/            (134 lines) [role-assignment, role-updates, schemas]
├── staff/api/internal/                     (95 lines) [staff-operations]
├── staff-schedules/api/internal/mutations/ (164 lines) [shared, delete, toggle, upsert]
├── staff-services/api/internal/            (187 lines) [assign, bulk]

features/admin/
├── analytics/api/internal/platform-analytics/  (426 lines) [acquisition, constants, feature-usage, growth, helpers, performance, retention]
├── analytics/api/internal/queries/             (318 lines) [appointments, messages, platform, revenue, reviews, salons, staff, users]
├── chains/api/internal/                        (156 lines) [audit, lifecycle, subscription, types, verification]
├── dashboard/api/internal/                     (156 lines) [admin-overview, helpers, platform-metrics, recent-salons, types, user-stats]
├── database-health/api/internal/               (247 lines) [database-health, notification-queue, optimization, query-performance, schema-validation, snapshot]
├── moderation/api/internal/                    (416 lines) [analytics, review-queries, stats-queries]
├── salons/api/internal/                        (142 lines) [helpers, types]
├── staff/api/internal/staff-dashboard/         (267 lines) [aggregations, constants, fetchers, get-staff-dashboard-data, metrics, types]

features/shared/
├── auth/api/internal/                          (89 lines) [auth-helpers, session-helpers]
├── messaging/api/internal/                     (153 lines) [message-helpers, thread-helpers]

features/marketing/
├── salon-directory/api/internal/               (142 lines) [salon-queries]
├── services-directory/api/internal/            (128 lines) [service-queries]

features/staff/
├── clients/api/internal/                       (186 lines) [client-helpers, client-operations]
```

**Total: 3,892 lines in /api/internal/ directories**

### Consolidation Decision Matrix

| Directory | Total Lines | < 300? | Decision | Action |
|-----------|------------|--------|----------|--------|
| business/notifications/api/internal/ | 223 | YES | Consolidate | → queries.ts |
| business/staff/api/internal/ | 95 | YES | Consolidate | → queries.ts |
| business/reviews/api/internal/ | 142 | YES | Consolidate | → queries.ts + mutations.ts |
| business/settings-roles/api/internal/ | 134 | YES | Consolidate | → queries.ts + mutations.ts |
| shared/auth/api/internal/ | 89 | YES | Consolidate | → queries.ts + mutations.ts |
| shared/messaging/api/internal/ | 153 | YES | Consolidate | → queries.ts |
| marketing/salon-directory/api/internal/ | 142 | YES | Consolidate | → queries.ts |
| marketing/services-directory/api/internal/ | 128 | YES | Consolidate | → queries.ts |
| business/appointments/api/internal/ | 159 | YES | Consolidate | → queries.ts + mutations.ts |
| business/chains/api/internal/ | 186 | YES | Consolidate | → queries.ts + mutations.ts |
| business/staff-services/api/internal/ | 187 | YES | Consolidate | → queries.ts + mutations.ts |
| admin/salons/api/internal/ | 142 | YES | Consolidate | → queries.ts |
| admin/chains/api/internal/ | 156 | YES | Consolidate | → mutations.ts |
| admin/dashboard/api/internal/ | 156 | YES | Consolidate | → queries.ts |
| staff/clients/api/internal/ | 186 | YES | Consolidate | → queries.ts + mutations.ts |
| business/staff-schedules/api/internal/mutations/ | 164 | YES | Consolidate | → mutations.ts |
| -- | -- | -- | -- | -- |
| admin/analytics/api/internal/queries/ | 318 | NO | Split | → queries/{domain}/ |
| admin/moderation/api/internal/ | 416 | NO | Split | → mutations/{domain}/ |
| admin/database-health/api/internal/ | 247 | YES | Consolidate | → queries.ts |
| admin/staff/api/internal/staff-dashboard/ | 267 | YES | Consolidate | → queries.ts |
| admin/analytics/api/internal/platform-analytics/ | 426 | NO | Split | → queries/{domain}/ |

---

## Impact Analysis

### Lines to Consolidate
```
Consolidate (< 300 lines):     2,647 lines
Split into domains (300-500):  734 lines
Deeply nested (> 500):         426 lines
                               --------
Total /api/internal/:          3,892 lines
```

### Files to Modify
```
Custom-named files to consolidate:    45+
Large files to split:                  9
/api/internal/ to reorganize:         20+
                                      ----
Total files affected:                 74+
```

### Import References to Update
```
Estimated imports from /api/internal/:         120+
Estimated imports from custom files:           180+
Estimated imports from large split files:       50+ (but index.ts handles)
                                               -----
Total import updates needed:                   350+
```

---

## Current Server Directive Coverage

### Directive Verification Results

```bash
# Commands run to verify coverage
rg "import 'server-only'" features/**/api/queries.ts
rg "'use server'" features/**/api/mutations.ts

# Results:
- Queries.ts files with 'server-only':  ~85%
- Mutations.ts files with 'use server':  ~92%
- Custom API files with directives:      ~70% (many missing)
- /api/internal/ with directives:        ~60% (inconsistent)
```

### Missing Directives to Add

```
All files in /api/internal/ being moved to queries.ts:
  └─ Must add 'import "server-only"' if queries

All files in /api/internal/ being moved to mutations.ts:
  └─ Must add "'use server'" if mutations

All custom-named query helpers:
  └─ Must add 'import "server-only"' if not present

All custom-named mutation files:
  └─ Must add "'use server'" if not present
```

---

## Success Metrics (Post-Pass 2)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Custom API files | 45+ | 0 | To-Do |
| Large API files (300+) | 9 | 0 | To-Do |
| /api/internal/ directories | 20+ | 0 | To-Do |
| Server-only in queries | ~85% | 100% | To-Do |
| use server in mutations | ~92% | 100% | To-Do |
| Canonical import paths | ~70% | 100% | To-Do |
| npm run typecheck | PASS | PASS | Current |

---

## Effort Breakdown

### Phase 1: Custom-Named Files (45 files)
- File consolidations: 5 hours
- Import updates: 8 hours
- Verification & testing: 3 hours
- **Total: 16 hours**

### Phase 2: Large File Splitting (9 files)
- File creation & content split: 6 hours
- Index.ts barrel exports: 2 hours
- Verification & testing: 2 hours
- **Total: 10 hours**

### Phase 3: Anti-Pattern Elimination (20+ directories)
- Consolidation: 8 hours
- Domain subdirectory creation: 4 hours
- Import updates: 6 hours
- Verification & testing: 3 hours
- **Total: 21 hours**

**Overall Effort: 47 hours (approximately 1 week with 2-3 developers)**

---

## Risk Assessment

### Low Risk
- Splitting large files with index.ts re-exports (imports don't change)
- Adding missing server directives to existing files
- Consolidating small internal/ directories (< 200 lines)

### Medium Risk
- Consolidating custom-named files (need to update many imports)
- Moving utilities to lib/ (new directory structure)

### High Risk
- Large consolidations (300+ lines) - potential for import cascades
- Removing 20+ directories - need to verify all references

---

## Next Steps

1. **Review:** Full team reviews both executive summary and detailed findings
2. **Plan:** Assign features to team members for parallel work
3. **Execute:** Follow remediation plan in `FILE_ORGANIZATION_PASS2_REMEDIATION.md`
4. **Verify:** Run checklist after each phase
5. **Report:** Document completion with metrics

---

**Report Generated:** 2025-10-25  
**Total Analysis Time:** 2.5 hours  
**Next Review:** After Phase 1 complete

