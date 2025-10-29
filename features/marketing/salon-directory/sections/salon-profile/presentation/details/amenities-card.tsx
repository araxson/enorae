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

interface AmenitiesCardProps {
  salon: Salon
}

export function AmenitiesCard({ salon }: AmenitiesCardProps) {
  return (
    <Item variant="outline" className="flex flex-col gap-4">
      <ItemHeader>
        <ItemTitle>
          <h3 className="text-lg font-semibold tracking-tight">Amenities</h3>
        </ItemTitle>
      </ItemHeader>
      <ItemContent>
        <Empty className="border border-border/50 bg-card/40">
          <EmptyHeader>
            <EmptyTitle>Amenities coming soon</EmptyTitle>
            <EmptyDescription>
              We&apos;re still collecting amenity details for {salon['name'] || 'this salon'}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Item variant="muted">
              <ItemHeader>
                <ItemTitle>Amenity updates</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>
                  Check back later for updated in-salon experiences.
                </ItemDescription>
              </ItemContent>
            </Item>
          </EmptyContent>
        </Empty>
      </ItemContent>
    </Item>
  )
}
