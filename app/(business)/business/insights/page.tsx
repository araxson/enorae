import { BusinessInsights } from '@/features/business/insights'

export const metadata = {
  title: 'Business Insights',
  description: 'AI-powered insights, trend detection, and growth recommendations',
}

export default async function BusinessInsightsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <BusinessInsights />
    </div>
  )
}
