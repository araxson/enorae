import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getChainAnalytics, getChainSalons } from '@/features/business/chains/api/queries'
import { ChainLocationsList } from './chain-locations-list'
import { ChainAnalyticsCards } from './chain-analytics-cards'

type ChainDetailViewProps = {
  chainId: string
  chainName: string
}

export async function ChainDetailView({ chainId, chainName }: ChainDetailViewProps) {
  const [rawSalons, analytics] = await Promise.all([
    getChainSalons(chainId),
    getChainAnalytics(chainId),
  ])

  // Filter salons to ensure required fields are present
  const salons = rawSalons
    .filter((salon): salon is typeof rawSalons[number] & { id: string } => Boolean(salon.id))
    .map((salon) => ({
      id: salon.id,
      name: salon.name ?? 'Unnamed Salon',
      city: salon.city,
    }))

  return (
    <div className="space-y-6">
      <ChainAnalyticsCards analytics={analytics} />

      <Card>
        <CardHeader>
          <CardTitle>Location Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ChainLocationsList locations={analytics.locationMetrics} salons={salons} />
        </CardContent>
      </Card>
    </div>
  )
}
