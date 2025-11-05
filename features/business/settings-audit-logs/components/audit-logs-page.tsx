import { Suspense } from 'react'
import { PageLoading } from '@/features/shared/ui'
import { AuditLogsContent } from './audit-logs-content'

export function AuditLogsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <Suspense fallback={<PageLoading />}>
        <AuditLogsContent />
      </Suspense>
    </div>
  )
}
