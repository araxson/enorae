import { Clock, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

interface AppointmentServiceCardProps {
  serviceName: string | null
  durationMinutes: number | null
  totalPrice: number | null
}

const formatCurrency = (amount: number | null) => {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function AppointmentServiceCard({
  serviceName,
  durationMinutes,
  totalPrice,
}: AppointmentServiceCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <ItemGroup className="gap-4">
          <Item>
            <ItemContent>
              <ItemTitle>{serviceName || 'No service specified'}</ItemTitle>
            </ItemContent>
          </Item>
          {durationMinutes ? (
            <Item>
              <ItemMedia variant="icon">
                <Clock className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>{durationMinutes} minutes</ItemDescription>
              </ItemContent>
            </Item>
          ) : null}
          {totalPrice !== null ? (
            <Item>
              <ItemMedia variant="icon">
                <DollarSign className="size-4" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{formatCurrency(totalPrice)}</ItemTitle>
              </ItemContent>
            </Item>
          ) : null}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
