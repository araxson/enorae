import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <Item variant="muted" className="flex-col gap-2">
          <ItemHeader>
            <ItemTitle>What guests can expect</ItemTitle>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  )
}
