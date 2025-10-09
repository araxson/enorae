import type { Database } from '../database.types'

export type DailyMetric = Database['public']['Views']['daily_metrics']['Row']
export type OperationalMetric = Database['public']['Views']['operational_metrics']['Row']
export type ManualTransaction = Database['public']['Views']['manual_transactions']['Row']
