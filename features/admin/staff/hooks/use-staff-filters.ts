import { useMemo } from 'react'
import type { BackgroundStatus, StaffWithMetrics } from '@/features/admin/staff/api/queries'
import type { RiskFilter } from '../components/staff-filters-types'

export function useStaffFilters(
  staff: StaffWithMetrics[],
  search: string,
  riskFilter: RiskFilter,
  roleFilter: string,
  backgroundFilter: BackgroundStatus | 'all'
) {
  return useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase()

    return staff
      .filter((member: StaffWithMetrics) => {
        if (riskFilter !== 'all' && member.compliance.riskLabel !== riskFilter) {
          return false
        }
        if (roleFilter !== 'all' && member.staffRole !== roleFilter) {
          return false
        }
        if (backgroundFilter !== 'all' && member.background.status !== backgroundFilter) {
          return false
        }

        if (!normalizedQuery) return true

        const searchTarget = [
          member.fullName,
          member.title,
          member.salonName,
          member.salonSlug,
          member.userId,
        ]
          .filter(Boolean)
          .map((value) => value!.toString().toLowerCase())

        return searchTarget.some((target) => target.includes(normalizedQuery))
      })
      .sort((a: StaffWithMetrics, b: StaffWithMetrics) => b.compliance.score - a.compliance.score)
  }, [staff, search, riskFilter, roleFilter, backgroundFilter])
}
