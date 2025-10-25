import type { Database } from '@/lib/types/database.types'

/**
 * Analytics and metrics types
 * Used by analytics and reporting features
 */

// Database views
export type DailyMetric = Database['public']['Views']['daily_metrics_view']['Row']
export type OperationalMetric = Database['public']['Views']['operational_metrics_view']['Row']
export type ManualTransaction = Database['public']['Views']['manual_transactions_view']['Row']
