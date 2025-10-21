import { AuditLogs } from '@/features/business/settings-audit-logs'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Security Audit Logs',
  description: 'Track all system activities and security events',
  noIndex: true
})

export default async function AuditLogsPage() {
  return <AuditLogs />
}
