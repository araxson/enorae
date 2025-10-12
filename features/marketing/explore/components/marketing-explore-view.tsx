'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Database } from '@/lib/types/database.types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { H2, Muted, P, Small } from '@/components/ui/typography'
import { MapPin, Search, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type Salon = Database['public']['Views']['salons']['Row']

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
        salon.name,
        salon.business_name,
        salon.business_type,
        salon.city,
        salon.state_province,
        salon.specialties?.join(' '),
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
        <Badge variant="outline" className="mx-auto w-fit sm:mx-0">
          <Sparkles className="mr-2 h-4 w-4" />
          Discover
        </Badge>
        <H2>Find your next favourite salon</H2>
        <P className="text-muted-foreground">
          Browse top-rated salons and beauty professionals near you. Book instantly and get the VIP
          treatment you deserve.
        </P>
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
          <CardContent className="space-y-3 py-12 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground" />
            <H2 className="text-xl">No salons match your search</H2>
            <Muted>Try a different city or service to discover more locations.</Muted>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredSalons.map((salon, index) => {
            const location =
              salon.full_address ||
              (salon.city && salon.state_province
                ? `${salon.city}, ${salon.state_province}`
                : salon.city || 'Location coming soon')

            const image = salon.cover_image_url || salon.logo_url || undefined
            const description = salon.short_description || salon.description || undefined

            return (
              <Card
                key={salon.id ?? salon.slug ?? `salon-${index}`}
                className="flex h-full flex-col"
              >
                {image ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                    <Image src={image} alt={salon.name ?? 'Salon cover'} fill className="object-cover" />
                  </div>
                ) : null}
                <CardHeader>
                  <CardTitle>{salon.name ?? salon.business_name ?? 'Salon'}</CardTitle>
                  {description ? <Muted className="line-clamp-2">{description}</Muted> : null}
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                  </div>
                  {salon.specialties?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {salon.specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  {salon.rating ? (
                    <Small className="font-medium">
                      ⭐ {Number(salon.rating).toFixed(1)} • {salon.review_count ?? 0} reviews
                    </Small>
                  ) : null}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" onClick={() => handleBook(salon.slug)}>
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
