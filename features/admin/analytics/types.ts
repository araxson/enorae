import type { Database } from '@/lib/types/database.types'

/**
 * Admin analytics and metrics types
 * Used by admin analytics and reporting features
 */

// Database views
export type DailyMetric = Database['public']['Views']['daily_metrics']['Row']
export type OperationalMetric = Database['public']['Views']['operational_metrics']['Row']
export type ManualTransaction = Database['public']['Views']['manual_transactions']['Row']
