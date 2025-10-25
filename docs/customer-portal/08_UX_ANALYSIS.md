# Customer Portal - UX Analysis

**Date**: 2025-10-25
**Portal**: Customer
**Layer**: UX
**Files Analyzed**: 53
**Issues Found**: 2 (Critical: 0, High: 1, Medium: 1, Low: 0)

---

## Summary

- Page shells defer rendering to feature components, and most components provide empty states via the shared `EmptyState` pattern.
- Streaming fallbacks exist for major routes (`CustomerDashboard`, `Appointments`, `Reviews`) so initial load is covered.
- Loyalty and referral dashboards surface optimistic CTAs even though their backend integrations are disabled, leading to dead-end experiences.
- Several interactive flows rely on toasts without inline confirmation, but they still return actionable state (e.g., inline alerts in sessions list).

---

## Issues

### High Priority

#### Issue #1: Loyalty dashboard exposes unusable rewards
**Severity**: High  
**File**: `features/customer/loyalty/components/loyalty-dashboard.tsx:34-178`  
**Rule Violation**: UX guidance – avoid exposing actions that cannot succeed.

**Current Code**:
```tsx
<Button size="sm" className="w-full" disabled={!points || points.total_points < 500}>
  Redeem
</Button>
```

**Problem**:
- The component renders four reward cards (“$10 Off”, “VIP Upgrade”, etc.) with enabled buttons once `points` crosses thresholds. However, the backing mutations (`redeemLoyaltyPoints`) throw “not yet implemented”.
- Customers who earned points are invited to redeem, only to encounter an error. This breaks trust and violates the “tell the truth” rule of UX.

**Required Fix**:
```tsx
if (!points) {
  return (
    <EmptyState
      icon={Gift}
      title="Loyalty coming soon"
      description="We’ll notify you when rewards are ready."
    />
  )
}
// or gate the module behind a feature flag until backend support ships.
```

**Steps to Fix**:
1. Feature-flag the loyalty dashboard or replace it with a “Coming soon” state until redemption endpoints exist.
2. Once live, wire buttons to real mutations and show inline confirmation (success state) rather than relying only on toast notifications.
3. Add analytics to track redemption attempts vs. success for QA.

**Acceptance Criteria**:
- [ ] Loyalty dashboard does not expose unreachable CTAs.
- [ ] Customers receive clear messaging about program status.
- [ ] Redeem buttons call working mutations with visible success/error feedback.

**Dependencies**: Backend delivery of loyalty schema & mutations.

---

### Medium Priority

#### Issue #2: Referral dashboard lacks usable share pathways when no code exists
**Severity**: Medium  
**File**: `features/customer/referrals/components/referral-dashboard.tsx:63-165`  
**Rule Violation**: UX best practice – avoid presenting dead controls.

**Current Code**:
```tsx
const shareUrl = referralCode
  ? `${window.location.origin}/signup?ref=${referralCode.code}`
  : ''
...
<Button variant="outline" className="w-full">
  <Mail className="h-4 w-4 mr-2" />
  Share via Email
</Button>
```

**Problem**:
- When the customer has no code, the dashboard still renders share buttons (Email/SMS/Copy) but they perform no action. `shareReferralCode` server action throws “not yet implemented”.
- The UI neither disables the buttons nor clarifies why sharing is unavailable, leading to confusing dead clicks.

**Required Fix**:
```tsx
if (!referralCode) {
  return (
    <EmptyState
      icon={Users}
      title="Referrals coming soon"
      description="We’ll notify you when referral rewards launch."
      action={
        <Button onClick={handleGenerateCode} disabled={isGenerating}>
          {isGenerating ? 'Generating…' : 'Notify Me'}
        </Button>
      }
    />
  )
}
```

**Steps to Fix**:
1. Disable or hide share buttons until a referral code is present and backend logic exists.
2. Provide explicit messaging (tooltip or inline description) explaining the current limitation.
3. Once functional, add inline success feedback (e.g., copy confirmation inline, not only via toast) for accessibility.

**Acceptance Criteria**:
- [ ] No share controls appear unless the referral code and backend handler are live.
- [ ] Customers understand the status of the referral program without trial-and-error.
- [ ] Successful share actions provide inline confirmation.

**Dependencies**: Same as Issue #1 (backend enablement).

---

## Statistics

- Total Issues: 2
- Files Affected: 2
- Estimated Fix Time: 0.5 day
- Breaking Changes: Low (UI gating)

---

## Next Steps

1. Gate loyalty/referral experiences until their backing services are production-ready.
2. Re-run UX smoke tests for loyalty/referral flows once feature flags flip.

---

## Related Files

This analysis should be done after:
- [x] docs/customer-portal/07_SECURITY_ANALYSIS.md

This analysis blocks:
- [ ] docs/customer-portal/00_SUMMARY.md
