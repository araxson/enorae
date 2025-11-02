import type { SessionSecurityRecord } from '@/features/admin/session-security/api/queries'

/**
 * Session security table component props
 */
export interface SessionSecurityTableProps {
  records: SessionSecurityRecord[]
}
