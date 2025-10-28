import { memo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Shield, Sparkles } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

type SalonCardProps = {
  salon: {
    id: string
    name: string
    slug: string
    is_verified: boolean
    is_featured?: boolean
    rating_average: number
    similarity_score?: number
    address: {
      city?: string | null
      state?: string | null
    } | null | undefined
  }
  variant?: 'default' | 'featured'
}

function formatRating(rating: number) {
  return rating.toFixed(1)
}

function formatAddress(address: { city?: string | null; state?: string | null } | null | undefined) {
  const parts = []
  if (address?.city) parts.push(address.city)
  if (address?.state) parts.push(address.state)
  return parts.join(', ') || 'Location not available'
}

// PERFORMANCE: Wrap in React.memo to prevent re-renders when props haven't changed
// This is especially important for list items like SalonCard
function SalonCardComponent({ salon, variant = 'default' }: SalonCardProps) {
  return (
    <Link href={`/customer/salons/${salon.slug}`}>
      <Card className="h-full">
        <CardHeader>
          <ItemGroup className="gap-2">
            <Item>
              <ItemContent>
                <CardTitle>{salon.name}</CardTitle>
              </ItemContent>
              <ItemActions className="flex-none gap-1">
                {salon.is_verified ? (
                  <Shield className="size-4 text-secondary" aria-label="Verified salon" />
                ) : null}
                {salon.is_featured ? (
                  <Sparkles className="size-4 text-accent" aria-label="Featured salon" />
                ) : null}
              </ItemActions>
            </Item>
            <Item>
              <ItemContent>
                <ItemDescription>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-3" aria-hidden="true" />
                    <CardDescription>{formatAddress(salon.address)}</CardDescription>
                  </span>
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{formatRating(salon.rating_average)} stars</ItemTitle>
              </ItemContent>
              <ItemActions className="flex-none gap-2">
                {variant === 'featured' ? (
                  <Badge variant="secondary">Featured</Badge>
                ) : salon.similarity_score ? (
                  <Badge variant="outline">
                    {Math.round(salon.similarity_score * 100)}% match
                  </Badge>
                ) : null}
              </ItemActions>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
    </Link>
  )
}

// PERFORMANCE: Export memoized version
export const SalonCard = memo(SalonCardComponent)
