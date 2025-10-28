import { Badge } from '@/components/ui/badge'
import { DollarSign, Star } from 'lucide-react'
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
  avg_rating: number | null
}

type RevenueLeadersProps = {
  services: ServicePerformance[]
  formatCurrency: (amount: number) => string
}

export function RevenueLeaders({ services, formatCurrency }: RevenueLeadersProps) {
  const topServices = [...services]
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5)

  return (
    <Item variant="outline" className="md:col-span-2 flex-col gap-4">
      <ItemHeader className="items-center gap-2">
        <DollarSign className="size-5" />
        <ItemTitle>Top Revenue Generators</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemGroup className="flex flex-col gap-4">
          {topServices.map((service, index) => (
            <Item key={service.service_id}>
              <ItemContent className="flex items-center gap-3">
                <Badge variant={index === 0 ? 'default' : 'secondary'}>#{index + 1}</Badge>
                <div>
                  <ItemTitle>{service.service_name}</ItemTitle>
                  <ItemDescription>{service.total_bookings} bookings</ItemDescription>
                </div>
              </ItemContent>
              <ItemActions className="flex-none text-right">
                <p>{formatCurrency(service.total_revenue)}</p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="size-3 text-accent" />
                  {service.avg_rating?.toFixed(1) || 'N/A'}
                </div>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
