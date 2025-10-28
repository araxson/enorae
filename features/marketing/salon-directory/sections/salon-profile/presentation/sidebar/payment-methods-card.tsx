import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { Salon } from '../types'

interface PaymentMethodsCardProps {
  salon: Salon
}

export function PaymentMethodsCard({ salon }: PaymentMethodsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment methods</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Payment options unavailable</EmptyTitle>
            <EmptyDescription>
              {salon['name'] || 'This salon'} hasn&apos;t shared accepted payment methods yet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Item variant="muted" className="flex-col gap-1">
              <ItemHeader>
                <ItemTitle>Accepted payments</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>
                  Reach out to confirm how you can pay before your appointment.
                </ItemDescription>
              </ItemContent>
            </Item>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
