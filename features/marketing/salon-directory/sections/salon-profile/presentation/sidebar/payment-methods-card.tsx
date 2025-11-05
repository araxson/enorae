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
  ItemTitle,
} from '@/components/ui/item'
import { MarketingPanel } from '@/features/marketing/components/common'
import type { Salon } from '../types'

interface PaymentMethodsCardProps {
  salon: Salon
}

export function PaymentMethodsCard({ salon }: PaymentMethodsCardProps) {
  return (
    <MarketingPanel
      variant="outline"
      title="Payment methods"
      description={`${salon['name'] || 'This salon'} hasn't shared accepted payment methods yet.`}
      align="start"
    >
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Payment options unavailable</EmptyTitle>
          <EmptyDescription>
            We&apos;ll post accepted payment types once the salon confirms them.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Accepted payments</ItemTitle>
              <ItemDescription>
                Reach out to confirm how you can pay before your appointment.
              </ItemDescription>
            </ItemContent>
          </Item>
        </EmptyContent>
      </Empty>
    </MarketingPanel>
  )
}
