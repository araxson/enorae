import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { Salon } from '../types'

interface AboutCardProps {
  salon: Salon
}

export function AboutCard({ salon }: AboutCardProps) {
  const description = salon['full_description'] || salon['short_description']
  if (!description) return null

  return (
    <Item variant="outline" className="flex flex-col gap-4">
      <ItemHeader>
        <ItemTitle>
          <h3 className="text-lg font-semibold tracking-tight">About</h3>
        </ItemTitle>
      </ItemHeader>
      <ItemContent>
        <Item variant="muted">
          <ItemHeader>
            <ItemTitle>What guests can expect</ItemTitle>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
        </Item>
      </ItemContent>
    </Item>
  )
}
