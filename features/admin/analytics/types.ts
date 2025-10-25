import type { Database } from '@/lib/types/database.types'

/**
 * Admin analytics and metrics types
 * Used by admin analytics and reporting features
 */

// Analytics tables (moved to analytics schema)
export type DailyMetric = Database['analytics']['Tables']['daily_metrics']['Row']
export type OperationalMetric = Database['analytics']['Tables']['operational_metrics']['Row']
