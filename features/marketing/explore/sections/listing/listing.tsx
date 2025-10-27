'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/types/database.types'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { MapPin, Search, Sparkles, Star, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { listingCopy } from './listing.data'

type Salon = Database['public']['Views']['salons_view']['Row']

export interface ExploreListingProps {
  salons: Salon[]
}

export function ExploreListing({ salons }: ExploreListingProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const filteredSalons = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return salons

    return salons.filter((salon) => {
      const haystack = [
        salon['name'],
        salon['city'],
        salon['state_province'],
        salon['short_description'],
        salon['full_description'],
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(q)
    })
  }, [query, salons])

  function handleBook(slug?: string | null) {
    if (!slug) {
      router.push('/signup')
      return
    }

    router.push(`/signup?redirect=/customer/salons/${slug}`)
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header>
        <ItemGroup className="gap-4 text-center sm:text-left">
          <div className="flex justify-center sm:justify-start">
            <Badge variant="outline">
              <Sparkles className="mr-2 h-4 w-4" />
              {listingCopy.badge}
            </Badge>
          </div>
          <h2 className="scroll-m-20">{listingCopy.title}</h2>
          <p className="leading-7 text-muted-foreground">{listingCopy.description}</p>
        </ItemGroup>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <Search className="size-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={listingCopy.searchPlaceholder}
            />
            {query ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X className="size-4" aria-hidden="true" />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
          <Button type="button" className="gap-2" onClick={() => setQuery(query.trim())}>
            <Search className="h-4 w-4" />
            {listingCopy.searchButton}
          </Button>
        </div>
      </header>

      {filteredSalons.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <Empty>
              <EmptyMedia variant="icon">
                <Search className="size-6" aria-hidden="true" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>{listingCopy.emptyTitle}</EmptyTitle>
                <EmptyDescription>{listingCopy.emptyDescription}</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" onClick={() => setQuery('')} className="gap-2">
                  <Sparkles className="size-4" aria-hidden="true" />
                  {listingCopy.resetLabel}
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSalons.map((salon, index) => {
            const location =
              salon['formatted_address'] ||
              (salon['city'] && salon['state_province']
                ? `${salon['city']}, ${salon['state_province']}`
                : salon['city'] || 'Location coming soon')

            const description = salon['short_description'] || undefined

            return (
              <Card
                key={salon['id'] ?? salon['slug'] ?? `salon-${index}`}
                className="flex h-full flex-col"
              >
                <CardHeader>
                  <CardTitle>{salon['name'] ?? 'Salon'}</CardTitle>
                  {description ? (
                    <div className="line-clamp-2">
                      <CardDescription>{description}</CardDescription>
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className="flex-1">
                  <ItemGroup className="gap-2">
                    <Item variant="muted">
                      <ItemMedia variant="icon">
                        <MapPin className="size-4" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemDescription>{location}</ItemDescription>
                      </ItemContent>
                    </Item>
                    {salon['rating_average'] ? (
                      <Item variant="muted">
                        <ItemMedia variant="icon">
                          <Star className="size-4" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{Number(salon['rating_average']).toFixed(1)}</ItemTitle>
                          <ItemDescription>{salon['rating_count'] ?? 0} reviews</ItemDescription>
                        </ItemContent>
                      </Item>
                    ) : null}
                  </ItemGroup>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" onClick={() => handleBook(salon['slug'])}>
                    {listingCopy.ctaLabel}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
