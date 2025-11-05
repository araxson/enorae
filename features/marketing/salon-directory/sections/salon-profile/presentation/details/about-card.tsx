import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { MarketingPanel } from '@/features/marketing/components/common'
import type { Salon } from '../types'

interface AboutCardProps {
  salon: Salon
}

export function AboutCard({ salon }: AboutCardProps) {
  const description = salon['full_description'] || salon['short_description']
  if (!description) return null

  return (
    <MarketingPanel
      variant="outline"
      title="About"
      description="What guests can expect"
      align="start"
    >
      <Item variant="muted">
        <ItemContent>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>
      </Item>
    </MarketingPanel>
  )
}
