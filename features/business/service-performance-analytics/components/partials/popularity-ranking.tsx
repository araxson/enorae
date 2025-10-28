import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

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
    <Item variant="outline" className="flex-col gap-4">
      <ItemHeader className="items-center gap-2">
        <TrendingUp className="size-5" />
        <ItemTitle>Most Popular Services</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemGroup className="flex flex-col gap-4">
          {trendingServices.map((service, index) => (
            <Item key={service.service_id}>
              <ItemContent className="flex items-center gap-3">
                <Badge variant={index === 0 ? 'default' : 'outline'}>#{index + 1}</Badge>
                <div>
                  <ItemTitle>{service.service_name}</ItemTitle>
                  <ItemDescription>
                    Popularity: {service.popularity_score?.toFixed(0) || 0}
                  </ItemDescription>
                </div>
              </ItemContent>
              <ItemActions className="flex-none text-right">
                <p>{service.total_bookings} bookings</p>
                <p className="text-muted-foreground">{formatCurrency(service.total_revenue)}</p>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
