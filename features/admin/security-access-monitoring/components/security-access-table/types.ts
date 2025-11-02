import type { SecurityAccessRecord } from '@/features/admin/security-access-monitoring/api/queries'

/**
 * Security access table component props
 */
export interface SecurityAccessTableProps {
  records: SecurityAccessRecord[]
}
