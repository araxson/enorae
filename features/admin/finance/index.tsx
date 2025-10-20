import { generateMetadata as genMeta } from '@/lib/metadata'
import { FinancePageContent } from './components/finance-page-content'

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

  return <FinancePageContent startDate={resolved?.startDate} endDate={resolved?.endDate} />
}

export { FinanceDashboard, FinanceDashboardSkeleton } from './components/finance-dashboard'
export { FinancePageContent } from './components/finance-page-content'
