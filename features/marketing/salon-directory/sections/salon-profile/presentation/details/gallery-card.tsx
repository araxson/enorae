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

interface GalleryCardProps {
  salon: Salon
}

export function GalleryCard({ salon }: GalleryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Images coming soon</EmptyTitle>
            <EmptyDescription>
              We&apos;re curating the best photos for {salon['name'] || 'this salon'}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Item variant="muted">
              <ItemHeader>
                <ItemTitle>Visual preview</ItemTitle>
              </ItemHeader>
              <ItemContent>
                <ItemDescription>
                  Check back later for visual highlights.
                </ItemDescription>
              </ItemContent>
            </Item>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
