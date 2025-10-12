import { Suspense } from 'react'
import { PageLoading } from '@/components/shared'
import { CustomerAnalyticsPage } from '@/features/customer/analytics'

export const metadata = {
  title: 'Analytics | Enorae',
  description: 'View your personal analytics and insights',
}

export default function CustomerAnalyticsRoute() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CustomerAnalyticsPage />
    </Suspense>
  )
}
