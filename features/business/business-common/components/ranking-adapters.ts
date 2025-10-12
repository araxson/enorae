/**
 * Type adapters for mapping backend data structures to business components
 *
 * These adapters ensure type safety when using business components with
 * actual backend query results from features/business/analytics and features/business/dashboard
 */

import type { RankingItem } from './ranking-list'
import type { AnalyticsOverview, ServicePerformance, StaffPerformance } from '../types'

export { isServicePerformance, isStaffPerformance } from '../types'

/**
 * Convert service performance data to ranking items
 *
 * @example
 * ```tsx
 * const services = await getTopServices(salonId, startDate, endDate)
 * const items = servicePerformanceToRankingItems(services)
 *
 * <RankingList
 *   title="Top Services"
 *   items={items}
 *   valueFormat="currency"
 * />
 * ```
 */
export function servicePerformanceToRankingItems(
  services: ServicePerformance[]
): RankingItem[] {
  return services.map((service, index) => ({
    id: `service-${index}-${service.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: service.name,
    subtitle: `${service.count} booking${service.count !== 1 ? 's' : ''}`,
    value: service.revenue,
    metric: 'revenue',
  }))
}

/**
 * Convert staff performance data to ranking items
 *
 * @example
 * ```tsx
 * const staff = await getTopStaff(salonId, startDate, endDate)
 * const items = staffPerformanceToRankingItems(staff)
 *
 * <RankingList
 *   title="Top Performers"
 *   items={items}
 *   valueFormat="currency"
 * />
 * ```
 */
export function staffPerformanceToRankingItems(
  staff: StaffPerformance[]
): RankingItem[] {
  return staff.map((member, index) => ({
    id: `staff-${index}-${member.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: member.name,
    subtitle: `${member.title || 'Staff'} • ${member.count} appointment${member.count !== 1 ? 's' : ''}`,
    value: member.revenue,
    metric: 'revenue',
  }))
}

/**
 * Convert customer data to ranking items (for top customers by visits or revenue)
 *
 * @example
 * ```tsx
 * const customers = await getTopCustomers(10)
 * const items = customerDataToRankingItems(customers)
 *
 * <RankingList
 *   title="Top Customers"
 *   items={items}
 *   valueFormat="currency"
 * />
 * ```
 */
export function customerDataToRankingItems(
  customers: Array<{
    id: string
    name: string
    email?: string
    visitCount: number
    estimatedValue: number
  }>
): RankingItem[] {
  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    subtitle: `${customer.visitCount} visit${customer.visitCount !== 1 ? 's' : ''}`,
    value: customer.estimatedValue,
    metric: 'lifetime value',
  }))
}

/**
 * Extract revenue breakdown from analytics overview
 *
 * @example
 * ```tsx
 * const overview = await getAnalyticsOverview(salonId, startDate, endDate)
 * const breakdown = extractRevenueBreakdown(overview)
 *
 * <RevenueCard
 *   title="Total Revenue"
 *   amount={overview.revenue.total}
 *   breakdown={breakdown}
 * />
 * ```
 */
export function extractRevenueBreakdown(overview: AnalyticsOverview) {
  return [
    { label: 'Services', amount: overview.revenue.service },
    { label: 'Products', amount: overview.revenue.product },
  ]
}

/**
 * Calculate previous period amount for growth display
 *
 * @example
 * ```tsx
 * const overview = await getAnalyticsOverview(salonId, startDate, endDate)
 * const previousAmount = calculatePreviousPeriodAmount(
 *   overview.revenue.total,
 *   overview.revenue.growth
 * )
 *
 * <RevenueCard
 *   title="Total Revenue"
 *   amount={overview.revenue.total}
 *   previousAmount={previousAmount}
 * />
 * ```
 */
export function calculatePreviousPeriodAmount(
  currentAmount: number,
  growthPercent: number
): number {
  if (growthPercent === 0) return currentAmount
  // current = previous * (1 + growth/100)
  // previous = current / (1 + growth/100)
  return currentAmount / (1 + growthPercent / 100)
}
