import type { ReactNode, ComponentType } from 'react'

/**
 * Metric Card Types
 */
export type MetricCardVariant = 'default' | 'progress' | 'trend' | 'highlight'

export type MetricCardAccent =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'warning'
  | 'info'
  | 'destructive'

type BaseMetricCardProps = {
  title: string
  value: string | number
  icon?: ReactNode | ComponentType<{ className?: string }>
  subtitle?: string
  accent?: MetricCardAccent
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
