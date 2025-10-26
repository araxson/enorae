import { memo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Shield, Sparkles } from 'lucide-react'

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
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{salon.name}</CardTitle>
            <div className="flex gap-1">
              {salon.is_verified && <Shield className="h-4 w-4 text-secondary" />}
              {salon.is_featured && <Sparkles className="h-4 w-4 text-accent" />}
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <CardDescription>{formatAddress(salon.address)}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span>{formatRating(salon.rating_average)}</span>
            </div>
            {variant === 'featured' ? (
              <Badge variant="secondary">Featured</Badge>
            ) : salon.similarity_score ? (
              <Badge variant="outline">
                {Math.round(salon.similarity_score * 100)}% match
              </Badge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// PERFORMANCE: Export memoized version
export const SalonCard = memo(SalonCardComponent)
