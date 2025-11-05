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

interface SpecialtiesCardProps {
  salon: Salon
}

export function SpecialtiesCard({ salon }: SpecialtiesCardProps) {
  return (
    <MarketingPanel
      variant="outline"
      title="Specialties"
      description={`We're compiling the signature services for ${salon['name'] || 'this salon'}.`}
      align="start"
    >
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Specialties coming soon</EmptyTitle>
          <EmptyDescription>
            We&apos;ll publish the highlighted expertise once the salon shares them.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Signature services</ItemTitle>
              <ItemDescription>
                Check back as salons update their highlighted expertise.
              </ItemDescription>
            </ItemContent>
          </Item>
        </EmptyContent>
      </Empty>
    </MarketingPanel>
  )
}
