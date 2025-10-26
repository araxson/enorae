import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'

type ServicePerformance = {
  service_id: string
  service_name: string
  total_bookings: number
  total_revenue: number
  popularity_score: number | null
}

type PopularityRankingProps = {
  services: ServicePerformance[]
  formatCurrency: (amount: number) => string
}

export function PopularityRanking({ services, formatCurrency }: PopularityRankingProps) {
  const trendingServices = [...services]
    .sort((a, b) => b.total_bookings - a.total_bookings)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <CardTitle>Most Popular Services</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {trendingServices.map((service, index) => (
            <div key={service.service_id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={index === 0 ? 'default' : 'outline'}>#{index + 1}</Badge>
                <div>
                  <h4>{service.service_name}</h4>
                  <p className="text-muted-foreground">
                    Popularity: {service.popularity_score?.toFixed(0) || 0}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p>{service.total_bookings} bookings</p>
                <p className="text-muted-foreground">{formatCurrency(service.total_revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
