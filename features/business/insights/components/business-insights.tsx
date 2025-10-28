import { Card, CardHeader } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { getUserSalonId } from '@/lib/auth'
import {
  getTrendInsights,
  getBusinessRecommendations,
  getAnomalyAlerts,
  getGrowthOpportunities,
} from '@/features/business/insights/api/queries'

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
            <ItemGroup>
              <Item className="flex-col items-start gap-1">
                <ItemContent>
                  <ItemTitle>Business insights</ItemTitle>
                </ItemContent>
                <ItemContent>
                  <ItemDescription>
                    AI-powered insights, trend detection, and growth recommendations.
                  </ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
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
