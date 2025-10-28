'use client'

import { Clock, DollarSign, Star, TrendingUp } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type ServiceDetailsProps = {
  effectiveDuration?: number | null
  effectivePrice?: number | null
  performedCount?: number | null
  ratingAverage?: number | null
  ratingCount?: number | null
}

export function ServiceDetails({
  effectiveDuration,
  effectivePrice,
  performedCount,
  ratingAverage,
  ratingCount,
}: ServiceDetailsProps) {
  return (
    <ItemGroup className="gap-2">
      {effectiveDuration && (
        <Item size="sm" variant="muted">
          <ItemMedia variant="icon">
            <Clock className="h-4 w-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{effectiveDuration} minutes</ItemTitle>
            <ItemDescription>Duration</ItemDescription>
          </ItemContent>
        </Item>
      )}
      {effectivePrice && (
        <Item size="sm" variant="muted">
          <ItemMedia variant="icon">
            <DollarSign className="h-4 w-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>${effectivePrice}</ItemTitle>
            <ItemDescription>Base price</ItemDescription>
          </ItemContent>
        </Item>
      )}
      {performedCount != null && performedCount > 0 && (
        <Item size="sm" variant="muted">
          <ItemMedia variant="icon">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Performed {performedCount} times</ItemTitle>
          </ItemContent>
        </Item>
      )}
      {ratingAverage && ratingCount && ratingCount > 0 && (
        <Item size="sm" variant="muted">
          <ItemMedia variant="icon">
            <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{ratingAverage.toFixed(1)} rating</ItemTitle>
            <ItemDescription>{ratingCount} reviews</ItemDescription>
          </ItemContent>
        </Item>
      )}
    </ItemGroup>
  )
}
