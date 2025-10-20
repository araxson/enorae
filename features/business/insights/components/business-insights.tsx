import { getUserSalonId } from '@/lib/auth'
import {
  getTrendInsights,
  getBusinessRecommendations,
  getAnomalyAlerts,
  getGrowthOpportunities,
} from './api/business-insights'
import { BusinessInsightsDashboard } from './components/business-insights-dashboard'
import { Section, Stack } from '@/components/layout'

export async function BusinessInsights() {
  const salonId = await getUserSalonId()
  if (!salonId) throw new Error('Salon ID required')

  const [trends, recommendations, alerts, opportunities] = await Promise.all([
    getTrendInsights(salonId),
    getBusinessRecommendations(salonId),
    getAnomalyAlerts(salonId),
    getGrowthOpportunities(salonId)
  ])

  return (
    <Section size="lg">
      <Stack gap="xl">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Business Insights</h1>
          <p className="leading-7 text-muted-foreground">
            AI-powered insights, trend detection, and growth recommendations
          </p>
        </div>

        <BusinessInsightsDashboard
          trends={trends}
          recommendations={recommendations}
          alerts={alerts}
          opportunities={opportunities}
        />
      </Stack>
    </Section>
  )
}
