import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Store, Users, MapPin } from 'lucide-react'
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
                <ItemActions className="flex-none">
                  <Badge variant="default">Verified</Badge>
                </ItemActions>
              ) : null}
            </Item>
          </ItemGroup>
        </CardHeader>
        <CardContent>
          <ItemGroup className="gap-4 md:grid md:grid-cols-2">
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Store className="h-4 w-4" aria-hidden="true" />
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
                <Users className="h-4 w-4" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Staff members</ItemTitle>
                <ItemDescription>{chain['staff_count'] || 0}</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
        <CardFooter>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemMedia variant="icon">
                <Store className="h-4 w-4" aria-hidden="true" />
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
                        <ItemActions className="flex-none">
                          <Badge variant="secondary">Verified</Badge>
                        </ItemActions>
                      ) : null}
                    </Item>
                  </ItemGroup>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ItemGroup className="gap-2">
                    {salon['formatted_address'] ? (
                      <Item variant="muted" size="sm">
                        <ItemMedia variant="icon">
                          <MapPin className="h-3 w-3" aria-hidden="true" />
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
                          <ItemDescription>
                            ⭐ {salon['rating_average'].toFixed(1)} ({salon['rating_count'] || 0} reviews)
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    ) : null}
                  </ItemGroup>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/customer/book/${salon['id']}`}>
                      View salon
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <Empty>
                <EmptyMedia variant="icon">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No locations found</EmptyTitle>
                  <EmptyDescription>
                    This chain hasn&apos;t listed individual salon locations yet.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  Check back soon for new locations or follow the chain for updates.
                </EmptyContent>
              </Empty>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
