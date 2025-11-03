import type { SecurityAccessRecord } from '@/features/admin/security-access-monitoring/api/queries'

// Re-export for component use
export type { SecurityAccessRecord }

/**
 * Security access table component props
 */
export interface SecurityAccessTableProps {
  records: SecurityAccessRecord[]
}
