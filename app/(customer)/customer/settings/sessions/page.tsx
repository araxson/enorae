import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { SessionManagement } from '@/features/shared/sessions'

export const metadata = {
  title: 'Active Sessions | Enorae',
  description: 'Manage your active sessions and devices',
}

export default function SessionManagementPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <SessionManagement />
    </Suspense>
  )
}
