import { CustomerInsights } from '@/features/business/insights'

export const metadata = {
  title: 'Customer Insights',
  description: 'Customer segmentation, lifetime value analysis, and retention metrics',
}

export default async function CustomerInsightsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <CustomerInsights />
    </div>
  )
}
