# Refactoring Roadmap

## Phase 1: Critical Fixes (Do First)
- [x] Task: Normalize VIP status card header/footer slots  
  - Effort: 45 mins  
  - Impact: High – restores canonical Card hierarchy in both `vip-status-card` and dashboard usage.
- [x] Task: Reuse VIPStatusCard inside `CustomerDashboardPage`  
  - Effort: 60 mins  
  - Impact: High – eliminates duplicated, drifting shadcn composition.
- [x] Task: Re-anchor CustomerMetrics copy inside proper Card structure  
  - Effort: 45 mins  
  - Impact: High – removes rogue `CardDescription` usage and reinstates header spacing.
- [x] Task: Restructure SalonResultsGrid listing cards to match shadcn pattern  
  - Effort: 60 mins  
  - Impact: High – fixes header composition and moves icon/text styling into neutral wrappers.

## Phase 2: High Priority (Do Next)
- [x] Task: Shift padding utilities off TransactionCard slots  
  - Effort: 30 mins  
  - Impact: Medium – preserves reusable Card spacing.
- [x] Task: Restore AppointmentDetail services card padding  
  - Effort: 30 mins  
  - Impact: Medium – keeps nested CardContent spacing consistent.
- [x] Task: Move SalonResultsGrid “no results” typography out of CardContent slot  
  - Effort: 20 mins  
  - Impact: Medium – prevents future slot styling regressions.

## Phase 3: Medium Priority (Nice to Have)
- [x] Task: Replace CardDescription body copy in ReviewsList with semantic text  
  - Effort: 20 mins  
  - Impact: Medium – reinforces proper header/body separation.
- [x] Task: Audit remaining customer portal cards for lingering slot classNames  
  - Effort: 45 mins  
  - Impact: Medium – ensures no hidden regressions remain.
