import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserSalonId } from '@/lib/auth'
import {
  getTrendInsights,
  getBusinessRecommendations,
  getAnomalyAlerts,
  getGrowthOpportunities,
} from '@/features/business/insights/api/business-insights'

import { BusinessInsightsDashboard } from './business-insights-dashboard'

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
    <section className="py-10 mx-auto w-full px-6 max-w-6xl">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Business insights</CardTitle>
            <CardDescription>
              AI-powered insights, trend detection, and growth recommendations.
            </CardDescription>
          </CardHeader>
        </Card>

        <BusinessInsightsDashboard
          trends={trends}
          recommendations={recommendations}
          alerts={alerts}
          opportunities={opportunities}
        />
      </div>
    </section>
  )
}
