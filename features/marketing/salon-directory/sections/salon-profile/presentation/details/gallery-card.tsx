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

interface GalleryCardProps {
  salon: Salon
}

export function GalleryCard({ salon }: GalleryCardProps) {
  return (
    <MarketingPanel
      variant="outline"
      title="Gallery"
      description={`We're curating the best photos for ${salon['name'] || 'this salon'}.`}
      align="start"
    >
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Images coming soon</EmptyTitle>
          <EmptyDescription>
            Check back later for visual highlights.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>Visual preview</ItemTitle>
              <ItemDescription>
                We'll add imagery as soon as the salon shares updated assets.
              </ItemDescription>
            </ItemContent>
          </Item>
        </EmptyContent>
      </Empty>
    </MarketingPanel>
  )
}
