import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, Star } from 'lucide-react'

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
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          <CardTitle>Top Revenue Generators</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {topServices.map((service, index) => (
            <div key={service.service_id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={index === 0 ? 'default' : 'secondary'}>#{index + 1}</Badge>
                <div>
                  <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">{service.service_name}</h4>
                  <p className="text-muted-foreground">{service.total_bookings} bookings</p>
                </div>
              </div>
              <div className="text-right">
                <p>{formatCurrency(service.total_revenue)}</p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-3 w-3 text-accent" />
                  {service.avg_rating?.toFixed(1) || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
