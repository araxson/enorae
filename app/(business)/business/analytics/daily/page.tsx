import { DailyAnalytics } from '@/features/business/daily-analytics'
import { generateMetadata as genMeta } from '@/lib/metadata'

export const metadata = genMeta({
  title: 'Daily Analytics',
  description: 'Daily trends and performance insights',
  noIndex: true,
})

export default async function DailyAnalyticsPage() {
  return <DailyAnalytics />
}
