'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  const isFeaturedSalon = featured || salon.is_featured

  return (
    <Link
      href={`/customer/salons/${salon.slug}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{salon.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isFeaturedSalon || salon.is_verified ? (
            <div className="flex flex-wrap items-center gap-2">
              {salon.is_verified ? (
                <Badge variant="outline" className="inline-flex items-center gap-1">
                  <Shield className="size-3.5" aria-hidden="true" />
                  Verified
                </Badge>
              ) : null}
              {isFeaturedSalon ? (
                <Badge variant="secondary" className="inline-flex items-center gap-1">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Featured
                </Badge>
              ) : null}
            </div>
          ) : null}
          <ItemGroup className="gap-3">
            <Item variant="muted" className="items-center gap-3">
              <ItemMedia variant="icon">
                <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemDescription>{formatAddress(salon.address)}</ItemDescription>
              </ItemContent>
            </Item>
            <Item>
              <ItemMedia variant="icon">
                <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{formatRating(salon.rating_average)}</ItemTitle>
              </ItemContent>
              <ItemActions className="flex-none gap-2">
                {!featured && salon.similarity_score ? (
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
                <Sparkles className="size-5 text-accent" />
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
                <TrendingUp className="size-5" />
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
                <Search className="size-6" />
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
