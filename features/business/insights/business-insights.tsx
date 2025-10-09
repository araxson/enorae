import { getUserSalonId } from '@/features/shared/salon/api/queries'
import {
  getTrendInsights,
  getBusinessRecommendations,
  getAnomalyAlerts,
  getGrowthOpportunities
} from './api/business-insights'
import { BusinessInsightsDashboard } from './components/business-insights-dashboard'
import { Stack } from '@/components/layout'
import { H1, P } from '@/components/ui/typography'

export async function BusinessInsights() {
  const salonId = await getUserSalonId()

  const [trends, recommendations, alerts, opportunities] = await Promise.all([
    getTrendInsights(salonId),
    getBusinessRecommendations(salonId),
    getAnomalyAlerts(salonId),
    getGrowthOpportunities(salonId)
  ])

  return (
    <Stack gap="xl">
      <div>
        <H1>Business Insights</H1>
        <P className="text-muted-foreground">
          AI-powered insights, trend detection, and growth recommendations
        </P>
      </div>

      <BusinessInsightsDashboard
        trends={trends}
        recommendations={recommendations}
        alerts={alerts}
        opportunities={opportunities}
      />
    </Stack>
  )
}
