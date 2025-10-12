/**
 * Business Portal Components
 *
 * Reusable components specific to the business portal
 */

export { RevenueCard } from './revenue-card'
export { MetricTrend } from './metric-trend'
export { RevenueTrendChart } from './revenue-trend-chart'
export { AppointmentConversionChart } from './appointment-conversion-chart'
export { StaffPerformanceCard } from './staff-performance-card'
export { ServicePopularityChart } from './service-popularity-chart'
export { CustomerInsightsCard } from './customer-insights-card'
export { QuickActions } from './quick-actions'
export { ExportButton } from './export-button'
export { DateRangePicker } from './date-range-picker'
export { OperationalMetricsDashboard } from './operational-metrics-dashboard'
export { MetricCard } from './metric-card'
export type { MetricCardProps, MetricCardVariant } from './metric-card'
export { RankingList } from './ranking-list'
export type { RankingItem } from './ranking-list'
export { StatBadge, ComparisonBadge } from './stat-badge'
export { DateRangeFilter, SearchInput as BusinessSearchInput, StatusFilter } from './filters'
export {
  servicePerformanceToRankingItems,
  staffPerformanceToRankingItems,
  customerDataToRankingItems,
  extractRevenueBreakdown,
  calculatePreviousPeriodAmount,
} from './ranking-adapters'
export { formatCurrency, formatPercentage } from './value-formatters'
