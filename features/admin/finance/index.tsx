import { Suspense } from 'react'

import { generateMetadata as genMeta } from '@/lib/metadata'
import { FinanceDashboardSkeleton, FinancePageContent } from './components'

export const adminFinanceMetadata = genMeta({
  title: 'Finance & Revenue | Admin',
  description: 'Platform-wide revenue analytics and financial management',
})

export async function FinancePageFeature({
  searchParams,
}: {
  searchParams?:
    | Promise<{ startDate?: string; endDate?: string }>
    | { startDate?: string; endDate?: string }
}) {
  const resolved = searchParams ? await searchParams : undefined

  return (
    <Suspense fallback={<FinanceDashboardSkeleton />}>
      <FinancePageContent startDate={resolved?.startDate} endDate={resolved?.endDate} />
    </Suspense>
  )
}

export { FinanceDashboard, FinanceDashboardSkeleton, FinancePageContent } from './components'
export type * from './api/types'
