import { Calendar as CalendarIcon } from 'lucide-react'
import { Section, Stack } from '@/components/layout'
import { H1, Muted } from '@/components/ui/typography'

import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  getAnalyticsOverview,
  getTopServices,
  getTopStaff,
  getAnalyticsSalon,
} from './api/queries'
import { AnalyticsOverviewCards } from './components/analytics-overview'
import { TopPerformers } from './components/top-performers'

type EnhancedAnalyticsProps = {
  startDate?: string
  endDate?: string
}

export async function EnhancedAnalytics({
  startDate,
  endDate
}: EnhancedAnalyticsProps = {}) {
  // Get salon from DAL
  let salon
  try {
    salon = await getAnalyticsSalon()
  } catch (error) {
    return (
      <Section size="lg">
        <Alert>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load salon data'}
          </AlertDescription>
        </Alert>
      </Section>
    )
  }

  // Default to last 30 days if not provided
  const end = endDate || new Date().toISOString().split('T')[0]
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Fetch analytics data in parallel
  const [overview, topServices, topStaff] = await Promise.all([
    getAnalyticsOverview(salon.id, start, end),
    getTopServices(salon.id, start, end, 5),
    getTopStaff(salon.id, start, end, 5),
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        {/* Header */}
        <div>
          <H1>Analytics Dashboard</H1>
          <Muted className="flex items-center gap-2 mt-1">
            <CalendarIcon className="h-4 w-4" />
            {new Date(start).toLocaleDateString()} - {new Date(end).toLocaleDateString()}
          </Muted>
        </div>

        {/* Overview Cards */}
        <AnalyticsOverviewCards data={overview} />

        {/* Top Performers */}
        <TopPerformers services={topServices} staff={topStaff} />
      </Stack>
    </Section>
  )
}

export function EnhancedAnalyticsSkeleton() {
  return (
    <Section size="lg">
      <Stack gap="xl">
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-muted rounded animate-pulse" />
          <div className="h-96 bg-muted rounded animate-pulse" />
        </div>
      </Stack>
    </Section>
  )
}
