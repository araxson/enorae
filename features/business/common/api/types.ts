import type { ReactNode, ComponentType } from 'react'

export type ServicePerformance = {
  name: string
  count: number
  revenue: number
}

export type StaffPerformance = {
  name: string
  title: string | null
  count: number
  revenue: number
}

export type AnalyticsOverview = {
  revenue: {
    total: number
    service: number
    product: number
    growth: number
  }
  appointments: {
    total: number
    completed: number
    cancelled: number
    noShow: number
    completionRate: number
  }
  customers: {
    total: number
    new: number
    returning: number
    retentionRate: number
  }
  staff: {
    active: number
    utilization: number
  }
}

// Metric Card Types
export type MetricCardVariant = 'default' | 'progress' | 'trend' | 'highlight'

type BaseMetricCardProps = {
  title: string
  value: string | number
  icon?: ReactNode | ComponentType<{ className?: string }>
  subtitle?: string
  accent?: string
  className?: string
}

type DefaultMetricCardProps = BaseMetricCardProps & {
  variant?: 'default'
}

type ProgressMetricCardProps = BaseMetricCardProps & {
  variant: 'progress'
  progress: number
  progressClass?: string
}

type TrendMetricCardProps = BaseMetricCardProps & {
  variant: 'trend'
  trend: number
}

type HighlightMetricCardProps = BaseMetricCardProps & {
  variant: 'highlight'
  highlight?: ReactNode
}

export type MetricCardProps =
  | DefaultMetricCardProps
  | ProgressMetricCardProps
  | TrendMetricCardProps
  | HighlightMetricCardProps

// Revenue Card Types
export type RevenueBreakdownItem = {
  label: string
  amount: number
  percentage?: number
}

export type RevenueCardProps = {
  title: string
  amount: number
  previousAmount?: number
  breakdown?: RevenueBreakdownItem[]
  icon?: ReactNode | ComponentType<{ className?: string }>
  accent?: string
  className?: string
  growth?: number
  subtitle?: string
  currency?: string
  compact?: boolean
}
