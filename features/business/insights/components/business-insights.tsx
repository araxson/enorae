import { getUserSalonId } from '@/lib/auth'
import {
  getTrendInsights,
  getBusinessRecommendations,
  getAnomalyAlerts,
  getGrowthOpportunities,
} from './api/business-insights'
import { BusinessInsightsDashboard } from './components/business-insights-dashboard'

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
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Business Insights</h1>
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
      </div>
    </section>
  )
}
