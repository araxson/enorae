import { Suspense } from 'react'
import { AuditLogs } from '@/features/business/settings/audit-logs'
import { generateMetadata as genMeta } from '@/lib/metadata'
import { PageLoading } from '@/components/shared'

export const metadata = genMeta({
  title: 'Security Audit Logs',
  description: 'Track all system activities and security events',
  noIndex: true
})

export default async function AuditLogsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <Suspense fallback={<PageLoading />}>
        <AuditLogs />
      </Suspense>
    </div>
  )
}
