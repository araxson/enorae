'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
import { Input } from '@/components/ui/input'
import { MapPin, Search, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Salon = Database['public']['Views']['salons_view']['Row']

interface MarketingExploreViewProps {
  salons: Salon[]
}

export function MarketingExploreView({ salons }: MarketingExploreViewProps) {
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
      <header className="space-y-4 text-center sm:text-left">
        <div className="flex justify-center sm:justify-start">
          <Badge variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Discover
          </Badge>
        </div>
        <h2 className="scroll-m-20">Find your next favourite salon</h2>
        <p className="leading-7 text-muted-foreground">
          Browse top-rated salons and beauty professionals near you. Book instantly and get the VIP
          treatment you deserve.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by salon, service, or city"
            className="flex-1"
          />
          <Button type="button" className="gap-2" onClick={() => setQuery(query.trim())}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </header>

      {filteredSalons.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 py-12 flex flex-col items-center justify-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="scroll-m-20">No salons match your search</h2>
            <p className="text-muted-foreground">Try a different city or service to discover more locations.</p>
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
                <CardContent className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                  {salon['rating_average'] ? (
                    <p>
                      ⭐ {Number(salon['rating_average']).toFixed(1)} • {salon['rating_count'] ?? 0} reviews
                    </p>
                  ) : null}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" onClick={() => handleBook(salon['slug'])}>
                    Book with Enorae
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
