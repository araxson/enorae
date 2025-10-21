import { Award, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
type TopPerformersProps = {
  services: Array<{ name: string; count: number; revenue: number }>
  staff: Array<{ name: string; title: string | null; count: number; revenue: number }>
}

export function TopPerformers({ services, staff }: TopPerformersProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Services */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            <CardTitle>Top Services</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No data available</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {services.map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={index === 0 ? 'default' : 'outline'}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <p className="text-xs text-muted-foreground">
                        {service.count} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(service.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Staff */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            <CardTitle>Top Performers</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No data available</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {staff.map((member, index) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant={index === 0 ? 'default' : 'outline'}>
                      #{index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <p className="text-xs text-muted-foreground">
                        {member.title || 'Staff'} • {member.count} appointments
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(member.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
