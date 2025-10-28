'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Shield, Sparkles, TrendingUp, Search } from 'lucide-react'
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import type { SalonSearchResult } from '@/features/customer/salon-search/api/queries'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

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
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{salon.name}</CardTitle>
            <div className="flex gap-1">
              {salon.is_verified && <Shield className="h-4 w-4 text-secondary" aria-label="Verified salon" />}
              {(featured || salon.is_featured) && <Sparkles className="h-4 w-4 text-accent" aria-label="Featured salon" />}
            </div>
          </div>
          <CardDescription>
            <MapPin className="h-3 w-3 text-muted-foreground inline" aria-hidden="true" />
            {' '}
            {formatAddress(salon.address)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            <Item>
              <ItemMedia variant="icon">
                <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{formatRating(salon.rating_average)}</ItemTitle>
              </ItemContent>
              <ItemActions className="flex-none gap-2">
                {featured && <Badge variant="secondary">Featured</Badge>}
                {!featured && salon.similarity_score && (
                  <Badge variant="outline">
                    {Math.round(salon.similarity_score * 100)}% match
                  </Badge>
                )}
              </ItemActions>
            </Item>
          </ItemGroup>
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
          <ItemGroup className="mb-4 flex items-center gap-2">
            <Item className="items-center gap-2">
              <ItemMedia variant="icon">
                <Sparkles className="h-5 w-5 text-accent" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Featured Salons</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
          <ItemGroup className="mb-4">
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemDescription>
                  {featuredSalons.length}{' '}
                  {featuredSalons.length === 1 ? 'featured salon' : 'featured salons'}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
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
          <ItemGroup className="mb-4 flex items-center gap-2">
            <Item className="items-center gap-2">
              <ItemMedia variant="icon">
                <TrendingUp className="h-5 w-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Search Results ({results.length})</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
          <ItemGroup className="mb-4">
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemDescription>
                  {results.length}{' '}
                  {results.length === 1 ? 'matching salon' : 'matching salons'}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
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
          <CardContent className="p-6">
            <Empty>
              <EmptyMedia variant="icon">
                <Search className="h-6 w-6" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No salons found</EmptyTitle>
                <EmptyDescription>Nothing matches your current filters.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                Adjust your search term or remove filters to broaden the results.
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      )}
    </>
  )
}
