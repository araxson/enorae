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
    <Item variant="outline" className="flex flex-col gap-4">
      <ItemHeader>
        <ItemTitle>
          <h3 className="text-lg font-semibold tracking-tight">Payment methods</h3>
        </ItemTitle>
      </ItemHeader>
      <ItemContent>
        <Empty className="border border-border/50 bg-card/40">
          <EmptyHeader>
            <EmptyTitle>Payment options unavailable</EmptyTitle>
            <EmptyDescription>
              {salon['name'] || 'This salon'} hasn&apos;t shared accepted payment methods yet.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Item variant="muted">
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
      </ItemContent>
    </Item>
  )
}
