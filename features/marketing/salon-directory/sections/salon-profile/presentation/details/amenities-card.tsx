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

interface AmenitiesCardProps {
  salon: Salon
}

export function AmenitiesCard({ salon }: AmenitiesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Amenities coming soon</EmptyTitle>
            <EmptyDescription>
              We&apos;re still collecting amenity details for {salon['name'] || 'this salon'}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Item variant="muted" className="flex-col gap-1">
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
      </CardContent>
    </Card>
  )
}
