import { Fragment } from 'react'
import { Award, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Separator } from '@/components/ui/separator'
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
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No service data available</EmptyTitle>
                <EmptyDescription>Bookings will populate this list once activity begins.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col">
              {services.map((service, index) => (
                <Fragment key={service.name}>
                  <article className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
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
                  </article>
                  {index < services.length - 1 ? <Separator /> : null}
                </Fragment>
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
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No staff performance data</EmptyTitle>
                <EmptyDescription>Staff metrics appear after appointments are completed.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col">
              {staff.map((member, index) => (
                <Fragment key={member.name}>
                  <article className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
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
                  </article>
                  {index < staff.length - 1 ? <Separator /> : null}
                </Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
