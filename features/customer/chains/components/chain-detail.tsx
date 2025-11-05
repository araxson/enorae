import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Store, Users, MapPin, Star } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { SalonChainWithLocations } from '@/features/customer/chains/api/queries'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface ChainDetailProps {
  chain: SalonChainWithLocations
}

export function ChainDetail({ chain }: ChainDetailProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Chain Header */}
      <Card>
        <CardHeader>
          <ItemGroup>
            <Item>
              <ItemContent>
                <CardTitle>{chain['name']}</CardTitle>
                {chain['legal_name'] && chain['legal_name'] !== chain['name'] ? (
                  <CardDescription>Legal name: {chain['legal_name']}</CardDescription>
                ) : null}
              </ItemContent>
              {chain['is_verified'] ? (
                <ItemActions>
                  <div className="flex-none">
                    <Badge variant="default">Verified</Badge>
                  </div>
                </ItemActions>
              ) : null}
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <div
            className="group/item-group flex flex-col gap-4 md:grid md:grid-cols-2"
            data-slot="item-group"
            role="list"
          >
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Store className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Locations</ItemTitle>
                <ItemDescription>
                  {chain['salon_count'] || 0} {chain['salon_count'] === 1 ? 'salon' : 'salons'}
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Users className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Staff members</ItemTitle>
                <ItemDescription>{chain['staff_count'] || 0}</ItemDescription>
              </ItemContent>
            </Item>
          </div>
        </CardContent>
        <CardFooter>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Store className="size-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Footprint</ItemTitle>
                <ItemDescription>
                  {chain['salon_count'] || 0} {chain['salon_count'] === 1 ? 'Location' : 'Locations'}
                </ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardFooter>
      </Card>

      {/* Locations */}
      <div>
        <h3 className="mb-4 text-xl text-foreground">Locations</h3>
        {chain.locations && chain.locations.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {chain.locations.map((salon) => (
              <Card key={salon['id']}>
                <CardHeader>
                  <ItemGroup>
                    <Item>
                      <ItemContent>
                        <CardTitle>{salon['name']}</CardTitle>
                      </ItemContent>
                      {salon['is_verified'] ? (
                        <ItemActions>
                          <div className="flex-none">
                            <Badge variant="secondary">Verified</Badge>
                          </div>
                        </ItemActions>
                      ) : null}
                    </Item>
                  </ItemGroup>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div
                      className="group/item-group flex flex-col gap-2"
                      data-slot="item-group"
                      role="list"
                    >
                      {salon['formatted_address'] ? (
                        <Item variant="muted" size="sm">
                          <ItemMedia variant="icon">
                            <MapPin className="size-3" aria-hidden="true" />
                          </ItemMedia>
                          <ItemContent>
                            <ItemDescription>{salon['formatted_address']}</ItemDescription>
                          </ItemContent>
                        </Item>
                      ) : null}

                      {typeof salon['rating_average'] === 'number' ? (
                        <Item variant="muted" size="sm">
                          <ItemContent>
                            <ItemTitle>Rating</ItemTitle>
                            <ItemDescription className="flex items-center gap-1">
                              <Star className="size-4 fill-accent text-accent" aria-hidden="true" />
                              {salon['rating_average'].toFixed(1)} ({salon['rating_count'] || 0} reviews)
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/customer/book/${salon['id']}`}>
                        View salon
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MapPin className="size-5" aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No locations found</EmptyTitle>
                  <EmptyDescription>
                    This chain hasn&apos;t listed individual salon locations yet.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/customer/salons">Follow other salons</Link>
                  </Button>
                </EmptyContent>
              </Empty>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
