import { Fragment } from 'react'
import { Award, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item'
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
    <ItemGroup className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader className="items-center gap-2">
          <ItemMedia variant="icon">
            <Star className="size-5 text-accent" />
          </ItemMedia>
          <ItemTitle>Top Services</ItemTitle>
        </ItemHeader>
        <ItemContent>
          {services.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No service data available</EmptyTitle>
                <EmptyDescription>
                  Bookings will populate this list once activity begins.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="gap-0">
              {services.map((service, index) => (
                <Fragment key={service.name}>
                  <Item variant="outline" size="sm">
                    <ItemMedia>
                      <Badge variant={index === 0 ? 'default' : 'outline'}>#{index + 1}</Badge>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{service.name}</ItemTitle>
                      <ItemDescription>{service.count} bookings</ItemDescription>
                    </ItemContent>
                    <ItemActions className="flex-none text-right">
                      <div className="font-semibold">{formatCurrency(service.revenue)}</div>
                    </ItemActions>
                  </Item>
                  {index < services.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              ))}
            </ItemGroup>
          )}
        </ItemContent>
      </Item>

      <Item variant="outline" className="flex-col gap-4">
        <ItemHeader className="items-center gap-2">
          <ItemMedia variant="icon">
            <Award className="size-5 text-secondary" />
          </ItemMedia>
          <ItemTitle>Top Performers</ItemTitle>
        </ItemHeader>
        <ItemContent>
          {staff.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No staff performance data</EmptyTitle>
                <EmptyDescription>
                  Staff metrics appear after appointments are completed.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="gap-0">
              {staff.map((member, index) => (
                <Fragment key={member.name}>
                  <Item variant="outline" size="sm">
                    <ItemMedia>
                      <Badge variant={index === 0 ? 'default' : 'outline'}>#{index + 1}</Badge>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{member.name}</ItemTitle>
                      <ItemDescription>
                        {member.title || 'Staff'} • {member.count} appointments
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions className="flex-none text-right">
                      <div className="font-semibold">{formatCurrency(member.revenue)}</div>
                    </ItemActions>
                  </Item>
                  {index < staff.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              ))}
            </ItemGroup>
          )}
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
