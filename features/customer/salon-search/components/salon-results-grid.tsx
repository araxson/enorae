'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Shield, Sparkles, TrendingUp } from 'lucide-react'
import type { SalonSearchResult } from '../api/queries'

interface SalonResultsGridProps {
  results: SalonSearchResult[]
  featuredSalons: SalonSearchResult[]
  searchTerm: string
}

function formatRating(rating: number): string {
  return rating.toFixed(1)
}

function formatAddress(address: { city?: string | null; state?: string | null } | null | undefined): string {
  const parts = []
  if (address?.city) parts.push(address.city)
  if (address?.state) parts.push(address.state)
  return parts.join(', ') || 'Location not available'
}

interface SalonCardProps {
  salon: SalonSearchResult
  featured?: boolean
}

function SalonCard({ salon, featured = false }: SalonCardProps) {
  return (
    <Link
      href={`/customer/salons/${salon.slug}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>{salon.name}</CardTitle>
            <div className="flex gap-1">
              {salon.is_verified && (
                <Shield className="h-4 w-4 text-secondary" />
              )}
              {(featured || salon.is_featured) && (
                <Sparkles className="h-4 w-4 text-accent" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <CardDescription>{formatAddress(salon.address)}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <p className="font-semibold text-sm text-muted-foreground">{formatRating(salon.rating_average)}</p>
            {featured && (
              <Badge variant="secondary" className="ml-auto">Featured</Badge>
            )}
            {!featured && salon.similarity_score && (
              <Badge variant="outline" className="ml-auto">
                {Math.round(salon.similarity_score * 100)}% match
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function SalonResultsGrid({ results, featuredSalons, searchTerm }: SalonResultsGridProps) {
  const showFeatured = featuredSalons.length > 0 && !searchTerm
  const showResults = results.length > 0
  const showNoResults = results.length === 0 && searchTerm

  return (
    <>
      {/* Featured Salons */}
      {showFeatured && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2>Featured Salons</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredSalons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} featured />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <h2>Search Results ({results.length})</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showNoResults && (
        <Card>
          <CardContent className="py-12 text-center">
            <CardDescription>
              No salons found matching your criteria. Try adjusting your filters.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </>
  )
}
