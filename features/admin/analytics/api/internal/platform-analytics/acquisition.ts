import { buildBreakdown, parseDate } from '@/lib/utils/analytics-calculations'

type UserRow = {
  primary_role: string | null
  country_code: string | null
  created_at: string | null
}

interface BuildAcquisitionMetricsParams {
  userRows: UserRow[]
  thirtyDaysAgo: Date
  sevenDaysAgo: Date
  fourteenDaysAgo: Date
}

export interface AcquisitionMetrics {
  totalNewUsers: number
  newUsersLast30Days: number
  newUsersLast7Days: number
  deltaLast7Days: number
  byRole: ReturnType<typeof buildBreakdown>
  byCountry: ReturnType<typeof buildBreakdown>
}

export function buildAcquisitionMetrics({
  userRows,
  thirtyDaysAgo,
  sevenDaysAgo,
  fourteenDaysAgo,
}: BuildAcquisitionMetricsParams): AcquisitionMetrics {
  const totalNewUsers = userRows.length

  const newUsersLast30Days = userRows.filter((user) => {
    const created = parseDate(user.created_at)
    return created ? created >= thirtyDaysAgo : false
  }).length

  const newUsersLast7Days = userRows.filter((user) => {
    const created = parseDate(user.created_at)
    return created ? created >= sevenDaysAgo : false
  }).length

  const newUsersPrev7Days = userRows.filter((user) => {
    const created = parseDate(user.created_at)
    return created ? created >= fourteenDaysAgo && created < sevenDaysAgo : false
  }).length

  const byRole = buildBreakdown(
    userRows.map((user) => ({ key: user.primary_role })),
    totalNewUsers || 1,
    (value) => (value ? value.toString() : 'unknown'),
  )

  const byCountry = buildBreakdown(
    userRows.map((user) => ({ key: user.country_code })),
    totalNewUsers || 1,
    (value) => (value ? value.toString().toUpperCase() : 'UNKNOWN'),
  )

  return {
    totalNewUsers,
    newUsersLast30Days,
    newUsersLast7Days,
    deltaLast7Days: newUsersLast7Days - newUsersPrev7Days,
    byRole,
    byCountry,
  }
}
