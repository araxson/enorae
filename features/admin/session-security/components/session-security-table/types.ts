import type { SessionSecurityRecord } from '@/features/admin/session-security/api/queries'

// Re-export for component use
export type { SessionSecurityRecord }

/**
 * Session security table component props
 */
export interface SessionSecurityTableProps {
  records: SessionSecurityRecord[]
}
