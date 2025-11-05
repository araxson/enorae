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

interface AmenitiesCardProps {
  salon: Salon
}

export function AmenitiesCard({ salon }: AmenitiesCardProps) {
  return (
    <MarketingPanel
      variant="outline"
      title="Amenities"
      description={`We're still collecting amenity details for ${salon['name'] || 'this salon'}.`}
      align="start"
    >
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Amenities coming soon</EmptyTitle>
          <EmptyDescription>
            We&apos;ll publish amenity information as soon as the salon shares it.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Amenity updates</ItemTitle>
              <ItemDescription>
                Check back later for updated in-salon experiences.
              </ItemDescription>
            </ItemContent>
          </Item>
        </EmptyContent>
      </Empty>
    </MarketingPanel>
  )
}
