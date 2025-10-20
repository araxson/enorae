import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  getAnalyticsOverview,
  getTopServices,
  getTopStaff,
  getAnalyticsSalon,
  getCustomerInsights,
  getCustomerCohorts,
  getChainSalonBreakdown,
  getChainRevenueComparison,
} from './api/queries'
import { AnalyticsOverviewCards } from './components/analytics-overview'
import { getUserRole } from '@/lib/auth'
import { DateRangeHeader } from './components/sections/date-range-header'
import { TopPerformersSection } from './components/sections/top-performers-section'
import { CustomerInsightsSection } from './components/sections/customer-insights-section'
import { CohortsTable } from './components/sections/cohorts-table'
import { ChainAnalyticsSection } from './components/sections/chain-analytics-section'

type EnhancedAnalyticsProps = {
  startDate?: string
  endDate?: string
}

export async function EnhancedAnalytics({ startDate, endDate }: EnhancedAnalyticsProps = {}) {
  let salon
  try {
    salon = await getAnalyticsSalon()
  } catch (error) {
    return (
      <section className="py-16 md:py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Alert>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load salon data'}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  const end = endDate || new Date().toISOString().split('T')[0]
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [overview, topServices, topStaff, insights, cohorts] = await Promise.all([
    getAnalyticsOverview(salon.id, start, end),
    getTopServices(salon.id, start, end, 5),
    getTopStaff(salon.id, start, end, 5),
    getCustomerInsights(salon.id, start, end),
    getCustomerCohorts(salon.id, 6),
  ])

  const role = await getUserRole()
  const isTenantOwner = role === 'tenant_owner'
  let chainBreakdown: Awaited<ReturnType<typeof getChainSalonBreakdown>> = []
  let chainCompare: Awaited<ReturnType<typeof getChainRevenueComparison>> | null = null

  if (isTenantOwner) {
    ;[chainBreakdown, chainCompare] = await Promise.all([
      getChainSalonBreakdown(start, end),
      getChainRevenueComparison(start, end),
    ])
  }

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
        <DateRangeHeader start={start} end={end} />
        <AnalyticsOverviewCards data={overview} />
        <TopPerformersSection start={start} end={end} services={topServices} staff={topStaff} />
        <CustomerInsightsSection start={start} end={end} insights={insights} />
        <CohortsTable cohorts={cohorts} start={start} end={end} />
        {isTenantOwner && chainCompare ? (
          <ChainAnalyticsSection start={start} end={end} breakdown={chainBreakdown} comparison={chainCompare} />
        ) : null}
        </div>
      </div>
    </section>
  )
}
