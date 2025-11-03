'use client'

import { Badge } from '@/components/ui/badge'
import { Link2 } from 'lucide-react'
import type { ServicePairing } from '../../api/types'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'

export function ServicePairingsCard({ pairings }: { pairings: ServicePairing[] }) {
  return (
    <Item variant="outline" className="flex-col gap-3">
      <ItemHeader className="items-center gap-2">
        <Link2 className="size-5" />
        <ItemTitle>Service Pairings</ItemTitle>
      </ItemHeader>
      <ItemContent className="space-y-2">
        <ItemGroup className="space-y-2">
          {pairings.map((pair) => (
            <Item key={`${pair.primary}-${pair.paired}`} variant="outline" className="items-center justify-between gap-3">
              <ItemContent>
                <p className="text-base font-medium">{pair.primary}</p>
                <p className="text-xs text-muted-foreground">Often paired with {pair.paired}</p>
              </ItemContent>
              <ItemActions className="flex-none">
                <Badge variant="secondary">{pair.count} combos</Badge>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </ItemContent>
    </Item>
  )
}
